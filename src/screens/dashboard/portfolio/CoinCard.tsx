import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  name: string;
  subtitle: string;
  price: string;
  change: string;
  btcValue: string;
  btcChange: string;
  time: string;
  icon: string;
  data: number[];
}

export default function CoinCard({
  name,
  subtitle,
  price,
  change,
  btcValue,
  btcChange,
  time,
  icon,
  data,
}: Props) {
  const chartData = data.map((value, i) => ({ value, i }));

  const changeColor = change.includes("-")
    ? "text-destructive"
    : "text-[#119B56]";

  const btcChangeColor = btcChange.includes("-")
    ? "text-destructive"
    : "text-[#119B56]";

  return (
    <div className="bg-white rounded-[10px] border h-57">
      {/* Header */}
      <div className="flex justify-between items-start ">
        <div className="flex gap-3 items-center p-4">
          <img src={icon} className="w-10 h-10" />
          <div>
            <p className="text-foreground font-h4-400">{name}</p>
            <p className="text-[#878787] body-text1-400">{subtitle}</p>
          </div>
        </div>

        <div className="text-right p-4">
          <div className="flex items-center gap-4">
            <p className="text-foreground body-text-400">{price}</p>
            <p className={`body-text1-400 ${changeColor}`}>{change}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm">{btcValue}</p>
            <p className={`body-text1-400 ${btcChangeColor}`}>{btcChange}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={name} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52B5B0" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#52B5B0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="#52B5B0"
              strokeWidth={2}
              fill={`url(#${name})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="relative bottom-15 flex  justify-between items-center text-xs p-4">
        <button className="flex items-center gap-2 text-primary font-medium">
          <div className="bg-[#52B5B0]/15 p-2 rounded-full min-w-fit">↗</div>
          {name} Price Charts
        </button>

        <p className="text-gray-400">{time}</p>
      </div>
    </div>
  );
}
