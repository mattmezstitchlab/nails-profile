"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, Compass, PanelsTopLeft, User, PackageCheck } from "lucide-react";
import Logo from "./Logo";

const mobileLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/create", label: "Créer", icon: ScanLine },
  { href: "/explore", label: "Explorer", icon: Compass },
  { href: "/my-creations", label: "Créations", icon: PanelsTopLeft },
  { href: "/profile", label: "Profil", icon: User },
];

const desktopLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/profile", label: "Mon Nail Profile", icon: User },
  { href: "/create", label: "Créer", icon: ScanLine },
  { href: "/explore", label: "Explorer", icon: Compass },
  { href: "/my-creations", label: "Mes créations", icon: PanelsTopLeft },
  { href: "/orders", label: "Commandes", icon: PackageCheck },
  { href: "/creator", label: "Créateur", icon: ScanLine },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white/80 backdrop-blur-xl border-r border-line/50 flex-col py-8 px-4 z-50">
        <div className="mb-10 px-2">
          <Logo size="md" />
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {desktopLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-rose/10 text-rose"
                    : "text-ink-light/70 hover:text-ink hover:bg-ivory-dark"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pt-4 border-t border-line/50">
          <p className="text-xs text-ink-light/30">© NAIL PROFILE 2026</p>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-line/50 flex items-center justify-around py-2 z-50 safe-bottom">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-rose" : "text-ink-light/40"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-16" />
    </>
  );
}
