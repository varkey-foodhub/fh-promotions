import { validate } from "@/src/features/promotions/promotions.conditions.validator";
import Toast from "react-native-toast-message";
import { call, put, select } from "redux-saga/effects";
import { getCart } from "./cart.selector";
import { removePromotionRequest, resetCart, setTotals } from "./cart.slice";

export function* recalculate() {
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
