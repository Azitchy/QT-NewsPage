import { ArrowLeft, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- TYPES ---------------- */

const periods = ["weekly", "monthly", "yearly"] as const;
type Period = (typeof periods)[number];

interface ChartData {
  name: string;
  value: number;
}

const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ---------------- COMPONENT ---------------- */

export default function AGTBarGraph({
  onBack,
  agtBalance,
}: {
  onBack: () => void;
  agtBalance: any;
}) {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<string>("Mar");
  const [period, setPeriod] = useState<Period>("monthly");

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"year" | "month">("year");

  /* ---------------- DATA ---------------- */

  const generateData = (): ChartData[] => {
    if (period === "yearly") {
      return [
        { name: "2022", value: 40 },
        { name: "2023", value: 55 },
        { name: "2024", value: 80 },
        { name: "2025", value: 120 },
      ];
    }

    if (period === "monthly") {
      return Array.from({ length: 31 }, (_, i) => ({
        name: String(i + 1),
        value: i === 2 ? 56 : i === 7 ? 80 : i === 18 ? 120 : 0,
      }));
    }

    return [
      { name: "W1", value: 20 },
      { name: "W2", value: 45 },
      { name: "W3", value: 30 },
      { name: "W4", value: 60 },
    ];
  };

  const data = useMemo(generateData, [year, month, period]);

  /* ---------------- YEARS LIST ---------------- */

  const years = [
    2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen ">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 body-text1-400 text-foreground mb-2.5 cursor-pointer"
      >
        <ArrowLeft
          className="w-6 h-6 text-muted-foreground"
          strokeWidth={1.6}
        />
        Go back
      </button>

      {/* Header */}
      <div className="flex gap-1 mb-2.5">
        <p className="font-h4-400 text-foreground">AGT balance:</p>
        <p className="text-[20px] font-semibold text-foreground">
          {agtBalance}
        </p>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-lg relative">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          {/* DATE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setOpen(!open);
                setView("year");
              }}
              className="flex items-center gap-2 text-foreground body-text-400"
            >
              {month} {year}
              <ChevronDown
                size={25}
                strokeWidth={1}
                className="cursor-pointer"
              />
            </button>

            {open && (
              <div className="absolute mt-2 w-75 bg-white rounded-xl shadow-xl p-4 z-50">
                {/* YEAR VIEW */}
                {view === "year" && (
                  <>
                    <div className="body-text-400 text-foreground mb-4">
                      {year}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setYear(y);
                            setView("month");
                          }}
                          className={`body-text-400 text-foreground py-2 rounded-lg transition
                            ${
                              y === year ? "bg-[#F8F8F8]" : "hover:bg-gray-100"
                            }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* MONTH VIEW */}
                {view === "month" && (
                  <>
                    <div className="body-text-400 text-foreground mb-4">
                      {year}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {monthsShort.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setMonth(m);
                            setOpen(false);
                          }}
                          className={`body-text-400 text-foreground py-2 rounded-lg transition
                            ${
                              m === month ? "bg-[#F8F8F8]" : "hover:bg-gray-100"
                            }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* PERIOD TOGGLE */}
          <div className="bg-[#F8F8F8] rounded-full p-2 flex gap-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-full body-text2-400 capitalize transition cursor-pointer
                  ${
                    period === p
                      ? "bg-[#FFFFFF] text-primary"
                      : "text-foreground"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CHART */}
        <div className="h-96 bg-white rounded-xl py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8979FF" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
