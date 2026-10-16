import type { InputHTMLAttributes } from "react";
interface Props extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; helpText?: string }
export default function FormField({ label, error, helpText, id, ...props }: Props) {
  const fieldId = id ?? props.name;
  return <div className="mb-3"><label className="form-label" htmlFor={fieldId}>{label}</label><input id={fieldId} className={`form-control${error ? " is-invalid" : ""}`} {...props} />{error && <div className="invalid-feedback">{error}</div>}{helpText && !error && <div className="form-text">{helpText}</div>}</div>;
}
