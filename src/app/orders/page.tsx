"use client";

import { useEffect, useState } from "react";

type OrderStatus = "PENDING" | "PRODUCTION" | "QC_CHECK" | "SHIPPED";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PRODUCTION: "In production",
  QC_CHECK: "QC check",
  SHIPPED: "Shipped",
};

// Client component - we fetch via API
export default function OrdersPage() {
  const [orders, setOrders] = useState<
    { id: string; orderNumber: string; status: OrderStatus; customerName: string | null; tireSpec: string | null; quantity: number }[]
  >([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Orders</h1>
        <p className="mt-1 text-zinc-400">Order status: PRODUCTION / QC CHECK stages</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Order #</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Customer</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Spec</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Qty</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No orders. Run seed or create orders.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-zinc-800">
                  <td className="px-6 py-4 text-zinc-200">{o.orderNumber}</td>
                  <td className="px-6 py-4 text-zinc-300">{o.customerName || "-"}</td>
                  <td className="px-6 py-4 text-zinc-300">{o.tireSpec || "-"}</td>
                  <td className="px-6 py-4 text-zinc-300">{o.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        o.status === "PRODUCTION"
                          ? "bg-amber-500/20 text-amber-400"
                          : o.status === "QC_CHECK"
                          ? "bg-blue-500/20 text-blue-400"
                          : o.status === "SHIPPED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-zinc-700 text-zinc-400"
                      }`}
                    >
                      {statusLabels[o.status as OrderStatus]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
