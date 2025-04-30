import {
  Home,
  Settings,
  HelpCircle,
  Ticket,
  MapPin,
  Bell
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  active: boolean;
}

interface BottomNavProps {
  userRole: UserRole;
  hideHelp?: boolean;
  hideHome?: boolean;
}

export function BottomNav({ userRole, hideHelp, hideHome }: BottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  let navItems: NavItem[] = [];

  if (userRole === "guest") {
    navItems = [
      {
        label: "Home",
        icon: Home,
        href: "/guest",
        active: currentPath === "/guest",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        active: currentPath === "/settings",
      },
      {
        label: "Help",
        icon: HelpCircle,
        href: "/help",
        active: currentPath === "/help",
      },
    ];
    // Hide settings on login page
    if (currentPath === "/login" || currentPath === "/register") {
      navItems = navItems.filter(item => item.label !== "Settings");
    }
  }

  if (userRole === "charity") {
    navItems = [
      {
        label: "Home",
        icon: Home,
        href: "/charity",
        active: currentPath === "/charity",
      },
      {
        label: "Tickets",
        icon: Ticket,
        href: "/notifications",
        active: currentPath === "/notifications",
      },
      {
        label: "Meal Tracking",
        icon: MapPin,
        href: "/charity/meal-tracking",
        active: currentPath === "/charity/meal-tracking",
      },
      {
        label: "Help",
        icon: HelpCircle,
        href: "/charity/help",
        active: currentPath === "/charity/help",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/charity/settings",
        active: currentPath === "/charity/settings",
      }
    ];
  }

  if (userRole === "organization") {
    navItems = [
      {
        label: "Home",
        icon: Home,
        href: "/organization",
        active: currentPath === "/organization",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/organization/settings",
        active: currentPath === "/organization/settings",
      },
    ];
  }

  if (hideHelp) {
    navItems = navItems.filter(item => !item.href.includes('/help'));
  }

  if (hideHome) {
    navItems = navItems.filter(item => item.label !== 'Home');
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white border-t z-50">
      <div className="container max-w-md flex items-center justify-around p-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-sm",
              item.active
                ? "text-charity-primary"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
