import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Arrow icon helper with micro-translate
 */
const ArrowIcon = ({ className = "" }) => (
  <svg
    className={cn(
      "ml-[0.35em] size-[0.6em] translate-y-0.5 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100",
      className
    )}
    fill="none"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Link000: Underline Left-to-Right (clean)
 */
export const Link000 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-colors",
    "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.06em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100",
    className
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        {children}
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      {children}
    </Link>
  );
};

/**
 * Link001: Underline Left-to-Right + 45° arrow reveal
 */
export const Link001 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-colors",
    "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.06em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:origin-left hover:before:scale-x-100",
    className
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        {children}
        <ArrowIcon />
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        {children}
        <ArrowIcon />
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      {children}
      <ArrowIcon />
    </Link>
  );
};

/**
 * Link002: Underline Right-to-Left + 45° arrow reveal
 */
export const Link002 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-colors",
    "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.06em] before:w-full before:bg-current before:content-['']",
    "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "before:origin-left",
    "hover:before:origin-right hover:before:scale-x-100",
    className
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        {children}
        <ArrowIcon />
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        {children}
        <ArrowIcon />
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      {children}
      <ArrowIcon />
    </Link>
  );
};

/**
 * Link003: Center-outward Underline Expansion + arrow reveal
 */
export const Link003 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-colors",
    "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.06em] before:w-full before:bg-current before:content-['']",
    "before:origin-center before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:scale-x-100",
    className
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        {children}
        <ArrowIcon />
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        {children}
        <ArrowIcon />
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      {children}
      <ArrowIcon />
    </Link>
  );
};

/**
 * Link004: Cursor.com-style vertical height expansion fill on hover
 */
export const Link004 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-all px-2.5 py-1 rounded-full",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[#c27838]/15 dark:before:bg-[#c27838]/25 before:content-['']",
    "before:h-0 before:opacity-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "hover:before:h-full hover:before:opacity-100 hover:text-[#c27838] dark:hover:text-[#d68d4d]",
    className
  );

  const innerSvg = (
    <svg
      className="ml-[0.4em] size-[0.6em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"
      fill="none"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        <span className="relative z-10 flex items-center">
          {children}
          {innerSvg}
        </span>
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        <span className="relative z-10 flex items-center">
          {children}
          {innerSvg}
        </span>
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      <span className="relative z-10 flex items-center">
        {children}
        {innerSvg}
      </span>
    </Link>
  );
};

/**
 * Link005: Cursor.com-style horizontal pill expansion fill on hover
 */
export const Link005 = ({
  children,
  href,
  to,
  className,
  onClick,
  ...props
}) => {
  const target = to || href;
  const isExternal = typeof target === 'string' && (target.startsWith("http") || target.startsWith("mailto:") || target.startsWith("#"));

  const commonClass = cn(
    "group relative inline-flex items-center cursor-pointer transition-all px-3 py-1.5 rounded-full overflow-hidden",
    "before:pointer-events-none before:absolute before:inset-0 before:bg-white dark:before:bg-[#141c15] before:content-['']",
    "before:scale-x-0 before:origin-left before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.16,1,0.3,1)]",
    "hover:before:scale-x-100 hover:shadow-md",
    className
  );

  const innerSvg = (
    <svg
      className="ml-[0.4em] size-[0.6em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      fill="none"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!target && onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClass} {...props}>
        <span className="relative z-10 flex items-center">
          {children}
          {innerSvg}
        </span>
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={target}
        target={target.startsWith("http") ? "_blank" : undefined}
        rel={target.startsWith("http") ? "noreferrer" : undefined}
        onClick={onClick}
        className={commonClass}
        {...props}
      >
        <span className="relative z-10 flex items-center">
          {children}
          {innerSvg}
        </span>
      </a>
    );
  }

  return (
    <Link to={target || "/"} onClick={onClick} className={commonClass} {...props}>
      <span className="relative z-10 flex items-center">
        {children}
        {innerSvg}
      </span>
    </Link>
  );
};

export const Skiper40 = () => {
  return (
    <section className="h-full snap-y snap-mandatory overflow-y-scroll">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
        <Link001 href="mailto:support@resumeiq.pro">support@resumeiq.pro</Link001>
        <Link002 href="mailto:support@resumeiq.pro">support@resumeiq.pro</Link002>
        <Link003 href="mailto:support@resumeiq.pro">support@resumeiq.pro</Link003>
        <Link004 href="mailto:support@resumeiq.pro">support@resumeiq.pro</Link004>
        <Link005 href="mailto:support@resumeiq.pro">support@resumeiq.pro</Link005>
      </div>
    </section>
  );
};

export default Skiper40;
