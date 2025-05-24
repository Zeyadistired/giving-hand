import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define all social media URLs in one place
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/giv_inghand?igsh=MW1jZGQwMGJjYnF5ZQ==",
  facebook: "#", // Update when available
  linkedin: "#", // Update when available
  twitter: "#", // Update when available
} as const;

type SocialPlatform = keyof typeof SOCIAL_LINKS;

interface SocialIconProps {
  platform: SocialPlatform;
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function SocialIcon({ 
  platform, 
  icon: Icon, 
  className = "", 
  size = "md",
  variant = "outline",
  showLabel = false,
  onClick
}: SocialIconProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={`rounded-full ${sizes[size]} ${className}`}
      asChild
    >
      <a
        href={SOCIAL_LINKS[platform]}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
        onClick={onClick}
      >
        <Icon className={iconSizes[size]} />
        {showLabel && (
          <span className="sr-only">
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </span>
        )}
      </a>
    </Button>
  );
} 