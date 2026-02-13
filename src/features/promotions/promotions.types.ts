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
  application_method: "CODE" | "DISCOUNT";
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

export type FormValues = {
  name: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  application_method: "CODE" | "DISCOUNT";
  percent_off?: string;
  flat_amount?: string;
  valid_from: string;
  valid_to: string;
  active: boolean;
};

export type CreatePromotionPayload = {
  name: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  application_method: "CODE" | "DISCOUNT";
  percent_off?: number;
  flat_amount?: number;
  valid_from: string;
  valid_to: string;
  active: boolean;
};
