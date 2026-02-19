import { takeLatest } from "redux-saga/effects";
import {
  addItemSaga,
  clearCartSaga,
  decrementSaga,
  incrementSaga,
  removeItemSaga,
} from "./cart.items.saga";
import {
  applyPromotionSaga,
  removePromotionSaga,
} from "./cart.promotions.saga";
import {
  addItemRequest,
  applyPromotionRequest,
  clearCartRequest,
  decrementRequest,
  incrementRequest,
  removeItemRequest,
  removePromotionRequest,
} from "./cart.slice";

export function* cartSaga() {
  yield takeLatest(addItemRequest.type, addItemSaga);
  yield takeLatest(removeItemRequest.type, removeItemSaga);
  yield takeLatest(incrementRequest.type, incrementSaga);
  yield takeLatest(decrementRequest.type, decrementSaga);
  yield takeLatest(clearCartRequest.type, clearCartSaga);
  yield takeLatest(applyPromotionRequest.type, applyPromotionSaga);
  yield takeLatest(removePromotionRequest.type, removePromotionSaga);
}
