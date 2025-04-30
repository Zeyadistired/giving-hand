
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  value?: string | number;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function DashboardCard({
  title,
  description,
  value,
  icon,
  footer,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {icon && <div className="w-8 h-8 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {value ? (
          <div className="text-2xl font-bold">{value}</div>
        ) : (
          children
        )}
        {footer && <div className="text-xs text-muted-foreground mt-2">{footer}</div>}
      </CardContent>
    </Card>
  );
}
