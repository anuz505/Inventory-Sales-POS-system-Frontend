import { Leaderboard3 } from "@/components/products/leaderboard3";
import { ChartPieDonutText } from "@/components/ui/chart-pie-donut-text";
import { SectionCards } from "@/components/ui/section-cards";
import { ChartAreaInteractive } from "@/components/charts/profit-sales-chart";
import SidebarWrapper from "@/providers/sidebar-provider";
// import RevenueMarginChart from "@/components/charts/composed-chart";
import RevenueProfitChart from "@/components/charts/chart";
import FiltersDashboard from "@/components/common/filtersdashboard";
export default function Home() {
  return (
    <div>
      <FiltersDashboard />
      <SectionCards />
      <div className="p-6 mt-10">
        <RevenueProfitChart />
      </div>
      <div className="flex p-6 gap-5 flex-wrap ">
        <Leaderboard3 />
        <ChartPieDonutText />
      </div>
    </div>
  );
}
