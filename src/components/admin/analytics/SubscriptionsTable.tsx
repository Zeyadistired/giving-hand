
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Subscription {
  id: string;
  userType: 'charity' | 'organization';
  name: string;
  email: string;
  startDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

interface SubscriptionsTableProps {
  data: Subscription[];
}

export function SubscriptionsTable({ data }: SubscriptionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Subscriptions</CardTitle>
        <CardDescription>
          Users with active or expired premium subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.name}</TableCell>
                <TableCell className="capitalize">{subscription.userType}</TableCell>
                <TableCell>{subscription.email}</TableCell>
                <TableCell>{subscription.startDate}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      subscription.status === 'active' 
                        ? 'default' 
                        : subscription.status === 'expired' 
                          ? 'secondary' 
                          : 'destructive'
                    }
                  >
                    {subscription.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
