import type { ReactNode } from "react";

interface Props { title: string; description?: string; action?: ReactNode }
export default function PageHeader({ title, description, action }: Props) {
  return <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
    <div><h1 className="h3 page-title mb-1">{title}</h1>{description && <p className="text-secondary mb-0">{description}</p>}</div>
    {action}
  </div>;
}
