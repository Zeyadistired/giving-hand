
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type UserType = "all" | "guest" | "charity" | "organization" | "admin";

const userTypes = [
  { value: "all", label: "All Users" },
  { value: "guest", label: "Guests" },
  { value: "charity", label: "Charity/Shelter" },
  { value: "organization", label: "Organizations" },
  { value: "admin", label: "Admins" },
];

interface UserTypeFilterProps {
  selectedUserType: UserType;
  onUserTypeChange: (value: UserType) => void;
}

export function UserTypeFilter({ selectedUserType, onUserTypeChange }: UserTypeFilterProps) {
  const [open, setOpen] = useState(false);

  // Find the current selected type label
  const currentTypeLabel = userTypes.find((type) => type.value === selectedUserType)?.label || "All Users";

  // Handle selection with direct type access
  const handleSelect = (value: string) => {
    // Explicitly cast as UserType only if it's a valid value
    const validUserType = userTypes.find(type => type.value === value);
    if (validUserType) {
      onUserTypeChange(value as UserType);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {currentTypeLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder="Search user type..." />
          <CommandEmpty>No user type found.</CommandEmpty>
          <CommandGroup>
            {userTypes.map((type) => (
              <CommandItem
                key={type.value}
                value={type.value}
                onSelect={handleSelect}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUserType === type.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {type.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
