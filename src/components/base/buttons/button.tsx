"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export interface ButtonProps extends Omit<
  AriaButtonProps,
  "className" | "children"
> {
  children: ReactNode;
  color?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  iconTrailing?: ReactNode;
  className?: string;
}

/**
 * GOMONO's full-size action button follows the same React Aria composition,
 * semantic variants and pressed/focus/disabled state model as the imported
 * Untitled UI base controls already used in the app.
 */
export function Button({
  children,
  color = "primary",
  size = "md",
  iconTrailing,
  className,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={({ isPressed, isHovered, isFocusVisible, isDisabled }) =>
        cx(
          "mono-action-button",
          `mono-action-${color}`,
          `mono-action-${size}`,
          isPressed && "is-pressed",
          isHovered && "is-hovered",
          isFocusVisible && "is-focus-visible",
          isDisabled && "is-disabled",
          className,
        )
      }
    >
      <span className="mono-action-label">{children}</span>
      {iconTrailing && (
        <span className="mono-action-icon" aria-hidden="true">
          {iconTrailing}
        </span>
      )}
    </AriaButton>
  );
}
