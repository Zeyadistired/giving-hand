
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "guest" },
  { id: 2, name: "Jane Smith", email: "jane@charity.org", role: "charity" },
  { id: 3, name: "Mike Johnson", email: "mike@org.com", role: "organization" },
];

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users] = useState(mockUsers);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/dashboard')}
            className="mr-2 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <EditableWrapper onSave={(value) => console.log('Title edited:', value)}>
            <h1 className="text-xl font-bold">Manage Users</h1>
          </EditableWrapper>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <EditableWrapper onSave={(value) => console.log(`User ${user.id} name edited:`, value)}>
                        <h3 className="font-medium">{user.name}</h3>
                      </EditableWrapper>
                      <EditableWrapper onSave={(value) => console.log(`User ${user.id} email edited:`, value)}>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </EditableWrapper>
                      <EditableWrapper onSave={(value) => console.log(`User ${user.id} role edited:`, value)}>
                        <p className="text-sm font-medium capitalize">{user.role}</p>
                      </EditableWrapper>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
