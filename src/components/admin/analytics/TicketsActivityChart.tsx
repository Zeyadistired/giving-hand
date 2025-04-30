
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  created: number;
  accepted: number;
  declined: number;
}

interface TicketsActivityChartProps {
  data: ChartData[];
}

export function TicketsActivityChart({ data }: TicketsActivityChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center">
        <h3 className="text-lg font-semibold flex-grow text-left">Ticket Activity</h3>
        <p className="text-sm text-muted-foreground">
          Monthly summary of tickets created, accepted, and declined
        </p>
      </div>
      <div className="flex-grow h-[400px] w-full px-4">
        <ChartContainer
          config={{
            created: { label: "Created", color: "#9b87f5" },
            accepted: { label: "Accepted", color: "#82ca9d" },
            declined: { label: "Declined", color: "#ea384c" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
              <Bar dataKey="created" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accepted" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              <Bar dataKey="declined" fill="#ea384c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
