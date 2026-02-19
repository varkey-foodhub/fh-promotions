import { MenuItem } from "@/src/features/menu/menu.types";
import { validate } from "@/src/features/promotions/promotions.conditions.validator";
import { Bundle, Promotion } from "@/src/features/promotions/promotions.types";
import { PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  addItemRequest,
  applyPromotionRequest,
  clearCartRequest,
  decrementRequest,
  incrementRequest,
  removeItemRequest,
  removePromotionRequest,
  resetCart,
  setAppliedPromotion,
  setItems,
  setTotals,
} from "./cart.slice";
import { RootState } from "./index";

// -----------------------------------------------
// SELECTOR
// -----------------------------------------------
const getCart = (state: RootState) => state.cart;

// -----------------------------------------------
// RECALCULATE (core logic, called by all sagas)
// -----------------------------------------------
function* recalculate() {
  const { items, appliedPromotion } = yield select(getCart);

  const totalItems = items.reduce((acc: number, i: any) => acc + i.quantity, 0);
  const subtotalRaw = items.reduce(
    (acc: number, i: any) => acc + i.quantity * i.price,
    0,
  );
  const subtotal = Number(subtotalRaw.toFixed(2));

  // BUNDLE GUARD — remove promo if no paid items remain
  if (appliedPromotion?.type === "BUNDLE") {
    const hasPaidItems = items.some((i: any) => !i.isPromotional);
    if (!hasPaidItems) {
      yield put(removePromotionRequest());
      Toast.show({
        type: "info",
        text1: "Promotion Removed",
        text2: "Required items no longer in cart",
      });
      return;
    }
  }

  // Validate existing promotion against current cart
  if (appliedPromotion) {
    const order = {
      items: items.map((i: any) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
      })),
      total: subtotal,
    };
    const validationResult: { valid: boolean; error?: string } = yield call(
      validate,
      appliedPromotion,
      order,
    );

    if (!validationResult.valid) {
      yield put(removePromotionRequest());
      Toast.show({
        type: "info",
        text1: "Promotion Removed",
        text2: "Cart no longer meets the required conditions",
      });
      return;
    }
  }

  // Empty cart reset
  if (subtotal === 0 && items.length === 0) {
    yield put(resetCart());
    return;
  }

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromotion) {
    if (
      appliedPromotion.type === "PERCENTAGE" &&
      appliedPromotion.percent_off
    ) {
      discountAmount = (subtotal * appliedPromotion.percent_off) / 100;
    } else if (
      appliedPromotion.type === "FIXED" &&
      appliedPromotion.flat_amount
    ) {
      discountAmount = Number(appliedPromotion.flat_amount);
    }
  }

  discountAmount = Math.min(discountAmount, subtotal);
  const total = Number((subtotal - discountAmount).toFixed(2));

  yield put(
    setTotals({
      totalItems,
      subtotal,
      discountAmount: Number(discountAmount.toFixed(2)),
      total,
    }),
  );
}

// -----------------------------------------------
// CART ACTION SAGAS
// -----------------------------------------------
function* addItemSaga(action: PayloadAction<{ item: MenuItem; qty?: number }>) {
  const { item, qty = 1 } = action.payload;
  if (item.out_of_stock) return;

  const { items } = yield select(getCart);
  const existing = items.find((i: any) => i.id === item.id && !i.isPromotional);

  const updatedItems = existing
    ? items.map((i: any) =>
        i.id === item.id && !i.isPromotional
          ? { ...i, quantity: i.quantity + qty }
          : i,
      )
    : [...items, { ...item, quantity: qty, isPromotional: false }];

  yield put(setItems(updatedItems));
  yield call(recalculate);
}

function* removeItemSaga(
  action: PayloadAction<{ id: number; isPromotional?: boolean }>,
) {
  const { id, isPromotional = false } = action.payload;
  const { items } = yield select(getCart);

  const updatedItems = items.filter(
    (i: any) => !(i.id === id && i.isPromotional === isPromotional),
  );

  yield put(setItems(updatedItems));
  yield call(recalculate);
}

function* incrementSaga(
  action: PayloadAction<{ id: number; isPromotional?: boolean }>,
) {
  const { id, isPromotional = false } = action.payload;
  const { items } = yield select(getCart);

  const updatedItems = items.map((i: any) =>
    i.id === id && i.isPromotional === isPromotional
      ? { ...i, quantity: i.quantity + 1 }
      : i,
  );

  yield put(setItems(updatedItems));
  yield call(recalculate);
}

function* decrementSaga(
  action: PayloadAction<{ id: number; isPromotional?: boolean }>,
) {
  const { id, isPromotional = false } = action.payload;
  const { items } = yield select(getCart);

  const updatedItems = items
    .map((i: any) =>
      i.id === id && i.isPromotional === isPromotional
        ? { ...i, quantity: i.quantity - 1 }
        : i,
    )
    .filter((i: any) => i.quantity > 0);

  yield put(setItems(updatedItems));
  yield call(recalculate);
}

function* clearCartSaga() {
  yield put(resetCart());
}

// -----------------------------------------------
// PROMOTION SAGAS
// -----------------------------------------------
function* applyPromotionSaga(
  action: PayloadAction<{
    promotion: Promotion;
    resolvedBundleItems: Bundle[];
  }>,
) {
  const { promotion, resolvedBundleItems } = action.payload;
  const now = new Date();

  const isValid =
    promotion.active &&
    new Date(promotion.valid_from) <= now &&
    (!promotion.valid_to || new Date(promotion.valid_to) >= now);

  if (!isValid) {
    Toast.show({ type: "error", text1: "Promotion Expired" });
    return;
  }

  const { items, subtotal } = yield select(getCart);
  const order = {
    items: items.map((i: any) => ({
      id: i.id,
      quantity: i.quantity,
      price: i.price,
    })),
    total: subtotal,
  };

  const validationResult: { valid: boolean; error?: string } = yield call(
    validate,
    promotion,
    order,
  );

  if (!validationResult.valid) {
    Toast.show({
      type: "error",
      text1: "Cannot Apply",
      text2: validationResult.error,
    });
    return;
  }

  // Bundle logic
  if (promotion.type === "BUNDLE") {
    if (!resolvedBundleItems || resolvedBundleItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Bundle Error",
        text2: "Bundle items missing",
      });
      return;
    }

    const updatedItems = [...items];
    resolvedBundleItems.forEach((bundleItem: Bundle) => {
      const existingPromo = updatedItems.find(
        (i) => i.id === bundleItem.item_id && i.isPromotional === true,
      );
      if (existingPromo) {
        existingPromo.quantity += bundleItem.quantity;
      } else {
        updatedItems.push({
          id: bundleItem.item_id,
          name: bundleItem.name,
          price: 0,
          out_of_stock: false,
          quantity: bundleItem.quantity,
          isPromotional: true,
        });
      }
    });

    yield put(setItems(updatedItems));
  }

  yield put(setAppliedPromotion(promotion));
  yield call(recalculate);

  Toast.show({
    type: "success",
    text1: "Promotion Applied",
    text2: `${promotion.name} added to cart`,
  });
}

function* removePromotionSaga() {
  const { items } = yield select(getCart);

  const filteredItems = items.filter((i: any) => !i.isPromotional);
  const subtotal = Number(
    filteredItems
      .reduce((acc: number, i: any) => acc + i.quantity * i.price, 0)
      .toFixed(2),
  );

  yield put(setItems(filteredItems));
  yield put(setAppliedPromotion(null));
  yield put(
    setTotals({
      totalItems: filteredItems.reduce(
        (acc: number, i: any) => acc + i.quantity,
        0,
      ),
      subtotal,
      discountAmount: 0,
      total: subtotal,
    }),
  );
}

// -----------------------------------------------
// ROOT CART SAGA — watches for all actions
// -----------------------------------------------
export function* cartSaga() {
  yield takeLatest(addItemRequest.type, addItemSaga);
  yield takeLatest(removeItemRequest.type, removeItemSaga);
  yield takeLatest(incrementRequest.type, incrementSaga);
  yield takeLatest(decrementRequest.type, decrementSaga);
  yield takeLatest(clearCartRequest.type, clearCartSaga);
  yield takeLatest(applyPromotionRequest.type, applyPromotionSaga);
  yield takeLatest(removePromotionRequest.type, removePromotionSaga);
}
