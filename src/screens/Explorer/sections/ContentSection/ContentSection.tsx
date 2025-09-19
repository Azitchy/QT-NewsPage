import { StatisticsSection } from "./StatisticsSection";
import { ChartSection } from "./ChartSection";
import { DashboardSection } from "./DashboardSection";

export const ContentSection = () => {
  return (
    <section className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      <DashboardSection />
      <StatisticsSection />
      <ChartSection />
    </section>
  );
};
