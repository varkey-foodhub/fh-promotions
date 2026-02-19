import { validate } from "@/src/features/promotions/promotions.conditions.validator";
import { Bundle, Promotion } from "@/src/features/promotions/promotions.types";
import { PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { call, put, select } from "redux-saga/effects";
import { recalculate } from "./cart.recalculate.saga";
import { getCart } from "./cart.selector";
import { setAppliedPromotion, setItems, setTotals } from "./cart.slice";

export function* applyPromotionSaga(
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

export function* removePromotionSaga() {
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
