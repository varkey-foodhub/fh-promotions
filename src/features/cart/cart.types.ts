/**
 * Product type stored in cart
 */
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};
