import { Leaderboard3 } from "@/components/leaderboard3";
import { ChartPieDonutText } from "@/components/ui/chart-pie-donut-text";
import { SectionCards } from "@/components/ui/section-cards";
import { ChartAreaInteractive } from "@/components/charts/profit-sales-chart";
import SidebarWrapper from "@/providers/sidebar-provider";
import RevenueMarginChart from "@/components/composed-chart";
export default function Home() {
  return (
    <SidebarWrapper>
      <div>
        <SectionCards />
        <div>{/* <ChartAreaInteractive /> */}</div>
        <div className="p-6 mt-10">
          <RevenueMarginChart />
        </div>
        <div className="flex p-6 gap-5 flex-wrap ">
          <Leaderboard3 />
          <ChartPieDonutText />
        </div>
      </div>
    </SidebarWrapper>
  );
}
