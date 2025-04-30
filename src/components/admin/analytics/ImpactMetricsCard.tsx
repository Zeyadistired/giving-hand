
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ImpactMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
}

interface ImpactMetricsCardProps {
  data: ImpactMetric[];
}

export function ImpactMetricsCard({ data }: ImpactMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact Metrics</CardTitle>
        <CardDescription>
          Key impact metrics showing progress towards goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((metric, index) => {
          const progressPercentage = (metric.value / metric.target) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{metric.label}</span>
                <span>
                  {metric.value.toLocaleString()} / {metric.target.toLocaleString()}{" "}
                  {metric.unit}
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
