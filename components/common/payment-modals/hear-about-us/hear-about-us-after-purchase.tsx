"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import {
  AFTER_PURCHASE_SURVEY_QUERY_KEY,
  fetchAfterPurchaseSurvey,
  submitAfterPurchaseSurveyAnswer,
} from "@/lib/api/surveys";
import { hasHearAboutUsQuery, HEAR_ABOUT_US_ORDER_PARAM, HEAR_ABOUT_US_PARAM } from "@/lib/routes";

import { HearAboutUs } from "./hear-about-us";
import { HEAR_ABOUT_US_DEFAULT_OPTION_CODE } from "./hear-about-us.constants";

/**
 * Opens after a successful checkout redirect (`?hearAboutUs=1`). Closing
 * (submit, skip, or the X) strips the param so a refresh does not reopen it.
 */
export function HearAboutUsAfterPurchase() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = hasHearAboutUsQuery(searchParams.get(HEAR_ABOUT_US_PARAM));
  const orderId = searchParams.get(HEAR_ABOUT_US_ORDER_PARAM);
  const [dismissedOrderId, setDismissedOrderId] = React.useState<string | null>(null);
  const survey = useQuery({
    queryKey: AFTER_PURCHASE_SURVEY_QUERY_KEY,
    queryFn: fetchAfterPurchaseSurvey,
    enabled: requested && Boolean(orderId),
  });
  const answer = useMutation({ mutationFn: submitAfterPurchaseSurveyAnswer });

  const open =
    requested &&
    Boolean(orderId) &&
    Boolean(survey.data?.options.length) &&
    dismissedOrderId !== orderId;

  const stripHearAboutUsParam = React.useCallback(() => {
    if (!searchParams.has(HEAR_ABOUT_US_PARAM)) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete(HEAR_ABOUT_US_PARAM);
    next.delete(HEAR_ABOUT_US_ORDER_PARAM);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) return;
      setDismissedOrderId(orderId);
      stripHearAboutUsParam();
    },
    [orderId, stripHearAboutUsParam],
  );

  React.useEffect(() => {
    if (requested && !orderId) stripHearAboutUsParam();
  }, [orderId, requested, stripHearAboutUsParam]);

  if (!survey.data || !orderId || survey.data.options.length === 0) return null;

  const defaultValue =
    survey.data.options.find((option) => option.code === HEAR_ABOUT_US_DEFAULT_OPTION_CODE)?.code ??
    survey.data.options[0]!.code;

  return (
    <HearAboutUs
      key={survey.data.id}
      open={open}
      onOpenChange={handleOpenChange}
      title={survey.data.name}
      options={survey.data.options}
      defaultValue={defaultValue}
      onSubmit={(optionCode) => answer.mutateAsync({ orderId, optionCode }).then(() => undefined)}
    />
  );
}
