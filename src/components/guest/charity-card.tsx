import { Charity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Baby, Cat, PersonStanding, Soup } from "lucide-react";

interface CharityCardProps {
  charity: Charity;
  onClick: () => void;
  isSelected?: boolean;
}

export function CharityCard({ charity, onClick, isSelected = false }: CharityCardProps) {
  const categoryIcons = {
    homeless: Home,
    children: Baby,
    animal: Cat,
    elderly: PersonStanding,
    foodbank: Soup,
  };

  const CategoryIcon = charity?.category ? categoryIcons[charity.category] : null;
  const categoryDisplay = charity?.category 
    ? charity.category.charAt(0).toUpperCase() + charity.category.slice(1)
    : "Uncategorized";

  return (
    <Card 
      className={`overflow-hidden border hover:border-charity-tertiary transition-all cursor-pointer ${
        isSelected ? 'border-charity-primary ring-2 ring-charity-primary ring-opacity-50' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-charity-primary">{charity?.name || "Unnamed Organization"}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {charity?.description || "Supporting those in need"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {CategoryIcon && (
              <CategoryIcon className="h-5 w-5 text-charity-tertiary" />
            )}
            <Badge className="bg-charity-tertiary hover:bg-charity-tertiary/90">
              {categoryDisplay}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
