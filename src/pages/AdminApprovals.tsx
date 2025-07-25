
import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCheck, Clock, CheckCircle, XCircle, AlertCircle, Users, DollarSign } from 'lucide-react';
import { User } from '../App';

interface AdminApprovalsProps {
  user: User;
  onLogout: () => void;
}

interface PendingApproval {
  id: string;
  type: 'member' | 'service' | 'expense' | 'event';
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  amount?: number;
  details: any;
}

const AdminApprovals = ({ user, onLogout }: AdminApprovalsProps) => {
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock pending approvals data
  const pendingApprovals: PendingApproval[] = [
    {
      id: '1',
      type: 'member',
      title: 'New Member Application',
      description: 'Jessica Chen - Computer Science Major, GPA 3.8',
      submittedBy: 'Emma Wilson',
      submittedDate: '2024-01-25',
      priority: 'high',
      details: {
        name: 'Jessica Chen',
        email: 'jessica.chen@university.edu',
        major: 'Computer Science',
        gpa: 3.8,
        references: ['Sarah Johnson', 'Madison Taylor']
      }
    },
    {
      id: '2',
      type: 'service',
      title: 'Service Hours Verification',
      description: 'Community cleanup event - 15 hours logged',
      submittedBy: 'Olivia Martinez',
      submittedDate: '2024-01-24',
      priority: 'medium',
      details: {
        activity: 'Community Cleanup',
        hours: 15,
        date: '2024-01-20',
        category: 'Environmental'
      }
    },
    {
      id: '3',
      type: 'expense',
      title: 'Event Budget Request',
      description: 'Spring formal venue and catering expenses',
      submittedBy: 'Madison Taylor',
      submittedDate: '2024-01-23',
      priority: 'high',
      amount: 2500,
      details: {
        event: 'Spring Formal',
        venue: 'Grand Ballroom',
        attendees: 120,
        breakdown: {
          venue: 1500,
          catering: 800,
          decorations: 200
        }
      }
    },
    {
      id: '4',
      type: 'event',
      title: 'Philanthropy Event Proposal',
      description: 'Charity run fundraiser for local animal shelter',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-01-22',
      priority: 'medium',
      details: {
        eventName: 'Paws for a Cause 5K',
        date: '2024-03-15',
        expectedParticipants: 200,
        fundraisingGoal: 5000
      }
    },
    {
      id: '5',
      type: 'member',
      title: 'Member Status Change',
      description: 'Request to change Alex Thompson to alumni status',
      submittedBy: 'Emma Wilson',
      submittedDate: '2024-01-21',
      priority: 'low',
      details: {
        currentStatus: 'Active Member',
        requestedStatus: 'Alumni',
        reason: 'Graduated December 2023'
      }
    },
    {
      id: '6',
      type: 'expense',
      title: 'Equipment Purchase',
      description: 'New sound system for chapter house',
      submittedBy: 'Madison Taylor',
      submittedDate: '2024-01-20',
      priority: 'low',
      amount: 800,
      details: {
        item: 'Wireless Sound System',
        vendor: 'Audio Pro Solutions',
        warranty: '2 years'
      }
    }
  ];

  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesType = filterType === 'all' || approval.type === filterType;
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'member': return Users;
      case 'service': return Clock;
      case 'expense': return DollarSign;
      case 'event': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'member': return 'default';
      case 'service': return 'secondary';
      case 'expense': return 'destructive';
      case 'event': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approving:', id);
    // Handle approval logic
  };

  const handleReject = (id: string) => {
    console.log('Rejecting:', id);
    // Handle rejection logic
  };

  // Calculate statistics
  const totalPending = pendingApprovals.length;
  const highPriority = pendingApprovals.filter(a => a.priority === 'high').length;
  const memberApprovals = pendingApprovals.filter(a => a.type === 'member').length;
  const expenseApprovals = pendingApprovals.filter(a => a.type === 'expense').length;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Approvals</h1>
          <p className="text-gray-600">Review and approve pending requests</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highPriority}</div>
              <p className="text-xs text-muted-foreground">Urgent attention needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Requests</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberApprovals}</div>
              <p className="text-xs text-muted-foreground">New members & changes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expense Requests</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseApprovals}</div>
              <p className="text-xs text-muted-foreground">Budget approvals</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="member">Member Requests</SelectItem>
                  <SelectItem value="service">Service Hours</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Approvals List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              Review and take action on pending requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApprovals.map((approval) => {
                const TypeIcon = getTypeIcon(approval.type);
                return (
                  <div key={approval.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h3 className="font-medium">{approval.title}</h3>
                              <div className="flex gap-2">
                                <Badge variant={getTypeColor(approval.type)}>
                                  {approval.type}
                                </Badge>
                                <Badge variant={getPriorityColor(approval.priority)}>
                                  {approval.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{approval.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                              <span>Submitted by {approval.submittedBy}</span>
                              <span>• {new Date(approval.submittedDate).toLocaleDateString()}</span>
                              {approval.amount && (
                                <span>• Amount: ${approval.amount.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReject(approval.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredApprovals.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No pending approvals found.</p>
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminApprovals;
