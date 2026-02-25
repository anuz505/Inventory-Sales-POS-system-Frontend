import { SectionCards } from "@/components/ui/section-cards";
import RevenueProfitChart from "@/components/charts/chart";
import FiltersDashboard from "@/components/filters/filtersdashboard";
import DashboardDataFlow from "@/components/dashboard/dashboard-data-flow";
export default function Home() {
  return (
    <div>
      <FiltersDashboard />
      <SectionCards />
      <div className="p-6 ">
        <RevenueProfitChart />
      </div>
      <DashboardDataFlow />
    </div>
  );
}
