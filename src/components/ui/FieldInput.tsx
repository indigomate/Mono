import {
  type ComponentType,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { FieldError } from "react-aria-components";
import { TextField, InputBase } from "../base/input/input";
import { InputGroup } from "../base/input/input-group";
import { Label } from "../base/input/label";
import { HintText } from "../base/input/hint-text";
/** GOMONO adapter: native field contracts remain stable; React Aria owns labeling,
 * focus and validation. onValueChange offers Untitled UI's string-value API.
 * Dates/times/numbers retain native mobile pickers and constraint validation.
 */
export type FieldInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  prefix?: string;
  tooltip?: string;
  icon?: ComponentType<HTMLAttributes<HTMLOrSVGElement>>;
  ref?: Ref<HTMLInputElement>;
  onValueChange?: (value: string) => void;
};
export function FieldInput({
  label,
  hint,
  error,
  isInvalid,
  isDisabled,
  size = "md",
  prefix,
  tooltip,
  icon,
  ref,
  onValueChange,
  className,
  required,
  disabled,
  readOnly,
  name,
  type = "text",
  value,
  defaultValue,
  onChange,
  ...native
}: FieldInputProps) {
  const invalid = !!error || isInvalid;
  const root = {
    name,
    isRequired: required,
    isDisabled: disabled || isDisabled,
    isReadOnly: readOnly,
    isInvalid: invalid,
    value: value === undefined ? undefined : String(value),
    defaultValue: defaultValue === undefined ? undefined : String(defaultValue),
    onChange: onValueChange,
    "aria-label":
      native["aria-label"] || (!label ? native.placeholder : undefined),
    className: `mono-field ${className || ""}`,
    "data-mono-icon": icon ? "true" : undefined,
    "data-mono-prefix": prefix ? "true" : undefined,
    "data-input-kind": type,
    "data-mono-tooltip": tooltip ? "true" : undefined,
  };
  const input = (
    <InputBase
      {...native}
      ref={ref}
      type={type}
      size={size}
      isRequired={required}
      isDisabled={disabled || isDisabled}
      isInvalid={invalid}
      tooltip={tooltip}
      icon={icon}
      onChange={onChange}
    />
  );
  return prefix ? (
    <InputGroup
      {...root}
      size={size}
      label={label}
      prefix={prefix}
      hint={
        <>
          {error || hint}
          <FieldError className="mono-field-error" />
        </>
      }
    >
      {input}
    </InputGroup>
  ) : (
    <TextField {...root} size={size}>
      {label && <Label isRequired={required}>{label}</Label>}
      {input}
      {(error || hint) && (
        <HintText isInvalid={invalid}>{error || hint}</HintText>
      )}
      <FieldError className="mono-field-error" />
    </TextField>
  );
}
