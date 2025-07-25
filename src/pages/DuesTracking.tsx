import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Search, Download, Send, AlertCircle, Plus, Calendar, Edit, Eye, EyeOff, Settings } from 'lucide-react';
import { User } from '../App';

interface DuesTrackingProps {
  user: User;
  onLogout: () => void;
}

interface DuesRecord {
  id: string;
  memberName: string;
  memberId: string;
  membershipId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  quarter: string;
  year: number;
  paymentMethod?: string;
  notes?: string;
}

interface QuarterlyDues {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  amount: number;
  dueDate: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
}

interface FinancialPermissions {
  userId: string;
  userName: string;
  userRole: string;
  canViewTotalCollected: boolean;
  canViewCollectionRate: boolean;
  canViewOrgFinancials: boolean;
}

const DuesTracking = ({ user, onLogout }: DuesTrackingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterQuarter, setFilterQuarter] = useState('all');
  const [isNewDuesDialogOpen, setIsNewDuesDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

  // Financial permissions for different users
  const [financialPermissions, setFinancialPermissions] = useState<FinancialPermissions[]>([
    {
      userId: '1',
      userName: 'Sarah Johnson',
      userRole: 'admin',
      canViewTotalCollected: true,
      canViewCollectionRate: true,
      canViewOrgFinancials: true
    },
    {
      userId: '2',
      userName: 'Emma Wilson',
      userRole: 'officer',
      canViewTotalCollected: true,
      canViewCollectionRate: true,
      canViewOrgFinancials: false
    },
    {
      userId: '3',
      userName: 'Jessica Chen',
      userRole: 'member',
      canViewTotalCollected: false,
      canViewCollectionRate: false,
      canViewOrgFinancials: false
    },
    {
      userId: '4',
      userName: 'Madison Taylor',
      userRole: 'officer',
      canViewTotalCollected: true,
      canViewCollectionRate: true,
      canViewOrgFinancials: true
    }
  ]);

  // Get current user's financial permissions
  const currentUserPermissions = financialPermissions.find(p => p.userId === user.id) || {
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    canViewTotalCollected: user.role === 'admin' || user.role === 'national_hq',
    canViewCollectionRate: user.role === 'admin' || user.role === 'national_hq',
    canViewOrgFinancials: user.role === 'admin' || user.role === 'national_hq'
  };

  // Mock quarterly dues settings
  const [quarterlyDues, setQuarterlyDues] = useState<QuarterlyDues[]>([
    {
      id: '1',
      quarter: 'Q1',
      year: 2024,
      amount: 450,
      dueDate: '2024-03-15',
      description: 'Q1 2024 - Chapter dues including social events and maintenance',
      isActive: true,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-01-01'
    },
    {
      id: '2',
      quarter: 'Q2',
      year: 2024,
      amount: 475,
      dueDate: '2024-06-15',
      description: 'Q2 2024 - Chapter dues including spring formal and philanthropy',
      isActive: true,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-03-01'
    },
    {
      id: '3',
      quarter: 'Q3',
      year: 2024,
      amount: 425,
      dueDate: '2024-09-15',
      description: 'Q3 2024 - Chapter dues for fall semester activities',
      isActive: true,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-06-01'
    },
    {
      id: '4',
      quarter: 'Q4',
      year: 2024,
      amount: 500,
      dueDate: '2024-12-15',
      description: 'Q4 2024 - Chapter dues including holiday events and year-end activities',
      isActive: false,
      createdBy: 'Sarah Johnson',
      createdDate: '2024-09-01'
    }
  ]);

  // Mock dues records with LEM prefix
  const allDuesRecords: DuesRecord[] = [
    {
      id: '1',
      memberName: 'Sarah Johnson',
      memberId: '1',
      membershipId: 'LEM-2021-001',
      amount: 450,
      dueDate: '2024-03-15',
      paidDate: '2024-03-10',
      status: 'paid',
      quarter: 'Q1 2024',
      year: 2024,
      paymentMethod: 'Credit Card',
      notes: 'Paid early'
    },
    {
      id: '2',
      memberName: 'Emma Wilson',
      memberId: '2',
      membershipId: 'LEM-2022-015',
      amount: 450,
      dueDate: '2024-03-15',
      paidDate: '2024-03-12',
      status: 'paid',
      quarter: 'Q1 2024',
      year: 2024,
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '3',
      memberName: 'Jessica Chen',
      memberId: '3',
      membershipId: 'LEM-2023-032',
      amount: 475,
      dueDate: '2024-06-15',
      status: 'pending',
      quarter: 'Q2 2024',
      year: 2024
    },
    {
      id: '4',
      memberName: 'Madison Taylor',
      memberId: '4',
      membershipId: 'LEM-2021-008',
      amount: 450,
      dueDate: '2024-03-15',
      status: 'overdue',
      quarter: 'Q1 2024',
      year: 2024
    },
    {
      id: '5',
      memberName: 'Olivia Martinez',
      memberId: '5',
      membershipId: 'LEM-2022-023',
      amount: 475,
      dueDate: '2024-06-15',
      paidDate: '2024-06-08',
      status: 'paid',
      quarter: 'Q2 2024',
      year: 2024,
      paymentMethod: 'Check'
    },
    // Current user's records (for member view)
    {
      id: '6',
      memberName: user.name,
      memberId: user.id,
      membershipId: 'LEM-2022-020',
      amount: 450,
      dueDate: '2024-03-15',
      paidDate: '2024-03-14',
      status: 'paid',
      quarter: 'Q1 2024',
      year: 2024,
      paymentMethod: 'Credit Card'
    },
    {
      id: '7',
      memberName: user.name,
      memberId: user.id,
      membershipId: 'LEM-2022-020',
      amount: 475,
      dueDate: '2024-06-15',
      paidDate: '2024-06-10',
      status: 'paid',
      quarter: 'Q2 2024',
      year: 2024,
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '8',
      memberName: user.name,
      memberId: user.id,
      membershipId: 'LEM-2022-020',
      amount: 425,
      dueDate: '2024-09-15',
      status: 'pending',
      quarter: 'Q3 2024',
      year: 2024
    }
  ];

  // Filter records based on user role and permissions
  const duesRecords = user.role === 'member' && !currentUserPermissions.canViewOrgFinancials
    ? allDuesRecords.filter(record => record.memberId === user.id)
    : allDuesRecords;

  const filteredRecords = duesRecords.filter(record => {
    const matchesSearch = record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.membershipId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesQuarter = filterQuarter === 'all' || record.quarter === filterQuarter;
    
    return matchesSearch && matchesStatus && matchesQuarter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreateQuarterlyDues = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsNewDuesDialogOpen(false);
  };

  const handleToggleDuesStatus = (duesId: string) => {
    setQuarterlyDues(prev => prev.map(dues => 
      dues.id === duesId 
        ? { ...dues, isActive: !dues.isActive }
        : dues
    ));
  };

  const handlePermissionChange = (userId: string, permission: keyof Omit<FinancialPermissions, 'userId' | 'userName' | 'userRole'>, value: boolean) => {
    setFinancialPermissions(prev => prev.map(perm => 
      perm.userId === userId 
        ? { ...perm, [permission]: value }
        : perm
    ));
  };

  // Calculate statistics based on permissions
  const totalRecords = filteredRecords.length;
  const paidRecords = filteredRecords.filter(r => r.status === 'paid').length;
  const pendingRecords = filteredRecords.filter(r => r.status === 'pending').length;
  const overdueRecords = filteredRecords.filter(r => r.status === 'overdue').length;
  
  // Only calculate organizational totals if user has permission
  const totalCollected = currentUserPermissions.canViewTotalCollected 
    ? filteredRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)
    : filteredRecords.filter(r => r.status === 'paid' && r.memberId === user.id).reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpected = currentUserPermissions.canViewTotalCollected
    ? filteredRecords.reduce((sum, r) => sum + r.amount, 0)
    : filteredRecords.filter(r => r.memberId === user.id).reduce((sum, r) => sum + r.amount, 0);
  
  const collectionRate = totalRecords > 0 ? (paidRecords / totalRecords) * 100 : 0;

  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

  // Check if user is suspended or inactive (assuming user object has a status property)
  // For now, we'll use a mock status for the current user
  const currentUserStatus = 'active'; // Replace with actual user.status from a backend

  if (currentUserStatus === 'suspended' || currentUserStatus === 'inactive') {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
          <p className="text-gray-600">Your account is currently {currentUserStatus}. Please contact an administrator for assistance.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'member' && !currentUserPermissions.canViewOrgFinancials ? 'My Dues' : 'Dues Tracking'}
            </h1>
            <p className="text-gray-600">
              {user.role === 'member' && !currentUserPermissions.canViewOrgFinancials
                ? 'View your dues payment history and upcoming payments'
                : 'Monitor and manage chapter dues payments'
              }
            </p>
          </div>
          {(user.role === 'admin' || user.role === 'officer') && (
            <div className="flex gap-2">
              {user.role === 'admin' && (
                <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      <Settings className="mr-2 h-4 w-4" />
                      Financial Permissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Financial Data Permissions</DialogTitle>
                      <DialogDescription>
                        Control who can view organizational financial information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {financialPermissions.map((permission) => (
                        <div key={permission.userId} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{permission.userName}</h4>
                              <p className="text-sm text-gray-500 capitalize">{permission.userRole}</p>
                            </div>
                            <Badge variant="outline" className="rounded-md">{permission.userRole}</Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {permission.canViewTotalCollected ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                                <Label className="text-sm">View Total Collected</Label>
                              </div>
                              <Switch
                                checked={permission.canViewTotalCollected}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.userId, 'canViewTotalCollected', checked)
                                }
                                disabled={permission.userRole === 'admin'}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {permission.canViewCollectionRate ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                                <Label className="text-sm">View Collection Rate</Label>
                              </div>
                              <Switch
                                checked={permission.canViewCollectionRate}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.userId, 'canViewCollectionRate', checked)
                                }
                                disabled={permission.userRole === 'admin'}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {permission.canViewOrgFinancials ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                                <Label className="text-sm">View All Member Records</Label>
                              </div>
                              <Switch
                                checked={permission.canViewOrgFinancials}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.userId, 'canViewOrgFinancials', checked)
                                }
                                disabled={permission.userRole === 'admin'}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setIsPermissionsDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                <Send className="mr-2 h-4 w-4" />
                Send Reminders
              </Button>
            </div>
          )}
        </div>

        {/* Statistics Cards - Conditional based on permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentUserPermissions.canViewCollectionRate && (
            <Card className="rounded-xl card-shadow card-hover-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {currentUserPermissions.canViewOrgFinancials ? 'Collection Rate' : 'Payment Rate'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
                <Progress value={collectionRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {paidRecords} of {totalRecords} paid
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUserPermissions.canViewTotalCollected ? 'Total Collected' : 'Your Total Paid'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
              {currentUserPermissions.canViewTotalCollected && (
                <p className="text-xs text-muted-foreground">
                  of ${totalExpected.toLocaleString()} expected
                </p>
              )}
              {!currentUserPermissions.canViewTotalCollected && (
                <p className="text-xs text-muted-foreground">
                  Your contributions
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUserPermissions.canViewOrgFinancials ? 'Pending Payments' : 'Your Pending'}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRecords}</div>
              <p className="text-xs text-muted-foreground">
                {currentUserPermissions.canViewTotalCollected 
                  ? `$${(pendingRecords * 450).toLocaleString()} outstanding`
                  : 'Awaiting payment'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUserPermissions.canViewOrgFinancials ? 'Overdue' : 'Your Overdue'}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueRecords}</div>
              <p className="text-xs text-muted-foreground">
                {currentUserPermissions.canViewOrgFinancials 
                  ? 'Require follow-up'
                  : overdueRecords > 0 ? 'Immediate attention needed' : 'All up to date'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="rounded-lg">
            <TabsTrigger value="records" className="rounded-md">
              {currentUserPermissions.canViewOrgFinancials ? 'Payment Records' : 'My Payment History'}
            </TabsTrigger>
            {(user.role === 'admin' || user.role === 'officer') && (
              <TabsTrigger value="quarterly" className="rounded-md">Quarterly Dues Management</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            {/* Filters */}
            <Card className="rounded-xl card-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {currentUserPermissions.canViewOrgFinancials && (
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by member name or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                  <Select value={filterQuarter} onValueChange={setFilterQuarter}>
                    <SelectTrigger className="w-full sm:w-40 rounded-lg">
                      <SelectValue placeholder="Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quarters</SelectItem>
                      {quarters.map((quarter) => (
                        <SelectItem key={quarter} value={quarter}>
                          {quarter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 rounded-lg">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dues Records */}
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle>
                  {currentUserPermissions.canViewOrgFinancials ? 'Dues Records' : 'Your Payment History'}
                </CardTitle>
                <CardDescription>
                  {currentUserPermissions.canViewOrgFinancials
                    ? 'Detailed view of all member dues payments'
                    : 'Your personal dues payment history and status'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-full space-y-4">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1 space-y-2 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {currentUserPermissions.canViewOrgFinancials && (
                              <>
                                <h3 className="font-medium">{record.memberName}</h3>
                                <Badge variant="outline" className="w-fit rounded-md">{record.membershipId}</Badge>
                              </>
                            )}
                            <Badge variant={getStatusColor(record.status)} className="w-fit rounded-md">
                              {record.status}
                            </Badge>
                            <Badge variant="secondary" className="w-fit rounded-md">
                              {record.quarter}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Amount: <span className="font-medium">${record.amount}</span></p>
                            <p>Due Date: <span className="font-medium">{new Date(record.dueDate).toLocaleDateString()}</span></p>
                            {record.paidDate && (
                              <p>Paid: <span className="font-medium">{new Date(record.paidDate).toLocaleDateString()}</span></p>
                            )}
                            {record.paymentMethod && (
                              <p>Method: <span className="font-medium">{record.paymentMethod}</span></p>
                            )}
                            {record.notes && (
                              <p>Notes: <span className="font-medium">{record.notes}</span></p>
                            )}
                          </div>
                        </div>
                        {currentUserPermissions.canViewOrgFinancials && (user.role === 'admin' || user.role === 'officer') && (
                          <div className="flex gap-2 mt-3 sm:mt-0">
                            {record.status === 'pending' && (
                              <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                                Mark Paid
                              </Button>
                            )}
                            {record.status === 'overdue' && (
                              <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                                Send Reminder
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                              View Details
                            </Button>
                          </div>
                        )}
                        {!currentUserPermissions.canViewOrgFinancials && record.status === 'pending' && (
                          <div className="flex gap-2 mt-3 sm:mt-0">
                            <Button size="sm" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                              Pay Now
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {filteredRecords.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No dues records found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {(user.role === 'admin' || user.role === 'officer') && (
            <TabsContent value="quarterly" className="space-y-6">
              {/* Create New Quarterly Dues */}
              <Card className="rounded-xl card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quarterly Dues Management</CardTitle>
                      <CardDescription>
                        Set up and manage quarterly dues for all members
                      </CardDescription>
                    </div>
                    <Dialog open={isNewDuesDialogOpen} onOpenChange={setIsNewDuesDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Quarter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl">
                        <DialogHeader>
                          <DialogTitle>Create Quarterly Dues</DialogTitle>
                          <DialogDescription>
                            Set up dues for a new quarter
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateQuarterlyDues} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="quarter">Quarter</Label>
                              <Select required>
                                <SelectTrigger className="rounded-lg">
                                  <SelectValue placeholder="Select quarter" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Q1">Q1</SelectItem>
                                  <SelectItem value="Q2">Q2</SelectItem>
                                  <SelectItem value="Q3">Q3</SelectItem>
                                  <SelectItem value="Q4">Q4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="year">Year</Label>
                              <Input id="year" type="number" min="2024" defaultValue="2024" required className="rounded-lg" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input id="amount" type="number" min="0" step="0.01" placeholder="450.00" required className="rounded-lg" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input id="dueDate" type="date" required className="rounded-lg" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description" 
                              placeholder="Describe what this dues payment covers..."
                              rows={3}
                              required 
                              className="rounded-lg"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsNewDuesDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                              Cancel
                            </Button>
                            <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Create Dues</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quarterlyDues.map((dues) => (
                      <div key={dues.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{dues.quarter} {dues.year}</h3>
                            <Badge variant={dues.isActive ? 'default' : 'secondary'} className="rounded-md">
                              {dues.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <span className="text-lg font-semibold text-green-600">
                              ${dues.amount}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{dues.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Due: {new Date(dues.dueDate).toLocaleDateString()}
                            </span>
                            <span>Created by {dues.createdBy}</span>
                            <span>{new Date(dues.createdDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleDuesStatus(dues.id)}
                            className="rounded-lg transition-all duration-300 hover:scale-[1.01]"
                          >
                            {dues.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default DuesTracking;