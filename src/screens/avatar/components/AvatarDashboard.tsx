import { useEffect, useState } from "react";
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
import { Link2, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/atm/button";

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
      <div className="flex flex-col-reverse lg:flex-row gap-[20px]">
        <LinksActivityChart data={data} />
        <LucaBalanceCard
          spent={data.spent}
          total={data.total}
          currency={data.currency}
        />
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

  const renderLegend = (props: any) => {
    const { payload } = props;

    if (!payload) return null;

    return (
      <div className="flex justify-end gap-6 mb-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-4 h-4"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[13px] text-[#1C1C1C]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 rounded-[15px] bg-card border border-[#EBEBEB] p-[20px]">
      <h3 className="text-[24px] font-medium text-foreground ">
        Your links activity
      </h3>
      <h4 className="mb-[40px] text-[14px] font-normal text-foreground">
        Here you can observe the activity of your links.
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F0F0F0"
          />
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
          <Legend verticalAlign="top" align="right" content={renderLegend} />

          <Bar dataKey="Usage" stackId="a" fill="#100CD8" />

          <Bar
            dataKey="Remaining"
            stackId="a"
            fill="#E2E2FA"
            radius={[4, 4, 0, 0]}
          />
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
    <div className=" lg:w-[250px] shrink-0 rounded-[15px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8] p-[20px] flex flex-col justify-between text-white">
      <div>
        <p className="text-[18px] text-[#EFEFEF] font-medium">You have spent</p>
        <p className="text-[36px] font-light text-[#EFEFEF]">
          {spent}/{total}{" "}
          <span className="text-[24px] font-normal text-[#EFEFEF]">
            {currency}
          </span>
        </p>
      </div>
      <div className="mt-[20px] flex justify-end">
        <div className="bg-white rounded-[30px] px-[15px] py-[8px] w-fit">
          <p className="text-[14px] font-medium text-transparent bg-clip-text bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]">
            Top up the balance
          </p>
        </div>
      </div>
    </div>
  );
}

function LinksTable({ data }: { data: AvatarDashboardData }) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="rounded-[15px] bg-card border border-[#EBEBEB] p-[20px] mb-5 lg:mb-0">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[24px] font-medium text-foreground">Your links</h3>
        <button
          onClick={openModal}
          className="text-[14px] cursor-pointer font-normal text-white w-fit py-[10px] px-[20px] rounded-[30px] bg-gradient-to-b from-[#8E1BF4] to-[#100CD8]"
        >
          Create the link
        </button>
      </div>

      {data.links.length === 0 ? (
        <p className="text-[14px] text-[#999]">No links yet.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EBEBEB]">
              <th className="text-[18px] font-normal text-foreground pb-[10px]">
                Name
              </th>
              <th className="text-[18px] hidden lg:md:table-cell font-normal text-foreground pb-[10px]">
                Link
              </th>
              <th className="text-[18px] font-normal text-foreground pb-[10px]">
                LUCA limit
              </th>
              <th className="pb-[10px]"></th>
            </tr>
          </thead>
          <tbody>
            {data.links.map((link) => (
              <tr
                key={link.id}
                className="border-b border-[#F6F6F6] last:border-0"
              >
                <td className="py-[12px] text-[14px] text-foreground">
                  {link.name}
                </td>
                <td className="py-[12px] hidden lg:table-cell text-[14px] text-foreground truncate max-w-[260px]">
                  {link.url}
                </td>
                <td className="py-[12px] text-[14px] text-[#1C1C1C]">
                  {link.lucaLimit}
                </td>
                <td className="flex gap-[8px] py-[12px] justify-end flex">
                  <Link2
                    className="text-[#434343] cursor-pointer"
                    size={18}
                    onClick={() => handleCopyLink(link.url)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create link modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-[15px] w-[500px] p-[30px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <X
              onClick={closeModal}
              className="absolute right-5 top-5 cursor-pointer"
            />
            <h2 className="text-[20px] font-normal my-6 text-center">
              Create a link
            </h2>

            <label className="body-text2-400 text-foreground">
              Name (optional)
            </label>
            <input className="w-full mt-2 mb-4 bg-[#F8F8F8] text-foreground rounded-[10px] p-3" />

            <label className="body-text2-400 text-foreground">
              Luca limit (optional)
            </label>
            <input
              type="number"
              className="w-full mt-2 mb-8 bg-[#F8F8F8] text-foreground rounded-[10px] p-3"
            />
            <div className="flex justify-center">
              <Button variant="default" className="px-[30px]">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
