
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface UserTypeData {
  name: string;
  value: number;
  color: string;
}

interface UsersByTypeChartProps {
  data: UserTypeData[];
}

export function UsersByTypeChart({ data }: UsersByTypeChartProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center">
        <h3 className="text-lg font-semibold flex-grow text-left">Users by Type</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of registered users by their account type
        </p>
      </div>
      <div className="flex-grow h-[400px] w-full px-4">
        <ChartContainer
          config={{
            guest: { label: "Guests", color: "#9b87f5" },
            charity: { label: "Charity/Shelter", color: "#82ca9d" },
            organization: { label: "Organizations", color: "#ffc658" },
            admin: { label: "Admins", color: "#ea384c" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius="80%"
                innerRadius="50%"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{
                  paddingTop: "20px",
                  width: '100%',
                  textAlign: 'center'
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
