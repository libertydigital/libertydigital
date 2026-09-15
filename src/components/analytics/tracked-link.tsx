"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ComponentPropsWithoutRef,
  MouseEvent,
} from "react";

import {
  trackGrowthEvent,
  type GrowthEventData,
  type GrowthEventName,
} from "@/lib/analytics";

export type TrackedLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  eventName: GrowthEventName;
  eventData?: GrowthEventData;
};

export function TrackedLink({
  eventName,
  eventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackGrowthEvent(eventName, eventData);
        onClick?.(event);
      }}
    />
  );
}

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: GrowthEventName;
  eventData?: GrowthEventData;
};

export function TrackedAnchor({
  eventName,
  eventData,
  onClick,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        trackGrowthEvent(eventName, eventData);
        onClick?.(event);
      }}
    />
  );
}
