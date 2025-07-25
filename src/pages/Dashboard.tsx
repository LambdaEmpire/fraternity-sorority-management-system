import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { User } from '../App';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  // Financial permissions for the current user (this would normally come from a context or API)
  const userFinancialPermissions = {
    canViewTotalCollected: user.role === 'admin' || user.role === 'national_hq',
    canViewCollectionRate: user.role === 'admin' || user.role === 'national_hq' || user.role === 'officer',
    canViewOrgFinancials: user.role === 'admin' || user.role === 'national_hq'
  };

  // Mock data - organizational stats
  const orgStats = {
    totalMembers: 156,
    activeMembers: 142,
    pendingDues: 23,
    totalDuesCollected: 45600,
    serviceHoursThisMonth: 234,
    serviceHoursGoal: 300,
    upcomingEvents: 5,
    pendingApprovals: user.role === 'admin' || user.role === 'national_hq' ? 8 : 0
  };

  // Mock data - user's personal financial data
  const userPersonalStats = {
    totalPaid: 925, // User's total contributions (Q1: $450 + Q2: $475)
    pendingPayments: 1, // User's pending payments
    overduePayments: 0, // User's overdue payments
    paymentRate: 100 // User's personal payment rate
  };

  const recentActivity = [
    { id: 1, type: 'dues', message: user.role === 'member' ? 'You paid Q2 2024 dues' : 'Emma Wilson paid semester dues', time: '2 hours ago' },
    { id: 2, type: 'service', message: 'Community cleanup event logged - 15 hours', time: '4 hours ago' },
    { id: 3, type: 'member', message: user.role === 'member' ? 'Welcome! Your membership was approved' : 'New member application from Jessica Chen', time: '6 hours ago' },
    { id: 4, type: 'event', message: 'Philanthropy event scheduled for next week', time: '1 day ago' },
  ];

  const quickActions = [
    { name: 'Log Service Hours', icon: Clock, href: '/service' },
    { name: 'View Members', icon: Users, href: '/members' },
    { name: user.role === 'member' ? 'My Dues' : 'Check Dues', icon: DollarSign, href: '/dues' },
    { name: 'Send Message', icon: MessageSquare, href: '/communications' },
  ];

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
        {/* Welcome Header */}
        <div className="gradient-header rounded-2xl p-6 text-white shadow-lg animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-white/80">
            {user.chapter && `Chapter: ${user.chapter}`}
            {user.region && `Region: ${user.region}`}
            {!user.chapter && !user.region && `Role: ${user.role.replace('_', ' ').toUpperCase()}`}
            {' • '}
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Members Card - Show for all users */}
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userFinancialPermissions.canViewOrgFinancials ? 'Total Members' : 'Chapter Members'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{orgStats.activeMembers} active</span>
              </p>
            </CardContent>
          </Card>

          {/* Dues Card - Conditional based on permissions */}
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userFinancialPermissions.canViewTotalCollected ? 'Dues Collected' : 'Your Contributions'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${userFinancialPermissions.canViewTotalCollected 
                  ? orgStats.totalDuesCollected.toLocaleString() 
                  : userPersonalStats.totalPaid.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {userFinancialPermissions.canViewTotalCollected ? (
                  <span className="text-amber-600">{orgStats.pendingDues} pending</span>
                ) : (
                  <span className="text-green-600">Your total paid</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Service Hours Card */}
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.serviceHoursThisMonth}</div>
              <div className="mt-2">
                <Progress value={(orgStats.serviceHoursThisMonth / orgStats.serviceHoursGoal) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {orgStats.serviceHoursGoal - orgStats.serviceHoursThisMonth} hours to goal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Events/Approvals Card */}
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === 'member' ? 'Upcoming Events' : 'Upcoming Events'}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orgStats.upcomingEvents}</div>
              {orgStats.pendingApprovals > 0 && (user.role === 'admin' || user.role === 'national_hq') && (
                <p className="text-xs text-amber-600 mt-1">
                  {orgStats.pendingApprovals} pending approvals
                </p>
              )}
              {user.role === 'member' && (
                <p className="text-xs text-muted-foreground mt-1">
                  This month
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 rounded-lg transition-all duration-300 hover:scale-[1.01]"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="h-6 w-6 text-aqua-600" />
                    <span className="text-sm text-center">{action.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
          </Card>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl card-shadow">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                {user.role === 'member' ? 'Your recent activity' : 'Latest updates from your chapter'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {activity.type === 'dues' && <DollarSign className="h-5 w-5 text-green-600" />}
                      {activity.type === 'service' && <Clock className="h-5 w-5 text-aqua-600" />}
                      {activity.type === 'member' && <Users className="h-5 w-5 text-gold-600" />}
                      {activity.type === 'event' && <Calendar className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow">
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Important items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.role === 'member' ? (
                  // Member-specific alerts
                  <>
                    {userPersonalStats.pendingPayments > 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-gold-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gold-800">Payment Due</p>
                          <p className="text-xs text-gold-700">You have {userPersonalStats.pendingPayments} pending payment(s)</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3 p-3 bg-aqua-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-aqua-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-aqua-800">Service Goal Progress</p>
                        <p className="text-xs text-aqua-700">78% complete for monthly service hours goal</p>
                      </div>
                    </div>

                    {userPersonalStats.overduePayments === 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">All Caught Up!</p>
                          <p className="text-xs text-green-700">No overdue payments or requirements</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Admin/Officer alerts
                  <>
                    <div className="flex items-start space-x-3 p-3 bg-gold-50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gold-800">Dues Reminder</p>
                        <p className="text-xs text-gold-700">23 members have outstanding dues payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-aqua-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-aqua-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-aqua-800">Service Goal Progress</p>
                        <p className="text-xs text-aqua-700">78% complete for monthly service hours goal</p>
                      </div>
                    </div>

                    {orgStats.pendingApprovals > 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Pending Approvals</p>
                          <p className="text-xs text-red-700">{orgStats.pendingApprovals} items need admin approval</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;