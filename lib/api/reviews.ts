import { apiFetch } from "./client";

export type PublicReview = {
  id: string;
  body: string;
  reviewerName: string;
  reviewerSource: string | null;
  rating: 5;
};

export type PublicReviewsResponse = {
  heading: string;
  reviews: PublicReview[];
};

/** Public review content selected by the backend from the currently published pool. */
export function fetchReviews(): Promise<PublicReviewsResponse> {
  return apiFetch<PublicReviewsResponse>("/api/v1/reviews");
}
