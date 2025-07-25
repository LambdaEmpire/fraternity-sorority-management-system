import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Users, Bell, Mail, Calendar } from 'lucide-react';
import { User } from '../App';

interface CommunicationsProps {
  user: User;
  onLogout: () => void;
}

interface Message {
  id: string;
  title: string;
  content: string;
  sender: string;
  recipients: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  read: boolean;
}

const Communications = ({ user, onLogout }: CommunicationsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock messages data
  const messages: Message[] = [
    {
      id: '1',
      title: 'Chapter Meeting Reminder',
      content: 'Don\'t forget about our weekly chapter meeting this Sunday at 7 PM in the chapter house. We\'ll be discussing upcoming events and voting on new initiatives.',
      sender: 'Sarah Johnson',
      recipients: 'All Members',
      date: '2024-01-25',
      priority: 'high',
      category: 'Meeting',
      read: false
    },
    {
      id: '2',
      title: 'Dues Payment Deadline',
      content: 'Reminder that semester dues are due by February 1st. Please submit your payment through the member portal or contact the treasurer if you need to set up a payment plan.',
      sender: 'Madison Taylor',
      recipients: 'All Members',
      date: '2024-01-24',
      priority: 'high',
      category: 'Financial',
      read: true
    },
    {
      id: '3',
      title: 'Philanthropy Event Planning',
      content: 'We\'re organizing a charity run for next month! If you\'re interested in helping with planning or volunteering, please reply to this message.',
      sender: 'Emma Wilson',
      recipients: 'All Members',
      date: '2024-01-23',
      priority: 'medium',
      category: 'Event',
      read: true
    },
    {
      id: '4',
      title: 'New Member Orientation',
      content: 'Welcome to our new members! Orientation will be held this Saturday at 2 PM. Please bring your member handbook and be prepared for team-building activities.',
      sender: 'Olivia Martinez',
      recipients: 'New Members',
      date: '2024-01-22',
      priority: 'medium',
      category: 'Orientation',
      read: false
    },
    {
      id: '5',
      title: 'Social Media Guidelines Update',
      content: 'Please review the updated social media guidelines in your member portal. These changes are effective immediately and apply to all chapter-related posts.',
      sender: 'Sarah Johnson',
      recipients: 'All Members',
      date: '2024-01-21',
      priority: 'low',
      category: 'Policy',
      read: true
    }
  ];

  const categories = [
    'Meeting',
    'Financial',
    'Event',
    'Orientation',
    'Policy',
    'Social',
    'Academic'
  ];

  const filteredMessages = messages.filter(message => {
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    return matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsDialogOpen(false);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600">Chapter messages and announcements</p>
          </div>
          {(user.role === 'admin' || user.role === 'officer') && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-xl">
                <DialogHeader>
                  <DialogTitle>Send Message</DialogTitle>
                  <DialogDescription>
                    Send a message or announcement to chapter members.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Subject</Label>
                    <Input id="title" placeholder="Message subject" required className="rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipients">Recipients</Label>
                      <Select required>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="officers">Officers Only</SelectItem>
                          <SelectItem value="new-members">New Members</SelectItem>
                          <SelectItem value="seniors">Senior Members</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select required>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="content">Message</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Type your message here..."
                      rows={5}
                      required 
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Send Message</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <Bell className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? 'Require attention' : 'All caught up!'}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Mail className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(m => m.priority === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent items</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl card-shadow card-hover-effect">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">This week</p>
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
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-40 rounded-lg">
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

        {/* Messages List */}
        <Card className="rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Messages & Announcements</CardTitle>
            <CardDescription>
              Chapter communications and important updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                    !message.read ? 'border-aqua-200 bg-aqua-50' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className={`font-medium ${!message.read ? 'font-semibold' : ''}`}>
                          {message.title}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="rounded-md">{message.category}</Badge>
                          <Badge variant={getPriorityColor(message.priority)} className="rounded-md">
                            {message.priority}
                          </Badge>
                          {!message.read && (
                            <Badge variant="default" className="bg-aqua-600 rounded-md">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.content}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3 text-aqua-500" />
                          From: {message.sender}
                        </span>
                        <span className="flex items-center">
                          <Mail className="mr-1 h-3 w-3 text-aqua-500" />
                          To: {message.recipients}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-aqua-500" />
                          {new Date(message.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                        View Full
                      </Button>
                      {!message.read && (
                        <Button size="sm" variant="ghost" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No messages found.</p>
                <p className="text-sm text-gray-400">Check back later for updates!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Communications;