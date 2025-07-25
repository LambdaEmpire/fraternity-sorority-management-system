import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Plus, 
  Download,
  Edit
} from 'lucide-react';
import { User } from '../App';

interface EventTicketingProps {
  user: User;
  onLogout: () => void;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  ticketsAvailable: number;
  ticketsSold: number;
  status: 'upcoming' | 'sold-out' | 'past';
  type: 'conference' | 'social' | 'philanthropy';
  organizer: string;
}

interface TicketPurchase {
  id: string;
  eventId: string;
  purchaserName: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const EventTicketing = ({ user, onLogout }: EventTicketingProps) => {
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [isPurchaseTicketDialogOpen, setIsPurchaseTicketDialogOpen] = useState(false);
  const [filterEventType, setFilterEventType] = useState('all');
  const [filterEventStatus, setFilterEventStatus] = useState('all');

  // Mock Events
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Annual Leadership Conference',
      description: 'A multi-day conference for chapter and regional leaders.',
      date: '2024-08-10',
      time: '09:00 AM',
      location: 'Grand Convention Center',
      price: 150,
      ticketsAvailable: 200,
      ticketsSold: 120,
      status: 'upcoming',
      type: 'conference',
      organizer: 'National Headquarters'
    },
    {
      id: '2',
      name: 'Spring Formal',
      description: 'Our annual formal event for members and their guests.',
      date: '2024-05-20',
      time: '07:00 PM',
      location: 'The Ballroom at University Club',
      price: 75,
      ticketsAvailable: 100,
      ticketsSold: 95,
      status: 'upcoming',
      type: 'social',
      organizer: 'Chapter Social Committee'
    },
    {
      id: '3',
      name: 'Philanthropy Gala Dinner',
      description: 'A charity dinner to raise funds for our national philanthropy.',
      date: '2024-04-15',
      time: '06:30 PM',
      location: 'City Grand Hotel',
      price: 100,
      ticketsAvailable: 50,
      ticketsSold: 50,
      status: 'sold-out',
      type: 'philanthropy',
      organizer: 'Chapter Philanthropy Chair'
    },
    {
      id: '4',
      name: 'Regional Officer Training',
      description: 'Training session for new regional officers.',
      date: '2023-10-05',
      time: '09:00 AM',
      location: 'Regional HQ Office',
      price: 0,
      ticketsAvailable: 30,
      ticketsSold: 30,
      status: 'past',
      type: 'conference',
      organizer: 'Regional Director'
    }
  ]);

  // Mock Ticket Purchases
  const [ticketPurchases, setTicketPurchases] = useState<TicketPurchase[]>([
    { id: 'tp1', eventId: '1', purchaserName: 'Sarah Johnson', quantity: 1, totalPrice: 150, purchaseDate: '2024-03-01', status: 'confirmed' },
    { id: 'tp2', eventId: '1', purchaserName: 'Emma Wilson', quantity: 1, totalPrice: 150, purchaseDate: '2024-03-05', status: 'confirmed' },
    { id: 'tp3', eventId: '2', purchaserName: 'Jessica Chen', quantity: 2, totalPrice: 150, purchaseDate: '2024-04-01', status: 'confirmed' },
    { id: 'tp4', eventId: '3', purchaserName: 'Madison Taylor', quantity: 1, totalPrice: 100, purchaseDate: '2024-03-10', status: 'confirmed' }
  ]);

  const filteredEvents = events.filter(event => {
    const matchesType = filterEventType === 'all' || event.type === filterEventType;
    const matchesStatus = filterEventStatus === 'all' || event.status === filterEventStatus;
    return matchesType && matchesStatus;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create new event
    setIsNewEventDialogOpen(false);
  };

  const handlePurchaseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to purchase ticket
    setIsPurchaseTicketDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'default';
      case 'sold-out': return 'destructive';
      case 'past': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'blue';
      case 'social': return 'purple';
      case 'philanthropy': return 'green';
      default: return 'outline';
    }
  };

  // Calculate overall statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalTicketsSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.ticketsSold * event.price), 0);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Ticketing</h1>
            <p className="text-gray-600">Manage event tickets and registrations for conferences and more</p>
          </div>
          {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
            <div className="flex gap-2">
              <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Set up a new event for ticketing.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input id="eventName" placeholder="e.g., Annual Leadership Conference" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="philanthropy">Philanthropy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Date</Label>
                        <Input id="eventDate" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventTime">Time</Label>
                        <Input id="eventTime" type="time" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input id="eventLocation" placeholder="e.g., Grand Convention Center" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                        <Input id="ticketPrice" type="number" min="0" step="0.01" placeholder="50.00" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ticketsAvailable">Tickets Available</Label>
                        <Input id="ticketsAvailable" type="number" min="1" step="1" placeholder="100" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDescription">Description</Label>
                      <Textarea 
                        id="eventDescription" 
                        placeholder="Describe your event..."
                        rows={3}
                        required 
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsNewEventDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Event</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isPurchaseTicketDialogOpen} onOpenChange={setIsPurchaseTicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Ticket className="mr-2 h-4 w-4" />
                    Purchase Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Purchase Ticket</DialogTitle>
                    <DialogDescription>
                      Select an event and purchase tickets.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePurchaseTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseEvent">Event</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.filter(e => e.status === 'upcoming' && e.ticketsAvailable > e.ticketsSold).map(event => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name} ({event.ticketsAvailable - event.ticketsSold} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchaserName">Your Name</Label>
                      <Input id="purchaserName" placeholder="e.g., John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticketQuantity">Quantity</Label>
                      <Input id="ticketQuantity" type="number" min="1" step="1" placeholder="1" required />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsPurchaseTicketDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Confirm Purchase</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">Managed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Ticket className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Ready for registration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTicketsSold}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From ticket sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Event Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterEventType} onValueChange={setFilterEventType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="philanthropy">Philanthropy</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEventStatus} onValueChange={setFilterEventStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="sold-out">Sold Out</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>Browse and manage all chapter, regional, and national events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium">{event.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant={getTypeColor(event.type)}>{event.type}</Badge>
                          <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </span>
                        <span>Organizer: {event.organizer}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-semibold text-blue-600">
                        ${event.price}
                      </span>
                      <span className="text-sm text-gray-600">
                        {event.ticketsSold} / {event.ticketsAvailable} tickets sold
                      </span>
                      {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="mr-1 h-4 w-4" />
                            Attendees
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                      {user.role === 'member' && event.status === 'upcoming' && event.ticketsAvailable > event.ticketsSold && (
                        <Button size="sm">
                          Buy Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No events found matching your criteria.</p>
                <p className="text-sm text-gray-400">Check back later for new events!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventTicketing;