export interface Promotion {
  id: number;
  name: string;
  code: string;
  type: "PERCENTAGE" | "FIXED" | "BUNDLE";
  percent_off?: number;
  flat_amount?: number;
  active: boolean;
}

export interface ActivePromotionsResponse {
  data: Promotion[];
}

export interface ExpiredPromotionsResponse {
  data: Promotion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
