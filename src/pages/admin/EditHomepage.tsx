
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, Trash, Plus, ArrowLeft, FileText, Globe, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  saveContent,
  loadContent,
  getAllUsers,
  getAllOrganizations,
  getAllCharities,
  getAllFactories,
  updateOrganization,
  updateCharity,
  updateFactory,
  User
} from "@/utils/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Content sections that can be edited
const contentSections = [
  { key: 'hero_title', label: 'Hero Title', defaultValue: 'Fighting Food Waste Together', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', defaultValue: 'Connect surplus food with those who need it most', type: 'text' },
  { key: 'hero_description', label: 'Hero Description', defaultValue: 'Join our mission to reduce food waste and fight hunger by connecting restaurants, hotels, and organizations with local charities and communities.', type: 'textarea' },
  { key: 'about_title', label: 'About Section Title', defaultValue: 'About Our Mission', type: 'text' },
  { key: 'about_description', label: 'About Description', defaultValue: 'We bridge the gap between food surplus and food insecurity, creating a sustainable solution that benefits everyone.', type: 'textarea' },
  { key: 'features_title', label: 'Features Section Title', defaultValue: 'How It Works', type: 'text' },
  { key: 'contact_email', label: 'Contact Email', defaultValue: 'contact@foodbridge.com', type: 'text' },
  { key: 'contact_phone', label: 'Contact Phone', defaultValue: '+20 123 456 7890', type: 'text' },
];

export default function EditHomepage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<User[]>([]);
  const [charities, setCharities] = useState<User[]>([]);
  const [factories, setFactories] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<{type: string, id: string} | null>(null);

  useEffect(() => {
    const loadContentData = async () => {
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
          navigate('/login');
          return;
        }

        // Load content values from database
        const contentData: Record<string, string> = {};
        for (const section of contentSections) {
          const value = await loadContent(section.key, 'homepage', section.defaultValue);
          contentData[section.key] = value;
        }
        setContentValues(contentData);

        // Load users and entities for management
        const [allUsers, allOrganizations, allCharities, allFactories] = await Promise.all([
          getAllUsers(),
          getAllOrganizations(),
          getAllCharities(),
          getAllFactories()
        ]);

        setUsers(allUsers);
        setOrganizations(allOrganizations);
        setCharities(allCharities);
        setFactories(allFactories);

      } catch (error) {
        console.error('Error loading content data:', error);
        toast.error('Failed to load content data');
      } finally {
        setIsLoading(false);
      }
    };

    loadContentData();
  }, [navigate]);

  const handleContentChange = (key: string, value: string) => {
    setContentValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveContentItem = async (key: string) => {
    try {
      setIsSaving(true);
      await saveContent(key, contentValues[key], 'homepage');
      toast.success(`${contentSections.find(s => s.key === key)?.label} saved successfully`);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllContent = async () => {
    try {
      setIsSaving(true);

      // Save all content sections
      for (const section of contentSections) {
        await saveContent(section.key, contentValues[section.key], 'homepage');
      }

      toast.success('All content saved successfully');
    } catch (error) {
      console.error('Error saving all content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrganization = async (orgId: string, updates: any) => {
    try {
      setIsSaving(true);
      const updatedOrg = await updateOrganization(orgId, updates);

      setOrganizations(prev =>
        prev.map(org => org.id === orgId ? updatedOrg : org)
      );

      toast.success('Organization updated successfully');
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCharity = async (charityId: string, updates: any) => {
    try {
      setIsSaving(true);
      const updatedCharity = await updateCharity(charityId, updates);

      setCharities(prev =>
        prev.map(charity => charity.id === charityId ? updatedCharity : charity)
      );

      toast.success('Charity updated successfully');
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating charity:', error);
      toast.error('Failed to update charity');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateFactory = async (factoryId: string, updates: any) => {
    try {
      setIsSaving(true);
      const updatedFactory = await updateFactory(factoryId, updates);

      setFactories(prev =>
        prev.map(factory => factory.id === factoryId ? updatedFactory : factory)
      );

      toast.success('Factory updated successfully');
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating factory:', error);
      toast.error('Failed to update factory');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-gray-600 hover:bg-gray-100"
                onClick={() => navigate('/admin/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Content Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={saveAllContent}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save All'}
              </Button>
              <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Organizations
            </TabsTrigger>
            <TabsTrigger value="charities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Charities
            </TabsTrigger>
            <TabsTrigger value="factories" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Factories
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Website Content</h2>
              <p className="text-gray-600">Edit the content that appears on your website</p>
            </div>

            <div className="grid gap-6">
              {contentSections.map((section) => (
                <Card key={section.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {section.label}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveContentItem(section.key)}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor={section.key}>{section.label}</Label>
                      {section.type === 'textarea' ? (
                        <Textarea
                          id={section.key}
                          value={contentValues[section.key] || section.defaultValue}
                          onChange={(e) => handleContentChange(section.key, e.target.value)}
                          className="min-h-[100px]"
                          placeholder={section.defaultValue}
                        />
                      ) : (
                        <Input
                          id={section.key}
                          value={contentValues[section.key] || section.defaultValue}
                          onChange={(e) => handleContentChange(section.key, e.target.value)}
                          placeholder={section.defaultValue}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Organizations</h2>
              <p className="text-gray-600">Edit organization details and types</p>
            </div>

            <div className="grid gap-4">
              {organizations.map(org => (
                <Card key={org.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {editingItem?.type === 'organization' && editingItem?.id === org.id ? (
                      <OrganizationEditForm
                        organization={org}
                        onSave={handleUpdateOrganization}
                        onCancel={() => setEditingItem(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{org.name || 'No Name'}</h3>
                            <p className="text-sm text-gray-600">{org.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{org.organization_type || 'Not specified'}</p>
                            {org.description && (
                              <p className="text-sm text-gray-600 mt-1">{org.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem({type: 'organization', id: org.id})}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="charities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Charities</h2>
              <p className="text-gray-600">Edit charity information and descriptions</p>
            </div>

            <div className="grid gap-4">
              {charities.map(charity => (
                <Card key={charity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {editingItem?.type === 'charity' && editingItem?.id === charity.id ? (
                      <CharityEditForm
                        charity={charity}
                        onSave={handleUpdateCharity}
                        onCancel={() => setEditingItem(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{charity.name || 'No Name'}</h3>
                            <p className="text-sm text-gray-600">{charity.email}</p>
                            {charity.description && (
                              <p className="text-sm text-gray-600 mt-1">{charity.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem({type: 'charity', id: charity.id})}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="factories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Factories</h2>
              <p className="text-gray-600">Edit factory information and details</p>
            </div>

            <div className="grid gap-4">
              {factories.map(factory => (
                <Card key={factory.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {editingItem?.type === 'factory' && editingItem?.id === factory.id ? (
                      <FactoryEditForm
                        factory={factory}
                        onSave={handleUpdateFactory}
                        onCancel={() => setEditingItem(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{factory.name || 'No Name'}</h3>
                            <p className="text-sm text-gray-600">{factory.email}</p>
                            {factory.description && (
                              <p className="text-sm text-gray-600 mt-1">{factory.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem({type: 'factory', id: factory.id})}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Overview</h2>
              <p className="text-gray-600">Quick overview of system users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['admin', 'organization', 'charity', 'factory'].map(type => {
                const count = users.filter(user => user.type === type).length;
                return (
                  <Card key={type}>
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{type}s</p>
                      <p className="text-3xl font-bold">{count}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.name || 'No Name'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs capitalize">
                          {user.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Site Settings</h2>
              <p className="text-gray-600">Configure global site settings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Content Sections</p>
                    <p className="text-2xl font-bold">{contentSections.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Edit form components
interface OrganizationEditFormProps {
  organization: User;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function OrganizationEditForm({ organization, onSave, onCancel, isSaving }: OrganizationEditFormProps) {
  const [formData, setFormData] = useState({
    name: organization.name || '',
    email: organization.email || '',
    description: organization.description || '',
    organization_type: organization.organization_type || 'other'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(organization.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="org-name">Organization Name</Label>
          <Input
            id="org-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="org-email">Email</Label>
          <Input
            id="org-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="org-type">Organization Type</Label>
        <Select value={formData.organization_type} onValueChange={(value) => setFormData(prev => ({ ...prev, organization_type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select organization type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="supermarket">Supermarket</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="org-description">Description</Label>
        <Textarea
          id="org-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

interface CharityEditFormProps {
  charity: User;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function CharityEditForm({ charity, onSave, onCancel, isSaving }: CharityEditFormProps) {
  const [formData, setFormData] = useState({
    name: charity.name || '',
    email: charity.email || '',
    description: charity.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(charity.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="charity-name">Charity Name</Label>
          <Input
            id="charity-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="charity-email">Email</Label>
          <Input
            id="charity-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="charity-description">Description</Label>
        <Textarea
          id="charity-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="min-h-[100px]"
          placeholder="Describe the charity's mission and activities..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

interface FactoryEditFormProps {
  factory: User;
  onSave: (id: string, updates: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function FactoryEditForm({ factory, onSave, onCancel, isSaving }: FactoryEditFormProps) {
  const [formData, setFormData] = useState({
    name: factory.name || '',
    email: factory.email || '',
    description: factory.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(factory.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="factory-name">Factory Name</Label>
          <Input
            id="factory-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="factory-email">Email</Label>
          <Input
            id="factory-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="factory-description">Description</Label>
        <Textarea
          id="factory-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="min-h-[100px]"
          placeholder="Describe the factory's operations and capabilities..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
