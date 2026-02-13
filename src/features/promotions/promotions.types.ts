export interface Promotion {
  id: number;
  name: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "BUNDLE";
  percent_off?: number;
  flat_amount?: number;
  active: boolean;
  valid_from: string;
  valid_to: string;
}

export interface ActivePromotionsResponse {
  data: Promotion[];
}

export interface ExpiredPromotionsResponse {
  data: Promotion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
