import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { User } from '../App';

interface Title {
  id: string;
  name: string;
  description: string;
  visibility: 'all' | 'officers' | 'admin'; // Who can see this title
  assignableRoles: string[]; // Which roles can be assigned this title
}

interface TitleManagementProps {
  user: User;
  onLogout: () => void;
}

const TitleManagement = ({ user, onLogout }: TitleManagementProps) => {
  const [titles, setTitles] = useState<Title[]>([
    { id: '1', name: 'Chapter Historian', description: 'Manages chapter archives and history.', visibility: 'all', assignableRoles: ['officer', 'member'] },
    { id: '2', name: 'Philanthropy Chair', description: 'Organizes and leads philanthropy events.', visibility: 'all', assignableRoles: ['officer'] },
    { id: '3', name: 'New Member Educator', description: 'Guides new members through their process.', visibility: 'all', assignableRoles: ['officer'] },
    { id: '4', name: 'National Delegate', description: 'Represents the chapter at national conventions.', visibility: 'officers', assignableRoles: ['officer'] },
    { id: '5', name: 'Alumni Relations', description: 'Maintains connections with chapter alumni.', visibility: 'all', assignableRoles: ['officer', 'member'] },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTitleDialogOpen, setIsAddTitleDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<Title | null>(null);

  const filteredTitles = titles.filter(title =>
    title.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    title.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTitle = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add new title
    setIsAddTitleDialogOpen(false);
  };

  const handleEditTitle = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to edit title
    setEditingTitle(null);
  };

  const handleDeleteTitle = (id: string) => {
    if (confirm('Are you sure you want to delete this title?')) {
      setTitles(titles.filter(title => title.id !== id));
    }
  };

  if (user.role !== 'admin' && user.role !== 'national_hq') {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Titles Management</h1>
            <p className="text-gray-600">Create and manage custom titles for members</p>
          </div>
          <Dialog open={isAddTitleDialogOpen} onOpenChange={setIsAddTitleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                <Plus className="mr-2 h-4 w-4" />
                Add New Title
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>Add New Title</DialogTitle>
                <DialogDescription>
                  Define a new custom title and its properties.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTitle} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titleName">Title Name</Label>
                  <Input id="titleName" placeholder="e.g., Chapter Historian" required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleDescription">Description</Label>
                  <Textarea id="titleDescription" placeholder="Brief description of the title's responsibilities." rows={3} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Who can see this title?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="officers">Officers Only</SelectItem>
                      <SelectItem value="admin">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignableRoles">Assignable Roles</Label>
                  <Select multiple>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Which roles can have this title?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="chapter">Chapter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddTitleDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Add Title</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="rounded-xl card-shadow">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Titles List */}
        <Card className="rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Defined Custom Titles</CardTitle>
            <CardDescription>List of all custom titles and their properties.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTitles.map((title) => (
                <div key={title.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium text-lg">{title.name}</h3>
                    <p className="text-sm text-gray-600">{title.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="rounded-md">Visibility: {title.visibility}</Badge>
                      <Badge variant="outline" className="rounded-md">Assignable: {title.assignableRoles.join(', ')}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingTitle(title)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTitle(title.id)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {filteredTitles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No custom titles found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Title Dialog */}
        {editingTitle && (
          <Dialog open={!!editingTitle} onOpenChange={() => setEditingTitle(null)}>
            <DialogContent className="sm:max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>Edit Title</DialogTitle>
                <DialogDescription>
                  Modify the properties of the custom title.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditTitle} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitleName">Title Name</Label>
                  <Input id="editTitleName" defaultValue={editingTitle.name} required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTitleDescription">Description</Label>
                  <Textarea id="editTitleDescription" defaultValue={editingTitle.description} rows={3} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editVisibility">Visibility</Label>
                  <Select defaultValue={editingTitle.visibility}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Who can see this title?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="officers">Officers Only</SelectItem>
                      <SelectItem value="admin">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAssignableRoles">Assignable Roles</Label>
                  <Select multiple defaultValue={editingTitle.assignableRoles}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Which roles can have this title?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="chapter">Chapter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingTitle(null)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default TitleManagement;