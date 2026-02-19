import { MenuItem } from "@/src/features/menu/menu.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";
import { recalculate } from "./cart.recalculate.saga";
import { getCart } from "./cart.selector";
import { resetCart, setItems } from "./cart.slice";

export function* addItemSaga(
  action: PayloadAction<{ item: MenuItem; qty?: number }>,
) {
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

export function* removeItemSaga(
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

export function* incrementSaga(
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

export function* decrementSaga(
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

export function* clearCartSaga() {
  yield put(resetCart());
}
