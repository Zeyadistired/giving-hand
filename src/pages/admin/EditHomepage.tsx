
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Trash, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock charity data for editing
const initialCharities = [
  { id: "CHA001", name: "Masr El Kheir", description: "Supporting needy communities", imageUrl: "/placeholder.svg" },
  { id: "CHA002", name: "APF Shelter", description: "Animal protection foundation", imageUrl: "/placeholder.svg" },
  { id: "CHA003", name: "Children's Hope", description: "Support for underprivileged children", imageUrl: "/placeholder.svg" },
  { id: "CHA004", name: "Elderly Care Foundation", description: "Caring for the elderly", imageUrl: "/placeholder.svg" },
  { id: "CHA005", name: "Hope Shelter Foundation", description: "Providing shelter for the homeless", imageUrl: "/placeholder.svg" }
];

export default function EditHomepage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [charities, setCharities] = useState(initialCharities);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newCharity, setNewCharity] = useState({
    id: "",
    name: "",
    description: "",
    imageUrl: "/placeholder.svg"
  });

  useEffect(() => {
    // Check if user is admin
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userString);
    setCurrentUser(user);
    
    if (user.type !== 'admin') {
      navigate('/login');
    }
    
    // Load charities from localStorage or use initial data
    const savedCharities = localStorage.getItem('editedCharities');
    if (savedCharities) {
      setCharities(JSON.parse(savedCharities));
    }
  }, [navigate]);

  const startEditing = (charity: any) => {
    setEditingCharity({...charity});
    setIsAddMode(false);
  };

  const cancelEditing = () => {
    setEditingCharity(null);
    setIsAddMode(false);
  };

  const saveEditing = () => {
    if (editingCharity) {
      const updatedCharities = charities.map(c => 
        c.id === editingCharity.id ? editingCharity : c
      );
      setCharities(updatedCharities);
      localStorage.setItem('editedCharities', JSON.stringify(updatedCharities));
      setEditingCharity(null);
    }
  };

  const deleteCharity = (id: string) => {
    const updatedCharities = charities.filter(c => c.id !== id);
    setCharities(updatedCharities);
    localStorage.setItem('editedCharities', JSON.stringify(updatedCharities));
  };

  const startAddingNew = () => {
    setIsAddMode(true);
    setEditingCharity(null);
    setNewCharity({
      id: `CHA${Math.floor(Math.random() * 1000)}`,
      name: "",
      description: "",
      imageUrl: "/placeholder.svg"
    });
  };

  const saveNewCharity = () => {
    if (newCharity.name && newCharity.description) {
      const updatedCharities = [...charities, newCharity];
      setCharities(updatedCharities);
      localStorage.setItem('editedCharities', JSON.stringify(updatedCharities));
      setIsAddMode(false);
      setNewCharity({
        id: "",
        name: "",
        description: "",
        imageUrl: "/placeholder.svg"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-bold">Edit Homepage</h1>
          </div>
          <div>
            <span className="mr-4">{currentUser?.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userRole');
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Charities</h2>
          <Button onClick={startAddingNew}>
            <Plus className="mr-2 h-4 w-4" /> Add New Charity
          </Button>
        </div>

        {isAddMode ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Charity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-name">Charity Name</Label>
                  <Input 
                    id="new-name" 
                    value={newCharity.name} 
                    onChange={(e) => setNewCharity({...newCharity, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea 
                    id="new-description" 
                    value={newCharity.description}
                    onChange={(e) => setNewCharity({...newCharity, description: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddMode(false)}>Cancel</Button>
              <Button onClick={saveNewCharity}>Save</Button>
            </CardFooter>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map(charity => (
            <Card key={charity.id} className="relative">
              {editingCharity && editingCharity.id === charity.id ? (
                <>
                  <CardHeader>
                    <CardTitle>
                      <Input 
                        value={editingCharity.name} 
                        onChange={(e) => setEditingCharity({...editingCharity, name: e.target.value})}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={editingCharity.description}
                      onChange={(e) => setEditingCharity({...editingCharity, description: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                    <Button onClick={saveEditing}>Save</Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => startEditing(charity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteCharity(charity.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle>{charity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{charity.description}</p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
