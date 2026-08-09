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
    <span className={`inline-flex items-baseline gap-0.5 font-semibold tracking-tight ${sizes[size]} ${className}`}>
      <span className={dark ? "text-white" : "text-ink"}>NAIL</span>
      <span className="text-rose">PROFILE</span>
    </span>
  );

  if (href === undefined) {
    return (
      <Link href="/" className="inline-flex items-center gap-2">
        {text}
      </Link>
    );
  }

  return text;
}
