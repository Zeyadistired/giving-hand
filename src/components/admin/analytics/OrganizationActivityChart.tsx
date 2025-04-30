
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityData {
  date: string;
  donations: number;
  pickups: number;
  cancellations: number;
}

interface OrganizationActivity {
  id: string;
  name: string;
  activity: ActivityData[];
}

interface OrganizationActivityChartProps {
  data: OrganizationActivity[];
}

export function OrganizationActivityChart({ data }: OrganizationActivityChartProps) {
  const [selectedOrg, setSelectedOrg] = useState<string>(data[0]?.id || "");
  
  const selectedOrgData = data.find(org => org.id === selectedOrg);

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <h3 className="text-lg font-semibold w-full sm:w-auto text-left">Organization Activity Timeline</h3>
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {data.map(org => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px] w-full px-4">
        {selectedOrgData ? (
          <ChartContainer
            config={{
              donations: { label: "Donations", color: "#9b87f5" },
              pickups: { label: "Pickups", color: "#82ca9d" },
              cancellations: { label: "Cancellations", color: "#ff8042" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedOrgData.activity}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: "20px",
                    width: '100%',
                    textAlign: 'center'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="#9b87f5"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="pickups"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  stroke="#ff8042"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select an organization to view activity timeline
          </div>
        )}
      </div>
    </div>
  );
}
