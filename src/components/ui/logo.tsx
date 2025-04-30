
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = false }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16", 
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-lg flex items-center justify-center",
          sizes[size]
        )}
      >
        <img
          src="/lovable-uploads/913d3b78-b72e-4bd4-9c18-80a923e40cbb.png"
          alt="Giving Hand Logo"
          className="w-full h-full object-contain"
        />
      </div>
      {showText && size !== "xl" && (
        <span className={cn("font-bold", textSizes[size])} style={{ color: "#8C7A74" }}>
          Giving Hand
        </span>
      )}
    </div>
  );
}
