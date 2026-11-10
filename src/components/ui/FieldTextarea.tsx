import { type TextareaHTMLAttributes, type ReactNode } from "react";
import { TextField, TextArea, FieldError } from "react-aria-components";
import { Label } from "../base/input/label";
import { HintText } from "../base/input/hint-text";
export type FieldTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: ReactNode;
  error?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
};
export function FieldTextarea({
  label,
  hint,
  error,
  isInvalid,
  isDisabled,
  required,
  disabled,
  readOnly,
  name,
  value,
  defaultValue,
  className,
  onChange,
  ...props
}: FieldTextareaProps) {
  return (
    <TextField
      className={`mono-field mono-textarea ${className || ""}`}
      name={name}
      value={value === undefined ? undefined : String(value)}
      defaultValue={
        defaultValue === undefined ? undefined : String(defaultValue)
      }
      isRequired={required}
      isDisabled={disabled || isDisabled}
      isReadOnly={readOnly}
      isInvalid={!!error || isInvalid}
      aria-label={props["aria-label"] || label || props.placeholder}
    >
      {label && <Label isRequired={required}>{label}</Label>}
      <TextArea
        {...props}
        onChange={onChange}
        className="mono-textarea-control"
      />
      {(hint || error) && (
        <HintText isInvalid={!!error || isInvalid}>{error || hint}</HintText>
      )}
      <FieldError className="mono-field-error" />
    </TextField>
  );
}
