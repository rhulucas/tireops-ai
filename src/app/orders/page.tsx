"use client";

import { useEffect, useState } from "react";

type OrderStatus = "PENDING" | "PRODUCTION" | "QC_CHECK" | "SHIPPED";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "待生产",
  PRODUCTION: "生产中",
  QC_CHECK: "质检中",
  SHIPPED: "已发货",
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
        <p className="mt-1 text-zinc-400">订单状态：PRODUCTION / QC CHECK 等阶段</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">订单号</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">客户</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">规格</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">数量</th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-400">状态</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  暂无订单。运行 seed 或创建订单。
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
