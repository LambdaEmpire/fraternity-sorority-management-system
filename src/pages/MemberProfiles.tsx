import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Filter, UserPlus, Mail, Phone, Tag, Plus, X } from 'lucide-react';
import { User } from '../App';

interface MemberProfilesProps {
  user: User;
  onLogout: () => void;
}

interface CustomLabel {
  id: string;
  text: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  graduationYear: string;
  major: string;
  serviceHours: number;
  duesStatus: 'paid' | 'pending' | 'overdue';
  avatar?: string;
  chapter?: string;
  region?: string;
  customLabels?: CustomLabel[];
}

const MemberProfiles = ({ user, onLogout }: MemberProfilesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChapter, setFilterChapter] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');
  const [members, setMembers] = useState<Member[]>([]);

  // Initialize mock member data with LEM prefix and organizational levels
  const initializeMembers = (): Member[] => [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      phone: '(555) 123-4567',
      membershipId: 'LEM-2021-001',
      role: 'President',
      status: 'active',
      joinDate: '2021-08-15',
      graduationYear: '2024',
      major: 'Business Administration',
      serviceHours: 45,
      duesStatus: 'paid',
      chapter: 'Alpha Chi Omega - Beta Chapter',
      region: 'Southeast Region',
      customLabels: [
        { id: '1', text: 'Outstanding Leader', color: 'gold', createdBy: 'Admin', createdAt: '2024-01-15' },
        { id: '2', text: 'Scholarship Recipient', color: 'blue', createdBy: 'Admin', createdAt: '2024-02-01' }
      ]
    },
    {
      id: '2',
      name: 'Emma Wilson',
      email: 'emma.wilson@university.edu',
      phone: '(555) 234-5678',
      membershipId: 'LEM-2022-015',
      role: 'Vice President',
      status: 'active',
      joinDate: '2022-01-20',
      graduationYear: '2025',
      major: 'Psychology',
      serviceHours: 38,
      duesStatus: 'paid',
      chapter: 'Alpha Chi Omega - Beta Chapter',
      region: 'Southeast Region',
      customLabels: [
        { id: '3', text: 'Event Coordinator', color: 'green', createdBy: 'Admin', createdAt: '2024-01-20' }
      ]
    },
    {
      id: '3',
      name: 'Jessica Chen',
      email: 'jessica.chen@university.edu',
      phone: '(555) 345-6789',
      membershipId: 'LEM-2023-032',
      role: 'Member',
      status: 'pending',
      joinDate: '2023-09-01',
      graduationYear: '2026',
      major: 'Computer Science',
      serviceHours: 12,
      duesStatus: 'pending',
      chapter: 'Sigma Chi - Gamma Chapter',
      region: 'Midwest Region',
      customLabels: [
        { id: '4', text: 'New Member', color: 'purple', createdBy: 'Chapter Officer', createdAt: '2024-03-01' }
      ]
    },
    {
      id: '4',
      name: 'Madison Taylor',
      email: 'madison.taylor@university.edu',
      phone: '(555) 456-7890',
      membershipId: 'LEM-2021-008',
      role: 'Treasurer',
      status: 'active',
      joinDate: '2021-08-15',
      graduationYear: '2024',
      major: 'Accounting',
      serviceHours: 52,
      duesStatus: 'overdue',
      chapter: 'Kappa Kappa Gamma - Delta Chapter',
      region: 'Northeast Region',
      customLabels: [
        { id: '5', text: 'Financial Expert', color: 'yellow', createdBy: 'Admin', createdAt: '2024-01-10' },
        { id: '6', text: 'Needs Follow-up', color: 'red', createdBy: 'Admin', createdAt: '2024-03-15' }
      ]
    },
    {
      id: '5',
      name: 'Olivia Martinez',
      email: 'olivia.martinez@university.edu',
      phone: '(555) 567-8901',
      membershipId: 'LEM-2022-023',
      role: 'Secretary',
      status: 'active',
      joinDate: '2022-01-20',
      graduationYear: '2025',
      major: 'Communications',
      serviceHours: 41,
      duesStatus: 'paid',
      chapter: 'Alpha Alpha Alpha',
      region: 'Midwest Region',
      customLabels: [
        { id: '7', text: 'Communication Lead', color: 'teal', createdBy: 'Regional Officer', createdAt: '2024-02-20' }
      ]
    }
  ];

  // Initialize members on component mount
  useState(() => {
    setMembers(initializeMembers());
  });

  const chapters = Array.from(new Set(members.map(m => m.chapter))).filter(Boolean) as string[];
  const regions = Array.from(new Set(members.map(m => m.region))).filter(Boolean) as string[];

  const addCustomLabel = (memberId: string, label: CustomLabel) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, customLabels: [...(member.customLabels || []), label] }
        : member
    ));
  };

  const removeCustomLabel = (memberId: string, labelId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, customLabels: (member.customLabels || []).filter(label => label.id !== labelId) }
        : member
    ));
  };

  const handleAddLabel = () => {
    if (!selectedMember || !newLabelText.trim()) return;

    const newLabel: CustomLabel = {
      id: Date.now().toString(),
      text: newLabelText.trim(),
      color: newLabelColor,
      createdBy: user.name,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addCustomLabel(selectedMember.id, newLabel);
    setNewLabelText('');
    setNewLabelColor('blue');
  };

  const getLabelColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'teal': 'bg-teal-100 text-teal-800 border-teal-200',
      'gold': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.membershipId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || member.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesChapter = filterChapter === 'all' || member.chapter === filterChapter;
    const matchesRegion = filterRegion === 'all' || member.region === filterRegion;

    // Role-based visibility
    if (user.role === 'member' && member.role === 'President') {
      return false; // Example: regular members can't see president details
    }
    // Regional users only see members in their region
    if (user.role === 'regional' && user.region && member.region !== user.region) {
      return false;
    }
    // Chapter users only see members in their chapter
    if (user.role === 'chapter' && user.chapter && member.chapter !== user.chapter) {
      return false;
    }
    
    return matchesSearch && matchesRole && matchesStatus && matchesChapter && matchesRegion;
  });

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'president': return 'destructive';
      case 'vice president': return 'default';
      case 'treasurer': return 'secondary';
      case 'secretary': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  const getDuesStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Member Profiles</h1>
            <p className="text-gray-600">Manage and view chapter member information</p>
          </div>
          {(user.role === 'admin' || user.role === 'officer' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
            <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="rounded-xl card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search members by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="president">President</SelectItem>
                  <SelectItem value="vice president">Vice President</SelectItem>
                  <SelectItem value="treasurer">Treasurer</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(user.role === 'admin' || user.role === 'national_hq') && (
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-full sm:w-40 rounded-lg">
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional') && (
                <Select value={filterChapter} onValueChange={setFilterChapter}>
                  <SelectTrigger className="w-full sm:w-40 rounded-lg">
                    <SelectValue placeholder="Filter by chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter} value={chapter}>
                        {chapter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="rounded-xl card-shadow card-hover-effect">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-aqua-600 text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{member.name}</CardTitle>
                    <CardDescription className="truncate">{member.membershipId}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={getRoleColor(member.role)} className="rounded-md">{member.role}</Badge>
                  <Badge variant={getStatusColor(member.status)} className="rounded-md">{member.status}</Badge>
                  {member.chapter && <Badge variant="outline" className="rounded-md text-xs">{member.chapter}</Badge>}
                  {member.region && <Badge variant="outline" className="rounded-md text-xs">{member.region}</Badge>}
                </div>
                
                {/* Custom Labels */}
                {member.customLabels && member.customLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {member.customLabels.map((label) => (
                      <span
                        key={label.id}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getLabelColorClass(label.color)}`}
                      >
                        <Tag className="h-3 w-3" />
                        {label.text}
                        {(user.role === 'admin' || user.role === 'national_hq') && (
                          <button
                            onClick={() => removeCustomLabel(member.id, label.id)}
                            className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="mr-2 h-4 w-4 text-aqua-500" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="mr-2 h-4 w-4 text-aqua-500" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Major</p>
                    <p className="font-medium truncate">{member.major}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Grad Year</p>
                    <p className="font-medium">{member.graduationYear}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Service Hours</p>
                    <p className="font-medium">{member.serviceHours}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Dues Status</p>
                    <Badge variant={getDuesStatusColor(member.duesStatus)} className="text-xs rounded-md">
                      {member.duesStatus}
                    </Badge>
                  </div>
                </div>

                {(user.role === 'admin' || user.role === 'officer' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <Button variant="outline" size="sm" className="w-full rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      View Details
                    </Button>
                    {(user.role === 'admin' || user.role === 'national_hq') && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full rounded-lg transition-all duration-300 hover:scale-[1.01]"
                            onClick={() => setSelectedMember(member)}
                          >
                            <Tag className="mr-2 h-3 w-3" />
                            Manage Labels
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Manage Labels for {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Current Labels */}
                            <div>
                              <Label className="text-sm font-medium">Current Labels</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {member.customLabels && member.customLabels.length > 0 ? (
                                  member.customLabels.map((label) => (
                                    <span
                                      key={label.id}
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getLabelColorClass(label.color)}`}
                                    >
                                      <Tag className="h-3 w-3" />
                                      {label.text}
                                      <button
                                        onClick={() => removeCustomLabel(member.id, label.id)}
                                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No custom labels</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Add New Label */}
                            <div className="border-t pt-4">
                              <Label className="text-sm font-medium">Add New Label</Label>
                              <div className="space-y-3 mt-2">
                                <Input
                                  placeholder="Label text"
                                  value={newLabelText}
                                  onChange={(e) => setNewLabelText(e.target.value)}
                                  className="rounded-lg"
                                />
                                <Select value={newLabelColor} onValueChange={setNewLabelColor}>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="yellow">Yellow</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="purple">Purple</SelectItem>
                                    <SelectItem value="teal">Teal</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  onClick={handleAddLabel}
                                  disabled={!newLabelText.trim()}
                                  className="w-full rounded-lg"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Label
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="rounded-xl card-shadow">
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No members found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MemberProfiles;