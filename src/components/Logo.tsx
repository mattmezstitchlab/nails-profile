import Link from "next/link";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  dark?: boolean;
  href?: string;
};

const sizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
};

export default function Logo({ className = "", size = "md", dark = false, href }: LogoProps) {
  const text = (
    <span
      className={`inline-flex items-baseline gap-0.5 font-semibold tracking-tight ${sizes[size]} ${className}`}
    >
      <span className={dark ? "text-white" : "text-ink"}>AIME</span>
      <span className="text-rose align-super text-[0.6em] -ml-0.5">®</span>
    </span>
  );

  if (href === undefined) {
    return (
      <Link href="/" className="inline-flex items-center gap-2" aria-label="AIME® — Accueil">
        {text}
      </Link>
    );
  }

  return text;
}
