import type { ReactNode } from "react";

type PageSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function PageSection({
  title,
  description,
  children,
  className = "",
  id,
}: PageSectionProps) {
  return (
    <section id={id} className={`page-section ${className}`.trim()}>
      {(title || description) && (
        <div className="page-section__intro">
          {title ? <h2 className="page-section__title">{title}</h2> : null}
          {description ? (
            <p className="page-section__description">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}
