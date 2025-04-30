import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodCategory, OrgDeliveryCapability } from "@/types";

// Added: Time range support for preferred pickup
function pad(num: number) { return num < 10 ? `0${num}` : num; }

interface CreateTicketFormProps {
  organizationName: string;
  onSubmit: (ticketData: {
    foodType: string;
    category: FoodCategory;
    weight: number;
    pieces?: number;
    expiryDate: string;
    pickupLocation: string;
    preferredPickupFrom: string;
    preferredPickupTo: string;
    notes?: string;
    otherCategory?: string;
    deliveryCapability: OrgDeliveryCapability;
  }) => void;
}

export function CreateTicketForm({ organizationName, onSubmit }: CreateTicketFormProps) {
  const [foodType, setFoodType] = useState("");
  const [category, setCategory] = useState<FoodCategory>("prepared");
  const [otherCategory, setOtherCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [pieces, setPieces] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryCapability, setDeliveryCapability] = useState<OrgDeliveryCapability>("none");
  const [preferredPickupFrom, setPreferredPickupFrom] = useState("");
  const [preferredPickupTo, setPreferredPickupTo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !foodType ||
      !category ||
      !weight ||
      !expiryDate ||
      !pickupLocation ||
      !preferredPickupFrom ||
      !preferredPickupTo
    ) {
      return;
    }

    onSubmit({
      foodType,
      category,
      weight: parseFloat(weight),
      pieces: pieces ? parseInt(pieces) : undefined,
      expiryDate,
      pickupLocation,
      preferredPickupFrom,
      preferredPickupTo,
      notes,
      otherCategory: category === "other" ? otherCategory : undefined,
      deliveryCapability,
    });
  };

  const foodCategories: { value: FoodCategory; label: string }[] = [
    { value: "prepared", label: "Prepared Meals" },
    { value: "produce", label: "Fresh Produce" },
    { value: "bakery", label: "Bakery Items" },
    { value: "dairy", label: "Dairy Products" },
    { value: "meat", label: "Meat & Protein" },
    { value: "other", label: "Other" },
  ];

  // Generate time options for 24hr clock (every 30 minutes e.g., 08:00, 08:30, ...)
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const min = i % 2 === 0 ? "00" : "30";
    return `${pad(hour)}:${min}`;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Organization Name</Label>
        <Input value={organizationName} disabled />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="food-type">Food Type</Label>
        <Input
          id="food-type"
          placeholder="e.g., Leftover Buffet, Sandwiches, Fresh Vegetables"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Food Category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as FoodCategory)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {foodCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category === "other" && (
        <div className="space-y-2">
          <Label htmlFor="other-category">Specify Category</Label>
          <Input
            id="other-category"
            placeholder="Enter food category"
            value={otherCategory}
            onChange={(e) => setOtherCategory(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          min="0.1"
          placeholder="Enter weight in kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pieces">Number of Pieces (Optional)</Label>
        <Input
          id="pieces"
          type="number"
          min="1"
          placeholder="e.g., 20 sandwiches, 5 trays"
          value={pieces}
          onChange={(e) => setPieces(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry-date">Expiration Date</Label>
        <Input
          id="expiry-date"
          type="datetime-local"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickup-location">
          Pickup Location
        </Label>
        <Input
          id="pickup-location"
          placeholder="Enter or confirm location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          required
        />
        {/* Optionally, map-based selection can be implemented here */}
        <div className="text-xs text-muted-foreground pl-1">
          (Coming soon: map selection to auto-detect your location)
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Pickup Time</Label>
        <div className="flex gap-2">
          <div>
            <span className="block text-xs text-muted-foreground">From</span>
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-base"
              value={preferredPickupFrom}
              required
              onChange={(e) => setPreferredPickupFrom(e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              {timeOptions.map((val) => (
                <option value={val} key={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground">To</span>
            <select
              className="rounded-md border border-input bg-background px-2 py-1 text-base"
              value={preferredPickupTo}
              required
              onChange={(e) => setPreferredPickupTo(e.target.value)}
            >
              <option value="" disabled>
                Select
              </option>
              {timeOptions.map((val) => (
                <option value={val} key={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes or Special Instructions (optional)</Label>
        <Textarea
          id="notes"
          placeholder='e.g., "Keep refrigerated", "Comes in trays"'
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Can you offer delivery for this ticket?</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery-capability"
              value="factory-only"
              checked={deliveryCapability === "factory-only"}
              onChange={() => setDeliveryCapability("factory-only")}
              required
            />
            <span>Send to Factory (Expired Food Only)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery-capability"
              value="self-delivery"
              checked={deliveryCapability === "self-delivery"}
              onChange={() => setDeliveryCapability("self-delivery")}
            />
            <span>Yes, we deliver ourselves</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery-capability"
              value="accepts-requests"
              checked={deliveryCapability === "accepts-requests"}
              onChange={() => setDeliveryCapability("accepts-requests")}
            />
            <span>Yes, we accept delivery requests from charities</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery-capability"
              value="none"
              checked={deliveryCapability === "none"}
              onChange={() => setDeliveryCapability("none")}
            />
            <span>No delivery – charity must pick up</span>
          </label>
        </div>
        {deliveryCapability === "factory-only" && (
          <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
            Note: This option is for expired food only. The food will be sent to a processing factory.
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-charity-primary hover:bg-charity-dark"
      >
        Share Ticket
      </Button>
    </form>
  );
}
