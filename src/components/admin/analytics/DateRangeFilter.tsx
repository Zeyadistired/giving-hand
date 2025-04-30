import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangeFilter({ 
  dateRange, 
  onDateRangeChange, 
  className 
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  // Pre-defined date ranges
  const selectLastWeek = () => {
    const end = new Date();
    const start = addDays(end, -7);
    onDateRangeChange({ from: start, to: end });
    setOpen(false);
  };

  const selectLastMonth = () => {
    const end = new Date();
    const start = addDays(end, -30);
    onDateRangeChange({ from: start, to: end });
    setOpen(false);
  };

  const selectLastQuarter = () => {
    const end = new Date();
    const start = addDays(end, -90);
    onDateRangeChange({ from: start, to: end });
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2 items-center", className)}>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={selectLastWeek}
          className="text-xs"
        >
          Last Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={selectLastMonth}
          className="text-xs"
        >
          Last Month
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={selectLastQuarter}
          className="text-xs"
        >
          Last Quarter
        </Button>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className="ml-auto text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Custom Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
