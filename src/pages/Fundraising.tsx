import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Handshake, 
  DollarSign, 
  Target, 
  Calendar, 
  Plus, 
  Award, 
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';
import { User } from '../App';

interface FundraisingProps {
  user: User;
  onLogout: () => void;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  type: 'chapter' | 'regional' | 'national' | 'scholarship';
  beneficiary: string;
}

interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

const Fundraising = ({ user, onLogout }: FundraisingProps) => {
  const [isNewCampaignDialogOpen, setIsNewCampaignDialogOpen] = useState(false);
  const [isLogDonationDialogOpen, setIsLogDonationDialogOpen] = useState(false);
  const [filterCampaignType, setFilterCampaignType] = useState('all');
  const [filterCampaignStatus, setFilterCampaignStatus] = useState('all');

  // Mock Fundraising Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Annual Philanthropy Gala',
      description: 'Our biggest event of the year to support local charities.',
      goal: 25000,
      raised: 18500,
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      status: 'active',
      type: 'chapter',
      beneficiary: 'Local Food Bank'
    },
    {
      id: '2',
      name: 'National Scholarship Fund',
      description: 'Supporting academic excellence across all chapters.',
      goal: 50000,
      raised: 42000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      type: 'national',
      beneficiary: 'Lambda Empire Scholarship'
    },
    {
      id: '3',
      name: 'Regional Leadership Conference',
      description: 'Fundraising for our annual regional leadership development event.',
      goal: 10000,
      raised: 11500,
      startDate: '2023-09-01',
      endDate: '2023-11-30',
      status: 'completed',
      type: 'regional',
      beneficiary: 'Regional Leadership Fund'
    },
    {
      id: '4',
      name: 'Chapter House Renovation',
      description: 'Help us renovate our beloved chapter house for future generations.',
      goal: 15000,
      raised: 5000,
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      status: 'upcoming',
      type: 'chapter',
      beneficiary: 'Chapter House Fund'
    }
  ]);

  // Mock Donations
  const [donations, setDonations] = useState<Donation[]>([
    { id: 'd1', campaignId: '1', donorName: 'Alumni Association', amount: 5000, date: '2024-04-10', method: 'Bank Transfer' },
    { id: 'd2', campaignId: '1', donorName: 'John Doe', amount: 100, date: '2024-04-12', method: 'Credit Card' },
    { id: 'd3', campaignId: '2', donorName: 'Jane Smith', amount: 250, date: '2024-03-05', method: 'Credit Card' },
    { id: 'd4', campaignId: '3', donorName: 'Regional Council', amount: 2000, date: '2023-10-20', method: 'Check' }
  ]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesType = filterCampaignType === 'all' || campaign.type === filterCampaignType;
    const matchesStatus = filterCampaignStatus === 'all' || campaign.status === filterCampaignStatus;
    return matchesType && matchesStatus;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create new campaign
    setIsNewCampaignDialogOpen(false);
  };

  const handleLogDonation = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to log new donation
    setIsLogDonationDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'green';
      case 'upcoming': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chapter': return 'blue';
      case 'regional': return 'purple';
      case 'national': return 'destructive';
      case 'scholarship': return 'amber';
      default: return 'outline';
    }
  };

  // Calculate overall statistics
  const totalRaisedAcrossAllCampaigns = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  const totalGoalAcrossAllCampaigns = campaigns.reduce((sum, campaign) => sum + campaign.goal, 0);
  const overallProgress = totalGoalAcrossAllCampaigns > 0 ? (totalRaisedAcrossAllCampaigns / totalGoalAcrossAllCampaigns) * 100 : 0;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fundraising</h1>
            <p className="text-gray-600">Manage campaigns and track donations for all tiers</p>
          </div>
          {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
            <div className="flex gap-2">
              <Dialog open={isNewCampaignDialogOpen} onOpenChange={setIsNewCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Set up a new fundraising initiative.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaignName">Campaign Name</Label>
                      <Input id="campaignName" placeholder="e.g., Annual Philanthropy Gala" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaignGoal">Goal ($)</Label>
                      <Input id="campaignGoal" type="number" min="0" step="1" placeholder="10000" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaignType">Campaign Type</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chapter">Chapter</SelectItem>
                          <SelectItem value="regional">Regional</SelectItem>
                          <SelectItem value="national">National</SelectItem>
                          <SelectItem value="scholarship">Scholarship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="beneficiary">Beneficiary</Label>
                      <Input id="beneficiary" placeholder="e.g., Local Food Bank" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaignDescription">Description</Label>
                      <Textarea 
                        id="campaignDescription" 
                        placeholder="Describe your campaign..."
                        rows={3}
                        required 
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsNewCampaignDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Campaign</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isLogDonationDialogOpen} onOpenChange={setIsLogDonationDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Log Donation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Log New Donation</DialogTitle>
                    <DialogDescription>
                      Record a donation received for a campaign.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogDonation} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="donationCampaign">Campaign</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          {campaigns.map(campaign => (
                            <SelectItem key={campaign.id} value={campaign.id}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donorName">Donor Name</Label>
                      <Input id="donorName" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donationAmount">Amount ($)</Label>
                      <Input id="donationAmount" type="number" min="0" step="0.01" placeholder="50.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donationDate">Date</Label>
                      <Input id="donationDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donationNotes">Notes (Optional)</Label>
                      <Textarea id="donationNotes" placeholder="Any specific notes about this donation..." rows={2} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsLogDonationDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Log Donation</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRaisedAcrossAllCampaigns.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Goal</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalGoalAcrossAllCampaigns.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Combined target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {totalGoalAcrossAllCampaigns - totalRaisedAcrossAllCampaigns > 0 
                  ? `$${(totalGoalAcrossAllCampaigns - totalRaisedAcrossAllCampaigns).toLocaleString()} to go`
                  : 'Goal achieved!'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterCampaignType} onValueChange={setFilterCampaignType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="chapter">Chapter</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCampaignStatus} onValueChange={setFilterCampaignStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fundraising Campaigns List */}
        <Card>
          <CardHeader>
            <CardTitle>Fundraising Campaigns</CardTitle>
            <CardDescription>Overview of all active, completed, and upcoming campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant={getTypeColor(campaign.type)}>{campaign.type}</Badge>
                          <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                        <span>Beneficiary: {campaign.beneficiary}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-semibold text-green-600">
                        ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                      </span>
                      <Progress value={(campaign.raised / campaign.goal) * 100} className="w-24 h-2" />
                      {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="mr-1 h-4 w-4" />
                            Report
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <Handshake className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No fundraising campaigns found matching your criteria.</p>
                <p className="text-sm text-gray-400">Try creating a new campaign!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest contributions to all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{donation.donorName}</p>
                    <p className="text-sm text-gray-600">
                      Donated to: {campaigns.find(c => c.id === donation.campaignId)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">${donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            {donations.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No donations recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Fundraising;