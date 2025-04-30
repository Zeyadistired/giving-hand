
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Map, MapPin, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for user tracking
const activeUsers = [
  {
    id: "user-1",
    name: "Hope Community Center",
    type: "charity",
    lastActive: "2025-04-22T14:30:00.000Z",
    locationEnabled: true,
    region: "Downtown",
    lastLocation: { lat: 30.0444, lng: 31.2357 },
  },
  {
    id: "user-2",
    name: "Skyline Restaurant",
    type: "organization",
    lastActive: "2025-04-22T15:45:00.000Z",
    locationEnabled: true,
    region: "North District",
    lastLocation: { lat: 30.0594, lng: 31.2272 },
  },
  {
    id: "user-3",
    name: "Fresh Market Supermarket",
    type: "organization",
    lastActive: "2025-04-22T13:15:00.000Z",
    locationEnabled: true,
    region: "East District",
    lastLocation: { lat: 30.0594, lng: 31.2272 },
  },
  {
    id: "user-4",
    name: "Second Chance Foundation",
    type: "charity",
    lastActive: "2025-04-22T12:20:00.000Z",
    locationEnabled: false,
    region: "South District",
    lastLocation: null,
  },
];

// Sample data for delivery logs
const deliveryLogs = [
  {
    id: "log-1",
    ticketId: "4",
    organization: "Fresh Market Supermarket",
    charity: "Hope Community Center",
    category: "dairy",
    quantity: "4.5kg",
    status: "delivered",
    deliveryMethod: "self-pickup",
    deliveryDate: "2025-04-18T15:30:00.000Z",
    route: [
      { lat: 30.0594, lng: 31.2272 },
      { lat: 30.0544, lng: 31.2357 },
      { lat: 30.0444, lng: 31.2357 },
    ],
  },
  {
    id: "log-2",
    ticketId: "2",
    organization: "Gourmet Palace Hotel",
    charity: "Second Chance Foundation",
    category: "bakery",
    quantity: "40 pieces (3.5kg)",
    status: "in-transit",
    deliveryMethod: "organization-delivery",
    deliveryDate: "2025-04-22T10:15:00.000Z",
    route: [
      { lat: 30.0488, lng: 31.2419 },
      { lat: 30.0470, lng: 31.2360 },
    ],
  },
  {
    id: "log-3",
    ticketId: "1",
    organization: "Skyline Restaurant",
    charity: "Hope Community Center",
    category: "prepared",
    quantity: "20 trays (5.2kg)",
    status: "accepted",
    deliveryMethod: "third-party",
    deliveryDate: "2025-04-24T09:00:00.000Z",
    route: null,
  },
];

// Sample data for meal tracking summary
const mealTrackingSummary = [
  {
    id: "summary-1",
    charity: "Hope Community Center",
    totalPickups: 15,
    totalWeight: "78.3kg",
    categories: {
      bakery: "22.5kg",
      dairy: "15.8kg",
      prepared: "30.0kg",
      produce: "10.0kg",
    },
  },
  {
    id: "summary-2",
    charity: "Second Chance Foundation",
    totalPickups: 8,
    totalWeight: "42.6kg",
    categories: {
      bakery: "12.0kg",
      dairy: "8.5kg",
      prepared: "15.5kg",
      produce: "6.6kg",
    },
  },
];

export function AdminTrackingDashboard() {
  const [activeTab, setActiveTab] = useState("locations");
  const [filterUserType, setFilterUserType] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterDeliveryMethod, setFilterDeliveryMethod] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Filter users based on selected filters
  const filteredUsers = activeUsers.filter((user) => {
    if (filterUserType !== "all" && user.type !== filterUserType) return false;
    if (filterRegion !== "all" && user.region !== filterRegion) return false;
    return true;
  });

  // Filter logs based on selected filters
  const filteredLogs = deliveryLogs.filter((log) => {
    if (filterDeliveryMethod !== "all" && log.deliveryMethod !== filterDeliveryMethod) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">User Tracking & Logistics</h1>
        <div className="flex flex-wrap gap-2">
          <Select value={filterUserType} onValueChange={setFilterUserType}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <SelectValue placeholder="User Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="charity">Charities</SelectItem>
              <SelectItem value="organization">Organizations</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-[150px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="Region" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Downtown">Downtown</SelectItem>
              <SelectItem value="North District">North District</SelectItem>
              <SelectItem value="East District">East District</SelectItem>
              <SelectItem value="South District">South District</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-10">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations">
            <MapPin className="h-4 w-4 mr-2" />
            User Locations
          </TabsTrigger>
          <TabsTrigger value="deliveries">
            <Map className="h-4 w-4 mr-2" />
            Delivery Logs
          </TabsTrigger>
          <TabsTrigger value="summary">
            <Users className="h-4 w-4 mr-2" />
            Meal Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active User Locations</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} users. Click on any user to view detailed location history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Map view would display here with user locations marked</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Location Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.type === "charity"
                              ? "bg-charity-light text-charity-primary"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {user.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.lastActive)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.locationEnabled
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.locationEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.region}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled={!user.locationEnabled}>
                          <Map className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Delivery & Pickup Logs</CardTitle>
              <CardDescription>
                Track completed and in-progress food deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Select value={filterDeliveryMethod} onValueChange={setFilterDeliveryMethod}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Delivery Method" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="self-pickup">Self Pickup</SelectItem>
                    <SelectItem value="organization-delivery">Org Delivery</SelectItem>
                    <SelectItem value="third-party">Third-Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Charity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.organization}</TableCell>
                      <TableCell>{log.charity}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            log.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : log.status === "in-transit"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.deliveryMethod}</TableCell>
                      <TableCell>{formatDate(log.deliveryDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled={!log.route}>
                          <Map className="h-4 w-4 mr-1" />
                          Route
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Total: {filteredLogs.length} deliveries</TableCaption>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Charity Meal Tracking Summary</CardTitle>
              <CardDescription>
                Overview of meals received by each charity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Charity</TableHead>
                    <TableHead>Total Pickups</TableHead>
                    <TableHead>Total Weight</TableHead>
                    <TableHead>Bakery</TableHead>
                    <TableHead>Dairy</TableHead>
                    <TableHead>Prepared</TableHead>
                    <TableHead>Produce</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealTrackingSummary.map((summary) => (
                    <TableRow key={summary.id}>
                      <TableCell className="font-medium">{summary.charity}</TableCell>
                      <TableCell>{summary.totalPickups}</TableCell>
                      <TableCell>{summary.totalWeight}</TableCell>
                      <TableCell>{summary.categories.bakery}</TableCell>
                      <TableCell>{summary.categories.dairy}</TableCell>
                      <TableCell>{summary.categories.prepared}</TableCell>
                      <TableCell>{summary.categories.produce}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
