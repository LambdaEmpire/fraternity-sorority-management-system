import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, DollarSign, Target, TrendingUp, Plus, Users, Award, Calendar } from 'lucide-react';
import { User } from '../App';

interface FundraisingProps {
  user: User;
  onLogout: () => void;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'scholarship' | 'charity' | 'event';
  goalAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  organizer: string;
  participants: string[];
  region?: string;
  chapter?: string;
  donationCount: number;
}

interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  requirements: string[];
  applicants: number;
  awarded: boolean;
  recipient?: string;
  fundedBy: string;
  category: 'academic' | 'service' | 'leadership' | 'need-based';
}

interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  donatedAt: string;
  memberId?: string;
}

const Fundraising = ({ user, onLogout }: FundraisingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [isAddingScholarship, setIsAddingScholarship] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    category: 'general' as 'general' | 'scholarship' | 'charity' | 'event',
    goalAmount: 0,
    endDate: '',
  });
  const [newScholarship, setNewScholarship] = useState({
    name: '',
    description: '',
    amount: 0,
    deadline: '',
    requirements: '',
    category: 'academic' as 'academic' | 'service' | 'leadership' | 'need-based'
  });

  // Mock campaigns data
  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Lambda Empire Scholarship Fund',
      description: 'Supporting academic excellence among our members through merit-based scholarships',
      category: 'scholarship',
      goalAmount: 25000,
      raisedAmount: 18750,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      organizer: 'National HQ',
      participants: ['LEM-2021-001', 'LEM-2022-015', 'LEM-2021-008'],
      donationCount: 47
    },
    {
      id: '2',
      title: 'Community Food Drive Initiative',
      description: 'Raising funds to purchase food supplies for local food banks during the holiday season',
      category: 'charity',
      goalAmount: 5000,
      raisedAmount: 5000,
      startDate: '2024-02-01',
      endDate: '2024-03-31',
      status: 'completed',
      organizer: 'Southeast Region',
      participants: ['LEM-2022-015', 'LEM-2023-032'],
      region: 'Southeast Region',
      donationCount: 23
    },
    {
      id: '3',
      title: 'National Convention 2024',
      description: 'Fundraising to support travel and accommodation for members attending the national convention',
      category: 'event',
      goalAmount: 15000,
      raisedAmount: 8200,
      startDate: '2024-03-01',
      endDate: '2024-07-15',
      status: 'active',
      organizer: 'Regional Officer',
      participants: ['LEM-2021-001', 'LEM-2022-023', 'LEM-2021-008'],
      donationCount: 31
    },
    {
      id: '4',
      title: 'Chapter House Renovation',
      description: 'Funding renovations and improvements to our chapter house facilities',
      category: 'general',
      goalAmount: 40000,
      raisedAmount: 12300,
      startDate: '2024-02-15',
      endDate: '2024-12-31',
      status: 'active',
      organizer: 'Beta Chapter',
      participants: ['LEM-2021-001', 'LEM-2022-015'],
      chapter: 'Beta Chapter',
      donationCount: 19
    }
  ];

  // Mock scholarships data
  const scholarships: Scholarship[] = [
    {
      id: '1',
      name: 'Excellence in Leadership Award',
      description: 'Recognizing outstanding leadership contributions within Lambda Empire',
      amount: 2500,
      deadline: '2024-05-31',
      requirements: ['Minimum 3.5 GPA', 'Leadership role in organization', 'Community service hours'],
      applicants: 12,
      awarded: false,
      fundedBy: 'Alumni Association',
      category: 'leadership'
    },
    {
      id: '2',
      name: 'Academic Achievement Scholarship',
      description: 'Supporting members who demonstrate exceptional academic performance',
      amount: 3000,
      deadline: '2024-06-15',
      requirements: ['Minimum 3.8 GPA', 'Full-time student status', 'Financial need documentation'],
      applicants: 8,
      awarded: true,
      recipient: 'Sarah Johnson (LEM-2021-001)',
      fundedBy: 'Lambda Empire Foundation',
      category: 'academic'
    },
    {
      id: '3',
      name: 'Community Service Excellence',
      description: 'Honoring members who go above and beyond in community service',
      amount: 1500,
      deadline: '2024-04-30',
      requirements: ['50+ community service hours', 'Service project leadership', 'Impact documentation'],
      applicants: 15,
      awarded: false,
      fundedBy: 'National HQ',
      category: 'service'
    },
    {
      id: '4',
      name: 'Emergency Financial Assistance',
      description: 'Providing support to members facing unexpected financial hardships',
      amount: 1000,
      deadline: '2024-12-31',
      requirements: ['Demonstrated financial need', 'Active member status', 'Academic progress'],
      applicants: 3,
      awarded: false,
      fundedBy: 'Member Donations',
      category: 'need-based'
    }
  ];

  // Mock donations data (recent donations)
  const recentDonations: Donation[] = [
    {
      id: '1',
      campaignId: '1',
      donorName: 'Anonymous',
      amount: 500,
      message: 'Supporting our future leaders!',
      isAnonymous: true,
      donatedAt: '2024-03-20',
      memberId: 'LEM-2021-001'
    },
    {
      id: '2',
      campaignId: '2',
      donorName: 'Emma Wilson',
      amount: 250,
      message: 'Great cause for the community!',
      isAnonymous: false,
      donatedAt: '2024-03-19',
      memberId: 'LEM-2022-015'
    },
    {
      id: '3',
      campaignId: '3',
      donorName: 'Alumni Supporter',
      amount: 1000,
      isAnonymous: false,
      donatedAt: '2024-03-18'
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || campaign.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;

    // Role-based filtering
    if (user.role === 'regional' && user.region && campaign.region && campaign.region !== user.region) {
      return false;
    }
    if (user.role === 'chapter' && user.chapter && campaign.chapter && campaign.chapter !== user.chapter) {
      return false;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scholarship': return 'default';
      case 'charity': return 'secondary';
      case 'event': return 'outline';
      case 'general': return 'outline';
      default: return 'outline';
    }
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalDonations = campaigns.reduce((sum, campaign) => sum + campaign.donationCount, 0);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-aqua-600" />
              Fundraising & Scholarships
            </h1>
            <p className="text-gray-600">Manage campaigns and support Lambda Empire initiatives</p>
          </div>
          {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter' || user.role === 'officer') && (
            <div className="flex gap-2">
              <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Campaign Title</Label>
                      <Input
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                        placeholder="Enter campaign title"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                        placeholder="Describe your campaign"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select value={newCampaign.category} onValueChange={(value: any) => setNewCampaign({...newCampaign, category: value})}>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="scholarship">Scholarship</SelectItem>
                            <SelectItem value="charity">Charity</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Goal Amount ($)</Label>
                        <Input
                          type="number"
                          value={newCampaign.goalAmount || ''}
                          onChange={(e) => setNewCampaign({...newCampaign, goalAmount: parseInt(e.target.value) || 0})}
                          placeholder="0"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newCampaign.endDate}
                        onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                        className="rounded-lg"
                      />
                    </div>
                    <Button onClick={() => setIsAddingCampaign(false)} className="w-full rounded-lg">
                      Create Campaign
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isAddingScholarship} onOpenChange={setIsAddingScholarship}>
                <DialogTrigger asChild>
                  <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                    <Award className="mr-2 h-4 w-4" />
                    New Scholarship
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Scholarship</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Scholarship Name</Label>
                      <Input
                        value={newScholarship.name}
                        onChange={(e) => setNewScholarship({...newScholarship, name: e.target.value})}
                        placeholder="Enter scholarship name"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newScholarship.description}
                        onChange={(e) => setNewScholarship({...newScholarship, description: e.target.value})}
                        placeholder="Describe the scholarship"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Amount ($)</Label>
                        <Input
                          type="number"
                          value={newScholarship.amount || ''}
                          onChange={(e) => setNewScholarship({...newScholarship, amount: parseInt(e.target.value) || 0})}
                          placeholder="0"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={newScholarship.deadline}
                          onChange={(e) => setNewScholarship({...newScholarship, deadline: e.target.value})}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={newScholarship.category} onValueChange={(value: any) => setNewScholarship({...newScholarship, category: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="need-based">Need-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Requirements (one per line)</Label>
                      <Textarea
                        value={newScholarship.requirements}
                        onChange={(e) => setNewScholarship({...newScholarship, requirements: e.target.value})}
                        placeholder="List requirements, one per line"
                        className="rounded-lg"
                        rows={4}
                      />
                    </div>
                    <Button onClick={() => setIsAddingScholarship(false)} className="w-full rounded-lg">
                      Create Scholarship
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">${totalRaised.toLocaleString()}</div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-aqua-600">{activeCampaigns}</div>
                <Target className="h-5 w-5 text-aqua-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gold-600">{totalDonations}</div>
                <Users className="h-5 w-5 text-gold-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-lg">
            <TabsTrigger value="campaigns" className="rounded-md">Campaigns</TabsTrigger>
            <TabsTrigger value="scholarships" className="rounded-md">Scholarships</TabsTrigger>
            <TabsTrigger value="donations" className="rounded-md">Recent Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Filters */}
            <Card className="rounded-xl card-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-lg"
                      />
                    </div>
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40 rounded-lg">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32 rounded-lg">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="rounded-xl card-shadow card-hover-effect">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight line-clamp-2">{campaign.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{campaign.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant={getCategoryColor(campaign.category)} className="rounded-md text-xs">{campaign.category}</Badge>
                      <Badge variant={getStatusColor(campaign.status)} className="rounded-md text-xs">{campaign.status}</Badge>
                      {campaign.region && <Badge variant="outline" className="rounded-md text-xs">{campaign.region}</Badge>}
                      {campaign.chapter && <Badge variant="outline" className="rounded-md text-xs">{campaign.chapter}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          ${campaign.raisedAmount.toLocaleString()} / ${campaign.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(campaign.raisedAmount, campaign.goalAmount)} className="h-2" />
                      <div className="text-xs text-gray-600 text-center">
                        {getProgressPercentage(campaign.raisedAmount, campaign.goalAmount).toFixed(1)}% of goal reached
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Donations</p>
                        <p className="font-medium">{campaign.donationCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p className="font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-500">Organized by</p>
                      <p className="font-medium">{campaign.organizer}</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg transition-all duration-300 hover:scale-[1.01]"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <DollarSign className="mr-2 h-3 w-3" />
                      {campaign.status === 'active' ? 'Donate' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scholarships" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="rounded-xl card-shadow card-hover-effect">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight flex items-center gap-2">
                          <Award className="h-5 w-5 text-gold-600" />
                          {scholarship.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">{scholarship.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="default" className="rounded-md text-xs">{scholarship.category}</Badge>
                      <Badge variant="outline" className="rounded-md text-xs">${scholarship.amount}</Badge>
                      {scholarship.awarded && (
                        <Badge variant="secondary" className="rounded-md text-xs bg-green-600">Awarded</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Deadline</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Applicants</p>
                        <p className="font-medium">{scholarship.applicants}</p>
                      </div>
                    </div>

                    {scholarship.awarded && scholarship.recipient && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Awarded to:</strong> {scholarship.recipient}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Requirements:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {scholarship.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-aqua-600">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-500">Funded by</p>
                      <p className="font-medium">{scholarship.fundedBy}</p>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg transition-all duration-300 hover:scale-[1.01]"
                      disabled={scholarship.awarded}
                    >
                      {scholarship.awarded ? 'Application Closed' : 'Apply Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <Card className="rounded-xl card-shadow">
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest contributions to our campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDonations.map((donation) => {
                    const campaign = campaigns.find(c => c.id === donation.campaignId);
                    return (
                      <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="bg-aqua-100 p-2 rounded-lg">
                            <DollarSign className="h-4 w-4 text-aqua-600" />
                          </div>
                          <div>
                            <p className="font-medium">{donation.donorName}</p>
                            <p className="text-sm text-gray-600">{campaign?.title}</p>
                            {donation.message && (
                              <p className="text-xs text-gray-500 italic">"{donation.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${donation.amount}</p>
                          <p className="text-xs text-gray-500">{new Date(donation.donatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredCampaigns.length === 0 && (
          <Card className="rounded-xl card-shadow">
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No campaigns found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Fundraising;