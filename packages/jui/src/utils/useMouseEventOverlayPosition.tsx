import {
  AriaPositionProps,
  PositionAria,
  useOverlayPosition,
} from "@react-aria/overlays";
import React, { useRef } from "react";
import { useLayoutEffect } from "@react-aria/utils";

/**
 * `useOverlayPosition` only supports positioning overlay relative to an element, at the moment.
 *  For context menu or tooltip, we may want to position the overlay based on the coordinates of the mouse event which
 *  has triggered the overlay.
 *  This hook wraps `useOverlayPosition`, and is very similar to it, but you don't need to pass `targetRef`. Instead,
 *  you have to call the updatePosition in the event handler that triggers the overlay, passing the `MouseEvent` object.
 *
 * This is hopefully a temporary solution to circumvents the limitation of `useOverlayPosition`, until it supports
 * non-element based positioning as well. It works by appending a dummy 1x1 px element to body and positioning it
 * based on React.MouseEvent objects. Then it uses a ref to that element as the `targetRef`, passed to `useOverlayPosition`
 *
 * @example
 * ```ts
 * const { updatePosition, overlyProps} = useMouseEventOverlayPosition({ overlayRef });
 *
 * const onContextMenu = (event: React.ReactEvent) => {
 *  updatePosition(event);
 *  // ...
 * }
 * ```
 */
export function useMouseEventOverlayPosition(
  options: Omit<AriaPositionProps, "targetRef">
): Omit<PositionAria, "updatePosition"> & {
  updatePosition: (event: React.MouseEvent) => void;
} {
  const targetRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!targetRef.current) {
      const fakeTarget = document.createElement("span");
      Object.assign(fakeTarget.style, {
        width: "0px",
        height: "0px",
        pointerEvents: "none",
        position: "absolute",
        visibility: "hidden",
      });
      document.body.appendChild(fakeTarget);
      // @ts-expect-error We intentionally don't pass null to generic argument, to not have it as a mutable nullable
      // ref, since we are mimicking an element ref.
      targetRef.current = fakeTarget;
      return () => {
        fakeTarget.remove();
      };
    }
  }, []);

  const { updatePosition, ...result } = useOverlayPosition({
    ...options,
    targetRef,
  });

  return {
    ...result,
    /**
     * Ref to be passed to be passed as targetRef
     */
    updatePosition: (e: React.MouseEvent) => {
      if (targetRef.current) {
        targetRef.current.style.left = `${e.clientX}px`;
        targetRef.current.style.top = `${e.clientY}px`;
      }
      updatePosition();
    },
  };
}
