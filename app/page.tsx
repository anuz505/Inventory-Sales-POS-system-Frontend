import { Leaderboard3 } from "@/components/leaderboard3";
import { ChartPieDonutText } from "@/components/ui/chart-pie-donut-text";
import { SectionCards } from "@/components/ui/section-cards";
import { ChartAreaInteractive } from "@/components/charts/profit-sales-chart";
export default function Home() {
  return (
    <div>
      <SectionCards />
      <div>
        <ChartAreaInteractive />
      </div>
      <div className="flex p-6 gap-5">
        <Leaderboard3 />
        <ChartPieDonutText />
      </div>
    </div>
  );
}
