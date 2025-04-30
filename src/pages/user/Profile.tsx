
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogOut, Edit, ChevronRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const navigate = useNavigate();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Mock user data
  const user = {
    fullName: "Food Shelter Foundation",
    username: "foodshelter",
    email: "contact@foodshelter.org",
    role: "charity",
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to change the password
    
    // Reset fields and close dialog
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(false);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear user session/local storage etc.
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo />
          <div className="text-sm font-medium text-charity-primary capitalize">{user.role}</div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charity-primary mb-1">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account details and settings
          </p>
        </div>

        <div className="bg-white rounded-lg border p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-charity-light p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-charity-primary" />
              </div>
              <div>
                <h2 className="font-medium text-charity-primary">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5 text-charity-primary" />
            </Button>
          </div>
          
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            className="flex items-center justify-between w-full rounded-lg border p-4 text-left hover:bg-gray-50"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-charity-primary mr-3" />
              <span>Change Password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
          
          <Separator />
          
          <button 
            className="flex items-center justify-between w-full rounded-lg border p-4 text-left hover:bg-gray-50 text-red-500"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <div className="flex items-center">
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password below
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit"
                className="bg-charity-primary hover:bg-charity-dark"
              >
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav userRole="charity" />
    </div>
  );
}
