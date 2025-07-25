import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Calendar, Award, TrendingUp } from 'lucide-react';
import { User } from '../App';

interface ServiceHoursProps {
  user: User;
  onLogout: () => void;
}

interface ServiceEntry {
  id: string;
  memberName: string;
  activity: string;
  description: string;
  hours: number;
  date: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
}

const ServiceHours = ({ user, onLogout }: ServiceHoursProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock service hours data
  const serviceEntries: ServiceEntry[] = [
    {
      id: '1',
      memberName: 'Sarah Johnson',
      activity: 'Community Food Bank',
      description: 'Sorted and packed food donations for local families',
      hours: 4,
      date: '2024-01-15',
      category: 'Community Service',
      status: 'approved',
      approvedBy: 'Emma Wilson'
    },
    {
      id: '2',
      memberName: 'Emma Wilson',
      activity: 'Habitat for Humanity',
      description: 'Helped build homes for low-income families',
      hours: 8,
      date: '2024-01-20',
      category: 'Community Service',
      status: 'approved',
      approvedBy: 'Sarah Johnson'
    },
    {
      id: '3',
      memberName: 'Jessica Chen',
      activity: 'Campus Cleanup',
      description: 'Organized campus-wide environmental cleanup event',
      hours: 3,
      date: '2024-01-22',
      category: 'Environmental',
      status: 'pending'
    },
    {
      id: '4',
      memberName: 'Madison Taylor',
      activity: 'Tutoring Program',
      description: 'Tutored elementary school students in math and reading',
      hours: 6,
      date: '2024-01-18',
      category: 'Education',
      status: 'approved',
      approvedBy: 'Sarah Johnson'
    },
    {
      id: '5',
      memberName: 'Olivia Martinez',
      activity: 'Animal Shelter Volunteer',
      description: 'Cared for animals and assisted with adoption events',
      hours: 5,
      date: '2024-01-25',
      category: 'Animal Welfare',
      status: 'approved',
      approvedBy: 'Emma Wilson'
    }
  ];

  const categories = [
    'Community Service',
    'Education',
    'Environmental',
    'Animal Welfare',
    'Healthcare',
    'Fundraising'
  ];

  const filteredEntries = serviceEntries.filter(entry => {
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    
    // Show only user's entries if they're a regular member
    if (user.role === 'member') {
      return entry.memberName === user.name && matchesCategory && matchesStatus;
    }
    
    return matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  // Calculate statistics
  const totalHours = filteredEntries
    .filter(entry => entry.status === 'approved')
    .reduce((sum, entry) => sum + entry.hours, 0);
  
  const monthlyGoal = 50; // Example monthly goal
  const progressPercentage = (totalHours / monthlyGoal) * 100;
  
  const pendingHours = filteredEntries
    .filter(entry => entry.status === 'pending')
    .reduce((sum, entry) => sum + entry.hours, 0);

  const handleSubmitHours = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsDialogOpen(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Hours</h1>
            <p className="text-gray-600">Track and manage community service activities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                <Plus className="mr-2 h-4 w-4" />
                Log Hours
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-xl">
              <DialogHeader>
                <DialogTitle>Log Service Hours</DialogTitle>
                <DialogDescription>
                  Record your community service activity for approval.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitHours} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Name</Label>
                  <Input id="activity" placeholder="e.g., Food Bank Volunteer" required className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input id="hours" type="number" min="0.5" step="0.5" placeholder="4" required className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" required className="rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your service activity..."
                    rows={3}
                    required 
                    className="rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Submit for Approval</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours (This Month)</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}</div>
              <Progress value={Math.min(progressPercentage, 100)} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {monthlyGoal - totalHours > 0 ? `${monthlyGoal - totalHours} hours to goal` : 'Goal achieved!'}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHours}</div>
              <p className="text-xs text-muted-foreground">
                {filteredEntries.filter(e => e.status === 'pending').length} entries pending
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                {totalHours} of {monthlyGoal} hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-xl card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 rounded-lg">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Service Entries */}
        <Card className="rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Service Activities</CardTitle>
            <CardDescription>
              {user.role === 'member' ? 'Your service hour entries' : 'All member service activities'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-medium">{entry.activity}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-md">{entry.category}</Badge>
                        <Badge variant={getStatusColor(entry.status)} className="rounded-md">
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-aqua-500" />
                        {entry.hours} hours
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-aqua-500" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      {user.role !== 'member' && (
                        <span>by {entry.memberName}</span>
                      )}
                      {entry.approvedBy && (
                        <span>• Approved by {entry.approvedBy}</span>
                      )}
                    </div>
                  </div>
                  {(user.role === 'admin' || user.role === 'officer') && entry.status === 'pending' && (
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No service hours found.</p>
                <p className="text-sm text-gray-400">Start logging your community service activities!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceHours;