import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetDashboardData } from "@/hooks/useAvatar";
import type { AvatarDashboardData } from "../types";

export default function AvatarDashboard() {
  const { data, loading, execute } = useGetDashboardData();

  useEffect(() => {
    execute();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[#999] text-[14px]">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto">
      {/* ── Top row: chart + balance card ──────────────── */}
      <div className="flex gap-[20px]">
        <LinksActivityChart data={data} />
        <LucaBalanceCard spent={data.spent} total={data.total} currency={data.currency} />
      </div>

      {/* ── Links table ──────────────────────────────────── */}
      <LinksTable data={data} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Sub‑components                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

function LinksActivityChart({ data }: { data: AvatarDashboardData }) {
  const chartData = data.linksActivity.map((item) => ({
    name: item.name,
    Usage: item.usage,
    Remaining: item.remaining,
  }));

  return (
    <div className="flex-1 rounded-[15px] bg-white border border-[#EBEBEB] p-[20px]">
      <h3 className="text-[16px] font-semibold text-[#1C1C1C] mb-[16px]">
        Your links activity
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#999" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#999" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="Usage" stackId="a" radius={[0, 0, 0, 0]}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill="#100CD8" />
            ))}
          </Bar>
          <Bar dataKey="Remaining" stackId="a" radius={[4, 4, 0, 0]}>
            {chartData.map((_, idx) => (
              <Cell key={idx} fill="#E2E2FA" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LucaBalanceCard({
  spent,
  total,
  currency,
}: {
  spent: number;
  total: number;
  currency: string;
}) {
  return (
    <div className="w-[220px] shrink-0 rounded-[15px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] p-[20px] flex flex-col justify-between text-white">
      <div>
        <p className="text-[12px] opacity-80">Spent</p>
        <p className="text-[28px] font-bold leading-[34px]">
          {spent} <span className="text-[14px] font-normal">{currency}</span>
        </p>
      </div>
      <div className="mt-[20px]">
        <p className="text-[12px] opacity-80">Total balance</p>
        <p className="text-[20px] font-semibold">
          {total} {currency}
        </p>
      </div>
    </div>
  );
}

function LinksTable({ data }: { data: AvatarDashboardData }) {
  return (
    <div className="rounded-[15px] bg-white border border-[#EBEBEB] p-[20px]">
      <h3 className="text-[16px] font-semibold text-[#1C1C1C] mb-[16px]">
        Your links
      </h3>

      {data.links.length === 0 ? (
        <p className="text-[14px] text-[#999]">No links yet.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EBEBEB]">
              <th className="text-[12px] font-medium text-[#999] pb-[10px]">
                Name
              </th>
              <th className="text-[12px] font-medium text-[#999] pb-[10px]">
                Link
              </th>
              <th className="text-[12px] font-medium text-[#999] pb-[10px] text-right">
                LUCA limit
              </th>
            </tr>
          </thead>
          <tbody>
            {data.links.map((link) => (
              <tr key={link.id} className="border-b border-[#F6F6F6] last:border-0">
                <td className="py-[12px] text-[14px] text-[#1C1C1C]">
                  {link.name}
                </td>
                <td className="py-[12px] text-[14px] text-[#8E1BF4] truncate max-w-[260px]">
                  {link.url}
                </td>
                <td className="py-[12px] text-[14px] text-[#1C1C1C] text-right">
                  {link.lucaLimit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
