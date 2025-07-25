import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  Users, 
  Eye, 
  EyeOff, 
  Shield, 
  Search,
  UserCog,
  Lock,
  Unlock,
  Save
} from 'lucide-react';
import { User } from '../App';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: {
    dashboard: boolean;
    members: boolean;
    dues: boolean;
    service: boolean;
    communications: boolean;
    admin: boolean;
    financials: boolean;
    events: boolean;
    reports: boolean;
  };
}

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: {
    dashboard: boolean;
    members: boolean;
    dues: boolean;
    service: boolean;
    communications: boolean;
    admin: boolean;
    financials: boolean;
    events: boolean;
    reports: boolean;
  };
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  // Permission templates for quick assignment
  const permissionTemplates: PermissionTemplate[] = [
    {
      id: 'full-access',
      name: 'Full Access',
      description: 'Complete access to all areas',
      permissions: {
        dashboard: true,
        members: true,
        dues: true,
        service: true,
        communications: true,
        admin: true,
        financials: true,
        events: true,
        reports: true
      }
    },
    {
      id: 'officer',
      name: 'Officer Access',
      description: 'Standard officer permissions',
      permissions: {
        dashboard: true,
        members: true,
        dues: true,
        service: true,
        communications: true,
        admin: false,
        financials: true,
        events: true,
        reports: true
      }
    },
    {
      id: 'member',
      name: 'Member Access',
      description: 'Basic member permissions',
      permissions: {
        dashboard: true,
        members: false,
        dues: false,
        service: true,
        communications: true,
        admin: false,
        financials: false,
        events: true,
        reports: false
      }
    },
    {
      id: 'restricted',
      name: 'Restricted Access',
      description: 'Limited access for probationary members',
      permissions: {
        dashboard: true,
        members: false,
        dues: false,
        service: true,
        communications: false,
        admin: false,
        financials: false,
        events: false,
        reports: false
      }
    }
  ];

  // Mock member data with permissions
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'President',
      status: 'active',
      permissions: {
        dashboard: true,
        members: true,
        dues: true,
        service: true,
        communications: true,
        admin: true,
        financials: true,
        events: true,
        reports: true
      }
    },
    {
      id: '2',
      name: 'Emma Wilson',
      email: 'emma.wilson@university.edu',
      role: 'Vice President',
      status: 'active',
      permissions: {
        dashboard: true,
        members: true,
        dues: true,
        service: true,
        communications: true,
        admin: false,
        financials: true,
        events: true,
        reports: true
      }
    },
    {
      id: '3',
      name: 'Jessica Chen',
      email: 'jessica.chen@university.edu',
      role: 'Member',
      status: 'active',
      permissions: {
        dashboard: true,
        members: false,
        dues: false,
        service: true,
        communications: true,
        admin: false,
        financials: false,
        events: true,
        reports: false
      }
    },
    {
      id: '4',
      name: 'Madison Taylor',
      email: 'madison.taylor@university.edu',
      role: 'Treasurer',
      status: 'active',
      permissions: {
        dashboard: true,
        members: true,
        dues: true,
        service: true,
        communications: true,
        admin: false,
        financials: true,
        events: true,
        reports: true
      }
    },
    {
      id: '5',
      name: 'Alex Thompson',
      email: 'alex.thompson@university.edu',
      role: 'Member',
      status: 'suspended',
      permissions: {
        dashboard: true,
        members: false,
        dues: false,
        service: false,
        communications: false,
        admin: false,
        financials: false,
        events: false,
        reports: false
      }
    }
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const handlePermissionChange = (memberId: string, permission: keyof Member['permissions'], value: boolean) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, permissions: { ...member.permissions, [permission]: value } }
        : member
    ));
  };

  const applyTemplate = (memberId: string, templateId: string) => {
    const template = permissionTemplates.find(t => t.id === templateId);
    if (template) {
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, permissions: { ...template.permissions } }
          : member
      ));
    }
  };

  const handleStatusChange = (memberId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: newStatus }
        : member
    ));
  };

  const permissionLabels = {
    dashboard: 'Dashboard Access',
    members: 'Member Profiles',
    dues: 'Dues Tracking',
    service: 'Service Hours',
    communications: 'Communications',
    admin: 'Admin Functions',
    financials: 'Financial Reports',
    events: 'Event Management',
    reports: 'Analytics & Reports'
  };

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const suspendedMembers = members.filter(m => m.status === 'suspended').length;
  const restrictedMembers = members.filter(m => 
    Object.values(m.permissions).filter(Boolean).length < 5
  ).length;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lambda Empire Admin Dashboard</h1>
            <p className="text-gray-600">Manage member permissions and access control</p>
          </div>
          <Button>
            <UserCog className="mr-2 h-4 w-4" />
            Bulk Actions
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Under management</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
              <p className="text-xs text-muted-foreground">Full access granted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restricted Access</CardTitle>
              <EyeOff className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{restrictedMembers}</div>
              <p className="text-xs text-muted-foreground">Limited permissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <Lock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{suspendedMembers}</div>
              <p className="text-xs text-muted-foreground">Access revoked</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="permissions">Member Permissions</TabsTrigger>
            <TabsTrigger value="templates">Permission Templates</TabsTrigger>
            <TabsTrigger value="audit">Access Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search members by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members Permission Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Member Access Control</CardTitle>
                <CardDescription>
                  Manage what areas each member can access in the Lambda Empire system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-gray-500">{member.email}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{member.role}</Badge>
                              <Badge variant={getStatusColor(member.status)}>
                                {member.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Select 
                            value={member.status} 
                            onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                              handleStatusChange(member.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Configure
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Permission Templates</DialogTitle>
                                <DialogDescription>
                                  Apply a permission template to {member.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {permissionTemplates.map((template) => (
                                  <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                      <h4 className="font-medium">{template.name}</h4>
                                      <p className="text-sm text-gray-500">{template.description}</p>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      onClick={() => applyTemplate(member.id, template.id)}
                                    >
                                      Apply
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {/* Permission Toggles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                              {member.permissions[key as keyof Member['permissions']] ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                              <Label htmlFor={`${member.id}-${key}`} className="text-sm">
                                {label}
                              </Label>
                            </div>
                            <Switch
                              id={`${member.id}-${key}`}
                              checked={member.permissions[key as keyof Member['permissions']]}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(member.id, key as keyof Member['permissions'], checked)
                              }
                              disabled={member.status === 'suspended'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No members found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Templates</CardTitle>
                <CardDescription>
                  Pre-configured permission sets for different member roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {permissionTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(permissionLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm">{label}</span>
                              {template.permissions[key as keyof typeof template.permissions] ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Audit Log</CardTitle>
                <CardDescription>
                  Recent permission changes and access attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Permission Updated</p>
                        <p className="text-sm text-gray-500">Jessica Chen granted access to Member Profiles</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Access Suspended</p>
                        <p className="text-sm text-gray-500">Alex Thompson suspended from all areas</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Unlock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Template Applied</p>
                        <p className="text-sm text-gray-500">Officer template applied to Emma Wilson</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;