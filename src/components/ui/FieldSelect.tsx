import { type ComponentProps } from "react";
import { NativeSelect } from "../base/select/select-native";
export type FieldSelectProps = ComponentProps<typeof NativeSelect> & {
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
};
export function FieldSelect({
  className,
  error,
  hint,
  isInvalid,
  isDisabled,
  disabled,
  ...props
}: FieldSelectProps) {
  return (
    <NativeSelect
      {...props}
      disabled={disabled || isDisabled}
      aria-invalid={!!error || isInvalid || props["aria-invalid"]}
      hint={error || hint}
      className={`mono-select ${className || ""}`}
    />
  );
}
