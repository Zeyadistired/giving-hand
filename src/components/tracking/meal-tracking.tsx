import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Map, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FoodTicket } from "@/types";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const sampleMealTrackingData = [
  {
    id: "track-1",
    ticketId: "4",
    organizationName: "Fresh Market Supermarket",
    category: "dairy",
    quantity: "4.5kg",
    status: "delivered",
    deliveryMethod: "self-pickup",
    deliveryDate: "2025-04-18T15:30:00.000Z"
  },
  {
    id: "track-2",
    ticketId: "2",
    organizationName: "Gourmet Palace Hotel",
    category: "bakery",
    quantity: "40 pieces (3.5kg)",
    status: "in-transit",
    deliveryMethod: "organization-delivery", 
    deliveryDate: "2025-04-22T10:15:00.000Z"
  },
  {
    id: "track-3",
    ticketId: "1",
    organizationName: "Skyline Restaurant",
    category: "prepared",
    quantity: "20 trays (5.2kg)",
    status: "accepted",
    deliveryMethod: "third-party",
    deliveryDate: "2025-04-24T09:00:00.000Z" 
  }
];

export function MealTracking() {
  const [trackingData, setTrackingData] = useState(() => {
    const savedTracking = JSON.parse(localStorage.getItem('meal-tracking') || '[]');
    return [...sampleMealTrackingData, ...savedTracking];
  });
  const [selectedTrackingItem, setSelectedTrackingItem] = useState<typeof sampleMealTrackingData[0] | null>(null);
  
  const getCategoryColor = (category: string) => {
    const colors = {
      prepared: "bg-blue-100 text-blue-800",
      produce: "bg-green-100 text-green-800",
      bakery: "bg-amber-100 text-amber-800",
      dairy: "bg-indigo-100 text-indigo-800",
      meat: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };
  
  const getStatusColor = (status: string) => {
    const colors = {
      accepted: "bg-yellow-100 text-yellow-800",
      "in-transit": "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };
  
  const getDeliveryMethodIcon = (method: string) => {
    switch (method) {
      case "self-pickup":
        return <span title="Self Pickup"><MapPin className="h-4 w-4" /></span>;
      case "organization-delivery":
        return <span title="Organization Delivery"><Map className="h-4 w-4" /></span>;
      case "third-party":
        return <span title="Third Party"><Map className="h-4 w-4" /></span>;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "numeric", 
      minute: "numeric" 
    });
  };

  const handleSimulateGPS = () => {
    const latitude = 30.0444;
    const longitude = 31.2357;
    toast.success(
      <>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-charity-primary" />
          <span>GPS Simulated:</span>
        </div>
        <div>
          <span className="font-mono text-xs">Lat: {latitude}, Lng: {longitude}</span>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-4 space-y-4 flex-grow overflow-auto">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-semibold text-charity-primary">Meal Tracking</h2>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-2 py-1 border-charity-primary flex items-center gap-1"
            onClick={handleSimulateGPS}
          >
            <MapPin className="h-4 w-4 mr-1 text-charity-primary" />
            Simulate GPS
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your received and upcoming meals</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>When</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.organizationName}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      {getDeliveryMethodIcon(item.deliveryMethod)}
                      <span className="text-xs">{item.deliveryMethod}</span>
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(item.deliveryDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTrackingItem(item)}>
                      <Map className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="sticky bottom-0">
        <BottomNav 
          userRole="charity" 
          hideHelp={false} 
          hideHome={false} 
        />
      </div>
      <Dialog open={!!selectedTrackingItem} onOpenChange={() => setSelectedTrackingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-charity-primary">Order Tracking</DialogTitle>
          </DialogHeader>
          {selectedTrackingItem && (
            <div className="text-sm space-y-2 text-muted-foreground">
              <p><strong>From:</strong> {selectedTrackingItem.organizationName}</p>
              <p><strong>Category:</strong> {selectedTrackingItem.category}</p>
              <p><strong>Quantity:</strong> {selectedTrackingItem.quantity}</p>
              <p><strong>Status:</strong> <span className="capitalize font-semibold text-green-600">{selectedTrackingItem.status}</span></p>
              <p><strong>Delivery Method:</strong> {selectedTrackingItem.deliveryMethod}</p>
              <p><strong>Estimated Delivery:</strong> {formatDate(selectedTrackingItem.deliveryDate)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
