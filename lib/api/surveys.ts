import { apiFetch } from "./client";

export type SurveyOption = {
  code: string;
  label: string;
  sortOrder: number;
};

export type AfterPurchaseSurvey = {
  id: string;
  context: "after_purchase";
  name: string;
  description: string;
  options: SurveyOption[];
};

export type SurveyAnswerResponse = {
  answerId: string;
  optionCode: string;
  submittedAt: string;
};

export const AFTER_PURCHASE_SURVEY_QUERY_KEY = ["surveys", "after-purchase"] as const;

export function fetchAfterPurchaseSurvey(): Promise<AfterPurchaseSurvey> {
  return apiFetch<AfterPurchaseSurvey>("/api/v1/surveys/after-purchase");
}

export function submitAfterPurchaseSurveyAnswer(input: {
  orderId: string;
  optionCode: string;
}): Promise<SurveyAnswerResponse> {
  return apiFetch<SurveyAnswerResponse>("/api/v1/surveys/after-purchase/answers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
