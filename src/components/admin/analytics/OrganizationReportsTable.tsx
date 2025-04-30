
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { OrganizationType } from "@/types";

export interface OrganizationReport {
  id: string;
  name: string;
  type: OrganizationType;
  totalDonations: number;
  quantity: number;
  pickups: number;
  cancellations: number;
  violations: number;
  lastActive: string;
}

interface OrganizationReportsTableProps {
  data: OrganizationReport[];
}

export function OrganizationReportsTable({ data }: OrganizationReportsTableProps) {
  const [filter, setFilter] = useState<OrganizationType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data
    .filter(org => filter === "all" || org.type === filter)
    .filter(org => 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      org.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getViolationColor = (violations: number) => {
    if (violations === 0) return "bg-green-100 text-green-800";
    if (violations <= 2) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getTypeColor = (type: OrganizationType) => {
    switch (type) {
      case "restaurant": 
        return "bg-blue-100 text-blue-800";
      case "hotel": 
        return "bg-purple-100 text-purple-800";
      case "supermarket": 
        return "bg-emerald-100 text-emerald-800";
      case "shelter": 
        return "bg-amber-100 text-amber-800";
      default: 
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-semibold">Organization Analytics</h3>
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={filter} onValueChange={(value) => setFilter(value as OrganizationType | "all")}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="supermarket">Supermarkets</SelectItem>
              <SelectItem value="shelter">Shelters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Donations</TableHead>
              <TableHead>Quantity (kg)</TableHead>
              <TableHead>Pickups</TableHead>
              <TableHead>Cancellations</TableHead>
              <TableHead>Violations</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((org) => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(org.type)}>
                      {org.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.totalDonations}</TableCell>
                  <TableCell>{org.quantity}</TableCell>
                  <TableCell>{org.pickups}</TableCell>
                  <TableCell>{org.cancellations}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getViolationColor(org.violations)}>
                      {org.violations}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.lastActive}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No organizations found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
