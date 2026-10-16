import { Testimonials } from "@/components/common/Prismic/testimonial";
import { fetchReviews } from "@/lib/api/reviews";
import { logger } from "@/lib/logger";
import { DEFAULT_CTA_LABEL } from "@/lib/prismic/cta";

export type BackendReviewsProps = {
  ctaLabel?: string;
  ctaHref?: string;
  signupSource?: string;
};

/** Backend-driven review block shared by the standalone Reviews and Explore slices. */
export async function BackendReviews({
  ctaLabel = DEFAULT_CTA_LABEL,
  ctaHref,
  signupSource,
}: BackendReviewsProps = {}) {
  let content;
  try {
    content = await fetchReviews();
  } catch (error) {
    logger.warn({ name: "reviews", err: error }, "failed to fetch published reviews");
    return null;
  }

  return (
    <Testimonials
      heading={content.heading}
      items={content.reviews.map((review) => ({
        id: review.id,
        quote: review.body,
        authorName: review.reviewerName,
        authorSource: review.reviewerSource ?? "",
        rating: review.rating,
      }))}
      ctaLabel={ctaLabel}
      ctaMobileLabel={ctaLabel}
      ctaHref={ctaHref}
      signupSource={signupSource}
      showCta
    />
  );
}
