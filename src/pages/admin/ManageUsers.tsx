
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getAllUsers, deleteUser, User } from "@/utils/admin";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);

        // Check if user is admin
        const userString = localStorage.getItem('currentUser');
        if (!userString) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);
        setCurrentUser(user);

        if (user.type !== 'admin') {
          navigate('/admin/dashboard');
          return;
        }

        // Load users from database
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);

      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'organization': return 'bg-blue-100 text-blue-800';
      case 'charity': return 'bg-green-100 text-green-800';
      case 'factory': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-lg font-semibold">Total Users: {users.length}</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
          </div>

          {/* User Type Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {['admin', 'organization', 'charity', 'factory'].map(type => {
              const count = users.filter(user => user.type === type).length;
              return (
                <Card key={type}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-600 capitalize">{type}s</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-1">No Users Found</h3>
                <p className="text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'No users in the system yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map(user => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name || 'No Name'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.organization_type && (
                          <p className="text-xs text-gray-500 capitalize">{user.organization_type}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getUserTypeColor(user.type)}>
                        {user.type}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.type !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.description && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">{user.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
