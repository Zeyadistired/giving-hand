
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ExportType = "all" | "organization" | "donations" | "tickets" | "users";

interface ExportOptionsProps {
  onExport: (type: "pdf" | "csv", reportType: ExportType) => void;
  className?: string;
}

export function ExportOptions({ onExport, className }: ExportOptionsProps) {
  const handleExport = (type: "pdf" | "csv", reportType: ExportType = "all") => {
    try {
      onExport(type, reportType);
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full sm:w-auto", className)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Export as PDF</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleExport("pdf", "all")}>
              Complete Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf", "organization")}>
              Organization Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf", "donations")}>
              Donation Trends
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf", "tickets")}>
              Tickets Activity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf", "users")}>
              User Statistics
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Export as CSV</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleExport("csv", "all")}>
              Complete Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv", "organization")}>
              Organization Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv", "donations")}>
              Donation Trends
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv", "tickets")}>
              Tickets Activity
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv", "users")}>
              User Statistics
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
