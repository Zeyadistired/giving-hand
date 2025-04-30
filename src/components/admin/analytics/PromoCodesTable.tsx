
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  organization: string;
  status: 'active' | 'expired';
  usageCount: number;
}

interface PromoCodesTableProps {
  data: PromoCode[];
}

export function PromoCodesTable({ data }: PromoCodesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo Codes</CardTitle>
        <CardDescription>
          Active and expired promo codes with usage statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.code}</TableCell>
                <TableCell>{promo.discount}%</TableCell>
                <TableCell>{promo.organization}</TableCell>
                <TableCell>
                  <Badge variant={promo.status === 'active' ? 'default' : 'secondary'}>
                    {promo.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{promo.usageCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
