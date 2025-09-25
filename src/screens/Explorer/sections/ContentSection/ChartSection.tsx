import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { CopyIcon } from "lucide-react";
import CryptoChart from "./CryptoChart";
import { getCoinCurrency, fetchCoinPriceTrend, CoinCurrency, PriceTrendData } from "../../../../lib/webApi";

type TimeFrame = "day" | "week" | "month";

interface TimeFrameOption {
  label: string;
  value: TimeFrame;
}

interface CryptoCurrency {
  name: string;
  icon: string;
  price: string;
  change: string;
  changeType: "positive" | "negative";
  changeIcon: string;
  staked: string;
  connections: string;
  contractAddress: string;
  chartData: {
    day: Array<{ date: string; price: number }>;
    week: Array<{ date: string; price: number }>;
    month: Array<{ date: string; price: number }>;
  };
}

const timeFrameOptions: TimeFrameOption[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

// Helper function to ensure values are numbers
const ensureNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

export const ChartSection = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("day");
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coinData: CoinCurrency[] = await getCoinCurrency();
        
        // Filter out coins that don't have valid price data
        const validCoins = coinData.filter(coin => 
          coin.nowPrice && coin.nowPrice > 0 && coin.baseCurrency
        );

        if (validCoins.length === 0) {
          setError("No valid cryptocurrency data available");
          setCryptoData([]);
          return;
        }
        
        const cryptoCurrencies: CryptoCurrency[] = await Promise.all(
          validCoins.map(async (coin) => {
            let chartData = {
              day: [] as Array<{ date: string; price: number }>,
              week: [] as Array<{ date: string; price: number }>,
              month: [] as Array<{ date: string; price: number }>,
            };

            try {
              // Fetch price trend data for each timeframe  
              const currencyName = coin.baseCurrency || coin.linkCurrency || coin.name || coin.symbol || '';
              const dayData = await fetchCoinPriceTrend(currencyName, "1");
              const weekData = await fetchCoinPriceTrend(currencyName, "2");
              const monthData = await fetchCoinPriceTrend(currencyName, "3");

              // Only use chart data if we have valid data, otherwise skip fallback
              if (dayData.x && dayData.y && dayData.x.length > 0 && dayData.y.length > 0) {
                chartData.day = dayData.x.map((date: string, index: number) => ({
                  date: date,
                  price: ensureNumber(dayData.y?.[index])
                })).filter(point => point.price > 0); // Filter out invalid price points
              }

              if (weekData.x && weekData.y && weekData.x.length > 0 && weekData.y.length > 0) {
                chartData.week = weekData.x.map((date: string, index: number) => ({
                  date: date,
                  price: ensureNumber(weekData.y?.[index])
                })).filter(point => point.price > 0);
              }

              if (monthData.x && monthData.y && monthData.x.length > 0 && monthData.y.length > 0) {
                chartData.month = monthData.x.map((date: string, index: number) => ({
                  date: date,
                  price: ensureNumber(monthData.y?.[index])
                })).filter(point => point.price > 0);
              }

            } catch (chartError) {
              console.warn(`Failed to fetch chart data for ${coin.baseCurrency}:`, chartError);
              // Don't use fallback data - leave arrays empty if API fails
            }

            // Calculate price change from trend data if available
            let changeValue = 0;
            let changeType: "positive" | "negative" = "positive";
            let formattedChange = "0.00%";

            // Try to calculate change from day data
            if (chartData.day.length >= 2) {
              const firstPrice = chartData.day[0].price;
              const lastPrice = chartData.day[chartData.day.length - 1].price;
              changeValue = ((lastPrice - firstPrice) / firstPrice) * 100;
              changeType = changeValue >= 0 ? "positive" : "negative";
              formattedChange = changeValue >= 0 ? `+${changeValue.toFixed(2)}%` : `${changeValue.toFixed(2)}%`;
            } else if (coin.pre) {
              // Fallback to API's pre field if it exists
              changeValue = ensureNumber(coin.pre);
              changeType = changeValue >= 0 ? "positive" : "negative";
              formattedChange = changeValue >= 0 ? `+${changeValue.toFixed(2)}%` : `${changeValue.toFixed(2)}%`;
            }

            const changeIcon = changeValue >= 0 ? "/arrow-up.svg" : "/arrow-down.svg";

            return {
              name: coin.baseCurrency || 'Unknown',
              icon: coin.currencyLogo || `/${(coin.baseCurrency || 'unknown').toLowerCase()}-icon.svg`,
              price: ensureNumber(coin.nowPrice).toFixed(coin.pricePlaces || 6),
              change: formattedChange,
              changeType,
              changeIcon,
              staked: coin.totalAmount ? ensureNumber(coin.totalAmount).toLocaleString() : "N/A",
              connections: coin.count ? coin.count.toString() : "N/A",
              contractAddress: coin.contractAddress || "N/A",
              chartData,
            };
          })
        );

        // Filter out currencies that don't have any chart data
        const validCryptoCurrencies = cryptoCurrencies.filter(crypto => 
          crypto.chartData.day.length > 0 || 
          crypto.chartData.week.length > 0 || 
          crypto.chartData.month.length > 0
        );

        if (validCryptoCurrencies.length === 0) {
          setError("No chart data available for any cryptocurrencies");
          setCryptoData([]);
        } else {
          setCryptoData(validCryptoCurrencies);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching crypto data:", err);
        setError("Failed to load cryptocurrency data");
        setCryptoData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div>
        <Card className="bg-card rounded-2xl border-[0px] mb-4 shadow-none md:shadow-sm h-[800px] md:h-[650px] lg:h-[570px]">
          <CardContent className="p-0">
            <div className="h-full flex items-center justify-center">
              <div className="text-card-foreground">Loading cryptocurrency data...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="bg-card rounded-2xl border-[0px] mb-4 shadow-none md:shadow-sm h-[800px] md:h-[650px] lg:h-[570px]">
          <CardContent className="p-0">
            <div className="h-full flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cryptoData.length === 0) {
    return (
      <div>
        <Card className="bg-card rounded-2xl border-[0px] mb-4 shadow-none md:shadow-sm h-[800px] md:h-[650px] lg:h-[570px]">
          <CardContent className="p-0">
            <div className="h-full flex items-center justify-center">
              <div className="text-card-foreground">No valid cryptocurrency data with charts available</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {cryptoData.map((crypto) => (
        <Card
          key={crypto.name}
          className="bg-card rounded-2xl border-[0px] mb-4 shadow-none md:shadow-sm h-[800px] md:h-[650px] lg:h-[570px]"
        >
          <CardContent className="p-0 ">
            <div className="flex items-center gap-1 p-6 pb-4">
              <img
                className="w-[18px] h-[18px]"
                alt={`${crypto.name} icon`}
                src={crypto.icon}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/crypto-icon-default.svg`;
                }}
              />
              <span className="text-[14px] leading-[19px] font-normal text-foreground">
                {crypto.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mx-6 pb-6 md:border-b border-border dark:border-primary-foreground">
              <div className="flex flex-col gap-2">
                <span className="hidden md:block text-[12px] leading-[17px] text-card-foreground font-normal">
                  {crypto.name} Price
                </span>
                <div className="relative -top-9 md:-top-0 flex justify-end md:justify-start md:items-center gap-2">
                  <span className="text-sm font-normal text-foreground">
                    {crypto.price}
                  </span>
                  <img
                    className="w-4 h-4"
                    alt="Change indicator"
                    src={crypto.changeIcon}
                  />
                  <span
                    className={`text-sm font-medium ${
                      crypto.changeType === "positive"
                        ? "text-primary"
                        : "text-[#f14349]"
                    }`}
                  >
                    {crypto.change}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-b pb-[15px] md:border-b-0 lg:border-l lg:border-border dark:lg:border-primary-foreground lg:pl-6">
                <span className="text-[12px] leading-[17px] text-card-foreground font-normal">
                  {crypto.name} staked in Consensus Connections
                </span>
                <span className="text-sm font-normal text-foreground">
                  {crypto.staked}
                </span>
              </div>

              <div className="flex md:flex-col justify-between gap-2 border-b pb-[15px] md:border-b-0 lg:border-l lg:border-border dark:lg:border-primary-foreground lg:pl-6">
                <span className="text-[12px] leading-[17px] text-card-foreground font-normal">
                  Number of {crypto.name} Connections
                </span>
                <span className="text-sm font-normal text-foreground">
                  {crypto.connections}
                </span>
              </div>

              <div className="flex flex-col gap-2 lg:border-l lg:border-border dark:lg:border-primary-foreground lg:pl-6">
                <span className="text-[12px] leading-[17px] text-card-foreground font-normal">
                  {crypto.name} contract address
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-card-foreground font-mono truncate">
                    {crypto.contractAddress}
                  </span>
                  {crypto.contractAddress !== "N/A" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 w-6 h-6 hover:bg-gray-100 rounded"
                      onClick={() => copyToClipboard(crypto.contractAddress)}
                    >
                      <CopyIcon className="w-4 h-4 text-primary" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-80 mx-6 mb-6 rounded-xl">
              {crypto.chartData[timeFrame].length > 0 ? (
                <CryptoChart
                  data={crypto.chartData[timeFrame]}
                  name={crypto.name}
                  height={320}
                  color="#2ea8af"
                  timeFrame={timeFrame}
                  timeFrameOptions={timeFrameOptions}
                  onTimeFrameChange={(val) => setTimeFrame(val)}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No chart data available for {timeFrame} timeframe</p>
                    <p className="text-sm mt-1">Try selecting a different time period</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};