
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  donations: number;
  amount: number;
}

interface DonationTrendsChartProps {
  data: ChartData[];
}

export function DonationTrendsChart({ data }: DonationTrendsChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center">
        <h3 className="text-lg font-semibold flex-grow text-left">Donation Trends</h3>
        <p className="text-sm text-muted-foreground">
          Monthly donation counts and total amounts
        </p>
      </div>
      <div className="flex-grow h-[400px] w-full px-4">
        <ChartContainer
          config={{
            donations: { label: "Donation Count", color: "#9b87f5" },
            amount: { label: "Amount (EGP)", color: "#82ca9d" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
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
                yAxisId="left"
                type="monotone"
                dataKey="donations"
                stroke="#9b87f5"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="amount"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
