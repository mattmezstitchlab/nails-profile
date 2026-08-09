"use client";

import PageHero, { visualAssets } from "@/components/PageHero";
import AppShell from "@/components/AppShell";
import { ShoppingBag, Clock, Check, Truck, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const orders = [
  {
    id: "ord-001",
    designName: "Sunset Ocean",
    date: "10 août 2026",
    status: "delivered",
    price: "49,90 €",
    tone: "#a7475c",
  },
  {
    id: "ord-002",
    designName: "Chrome Noir",
    date: "20 août 2026",
    status: "in_production",
    price: "54,90 €",
    tone: "#242424",
  },
  {
    id: "ord-003",
    designName: "Y2K Pop",
    date: "25 août 2026",
    status: "shipped",
    price: "39,90 €",
    tone: "#6fc2c7",
  },
];

const statusConfig = {
  delivered: { label: "Livrée", icon: Check, color: "text-green-500", bg: "bg-green-50" },
  in_production: { label: "En production", icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
  shipped: { label: "Expédiée", icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
  confirmed: { label: "Confirmée", icon: Clock, color: "text-rose", bg: "bg-rose-light/10" },
};

export default function OrdersPage() {
  return (
    <AppShell>
      <PageHero
        eyebrow="ORDERS / 01"
        title="Tes créations, en route vers toi."
        description="Suis chaque set, de la validation à la fabrication puis à la livraison, dans une expérience simple et lisible."
        image={visualAssets.festiveHands}
        imageAlt="Main manucurée tenant une boule de Noël brillante"
        label="Suivi de fabrication"
        meta="Du design à la livraison"
        compact
      />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-xs text-rose font-semibold uppercase tracking-widest">Commandes</p>
          <h1 className="text-2xl font-bold text-ink">Mes commandes</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-soft-gray/50 p-5 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div
                  className="w-14 h-16 rounded-xl flex-shrink-0"
                  style={{ background: order.tone }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{order.designName}</h3>
                  <p className="text-xs text-ink-light/40">{order.date}</p>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.bg} ${config.color} text-xs font-medium mt-1.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.label}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">{order.price}</p>
                  <Link href="#" className="text-xs text-rose hover:underline mt-1 inline-block">
                    Détails
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-ink-light/15 mx-auto mb-4" />
            <p className="text-ink-light/40">Aucune commande pour le moment</p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-rose text-white rounded-xl text-sm font-semibold hover:bg-rose-dark transition-all"
            >
              Explorer les créations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
