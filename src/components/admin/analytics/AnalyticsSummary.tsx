
import { DashboardCard } from "./DashboardCard";
import { Users, FileBarChart, FileText, Calendar } from "lucide-react";

interface SummaryData {
  totalUsers: number;
  ticketsCreated: number;
  ticketsAccepted: number;
  ticketsDeclined: number;
  totalDonations: number;
  totalSubscriptions: number;
}

interface AnalyticsSummaryProps {
  data: SummaryData;
}

export function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
  const acceptanceRate = data.ticketsCreated > 0 
    ? ((data.ticketsAccepted / data.ticketsCreated) * 100).toFixed(1) 
    : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Users"
        value={data.totalUsers}
        icon={<Users className="h-8 w-8" />}
        footer={`Active across all user types`}
      />
      <DashboardCard
        title="Tickets"
        value={data.ticketsCreated}
        icon={<FileText className="h-8 w-8" />}
        footer={`${data.ticketsAccepted} accepted (${acceptanceRate}%)`}
      />
      <DashboardCard
        title="Donations"
        value={data.totalDonations}
        icon={<FileBarChart className="h-8 w-8" />}
        footer="Total monetary donations"
      />
      <DashboardCard
        title="Subscriptions"
        value={data.totalSubscriptions}
        icon={<Calendar className="h-8 w-8" />}
        footer="Active premium accounts"
      />
    </div>
  );
}
