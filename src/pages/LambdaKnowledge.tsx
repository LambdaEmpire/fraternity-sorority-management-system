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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Search, BookOpen, Video, FileText, Plus, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { User } from '../App';

interface LambdaKnowledgeProps {
  user: User;
  onLogout: () => void;
}

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'document';
  category: string;
  isRequired: boolean;
  dueDate?: string;
  estimatedTime: string;
  content: string;
  videoUrl?: string;
  documentUrl?: string;
  completedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProgress {
  itemId: string;
  completedAt: string;
  timeSpent: number;
}

const LambdaKnowledge = ({ user, onLogout }: LambdaKnowledgeProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRequired, setFilterRequired] = useState('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'article' as 'article' | 'video' | 'document',
    category: '',
    isRequired: false,
    dueDate: '',
    estimatedTime: '',
    content: '',
    videoUrl: '',
    documentUrl: ''
  });

  // Mock knowledge items data
  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'Lambda Empire History & Values',
      description: 'Essential reading about our organization\'s founding principles and core values',
      type: 'article',
      category: 'Foundation',
      isRequired: true,
      dueDate: '2024-04-30',
      estimatedTime: '15 minutes',
      content: 'Lambda Empire was founded on the principles of brotherhood, scholarship, and service...',
      completedBy: ['LEM-2021-001', 'LEM-2022-015'],
      createdBy: 'National HQ',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: '2',
      title: 'Leadership Development Workshop',
      description: 'Interactive video series on developing leadership skills within the organization',
      type: 'video',
      category: 'Leadership',
      isRequired: false,
      estimatedTime: '45 minutes',
      content: 'This comprehensive video series covers essential leadership concepts...',
      videoUrl: 'https://example.com/leadership-workshop',
      completedBy: ['LEM-2021-001'],
      createdBy: 'Regional Officer',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-15'
    },
    {
      id: '3',
      title: 'Financial Responsibility Training',
      description: 'Mandatory training on handling chapter finances and dues management',
      type: 'document',
      category: 'Finance',
      isRequired: true,
      dueDate: '2024-05-15',
      estimatedTime: '30 minutes',
      content: 'Understanding financial responsibility is crucial for all members...',
      documentUrl: '/documents/financial-training.pdf',
      completedBy: ['LEM-2021-008'],
      createdBy: 'Admin',
      createdAt: '2024-02-20',
      updatedAt: '2024-03-01'
    },
    {
      id: '4',
      title: 'Community Service Guidelines',
      description: 'Best practices for organizing and participating in community service events',
      type: 'article',
      category: 'Service',
      isRequired: false,
      estimatedTime: '20 minutes',
      content: 'Community service is at the heart of our mission...',
      completedBy: ['LEM-2021-001', 'LEM-2022-015', 'LEM-2022-023'],
      createdBy: 'Chapter Officer',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01'
    },
    {
      id: '5',
      title: 'New Member Orientation',
      description: 'Complete orientation program for new members joining Lambda Empire',
      type: 'video',
      category: 'Orientation',
      isRequired: true,
      dueDate: '2024-04-01',
      estimatedTime: '60 minutes',
      content: 'Welcome to Lambda Empire! This orientation will guide you through...',
      videoUrl: 'https://example.com/new-member-orientation',
      completedBy: ['LEM-2023-032'],
      createdBy: 'National HQ',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    }
  ];

  // Mock user progress
  const userProgress: UserProgress[] = [
    { itemId: '1', completedAt: '2024-03-10', timeSpent: 18 },
    { itemId: '4', completedAt: '2024-03-15', timeSpent: 22 }
  ];

  const categories = Array.from(new Set(knowledgeItems.map(item => item.category)));

  const isCompleted = (itemId: string) => {
    return userProgress.some(progress => progress.itemId === itemId);
  };

  const isOverdue = (item: KnowledgeItem) => {
    if (!item.dueDate || !item.isRequired) return false;
    return new Date(item.dueDate) < new Date() && !isCompleted(item.id);
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesRequired = filterRequired === 'all' || 
                           (filterRequired === 'required' && item.isRequired) ||
                           (filterRequired === 'optional' && !item.isRequired);

    return matchesSearch && matchesCategory && matchesType && matchesRequired;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <BookOpen className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (item: KnowledgeItem) => {
    if (isCompleted(item.id)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (isOverdue(item)) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (item.isRequired) {
      return <Clock className="h-5 w-5 text-amber-500" />;
    }
    return null;
  };

  const handleAddItem = () => {
    // In a real app, this would make an API call
    console.log('Adding new knowledge item:', newItem);
    setIsAddingItem(false);
    setNewItem({
      title: '',
      description: '',
      type: 'article',
      category: '',
      isRequired: false,
      dueDate: '',
      estimatedTime: '',
      content: '',
      videoUrl: '',
      documentUrl: ''
    });
  };

  // Calculate overall progress
  const requiredItems = knowledgeItems.filter(item => item.isRequired);
  const completedRequired = requiredItems.filter(item => isCompleted(item.id));
  const overallProgress = requiredItems.length > 0 ? (completedRequired.length / requiredItems.length) * 100 : 0;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">Λ</span>
              Lambda Knowledge
            </h1>
            <p className="text-gray-600">Learn, grow, and excel in Lambda Empire</p>
          </div>
          {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter' || user.role === 'officer') && (
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Knowledge Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      placeholder="Enter title"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Enter description"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newItem.type} onValueChange={(value: any) => setNewItem({...newItem, type: value})}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        placeholder="Enter category"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newItem.isRequired}
                      onCheckedChange={(checked) => setNewItem({...newItem, isRequired: checked})}
                    />
                    <Label>Required for all members</Label>
                  </div>
                  {newItem.isRequired && (
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newItem.dueDate}
                        onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <div>
                    <Label>Estimated Time</Label>
                    <Input
                      value={newItem.estimatedTime}
                      onChange={(e) => setNewItem({...newItem, estimatedTime: e.target.value})}
                      placeholder="e.g., 30 minutes"
                      className="rounded-lg"
                    />
                  </div>
                  <Button onClick={handleAddItem} className="w-full rounded-lg">
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Progress Overview */}
        <Card className="rounded-xl card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Required Training Completion</span>
                  <span className="text-sm text-gray-600">{completedRequired.length} of {requiredItems.length}</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedRequired.length}</div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{requiredItems.length - completedRequired.length}</div>
                  <div className="text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{requiredItems.filter(item => isOverdue(item)).length}</div>
                  <div className="text-gray-600">Overdue</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="rounded-xl card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search knowledge base..."
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-32 rounded-lg">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRequired} onValueChange={setFilterRequired}>
                <SelectTrigger className="w-full sm:w-32 rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="rounded-xl card-shadow card-hover-effect">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="text-aqua-600 mt-0.5">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{item.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusIcon(item)}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="rounded-md text-xs">{item.category}</Badge>
                  <Badge variant="outline" className="rounded-md text-xs">{item.type}</Badge>
                  {item.isRequired && (
                    <Badge variant="destructive" className="rounded-md text-xs">Required</Badge>
                  )}
                  {isCompleted(item.id) && (
                    <Badge variant="default" className="rounded-md text-xs bg-green-600">Completed</Badge>
                  )}
                  {isOverdue(item) && (
                    <Badge variant="destructive" className="rounded-md text-xs">Overdue</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>⏱️ {item.estimatedTime}</span>
                  {item.dueDate && (
                    <span>📅 Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  <span>{item.completedBy.length} members completed</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg transition-all duration-300 hover:scale-[1.01]"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      {isCompleted(item.id) ? 'Review' : 'Start Learning'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getItemIcon(item.type)}
                        {item.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant="outline">{item.type}</Badge>
                        {item.isRequired && <Badge variant="destructive">Required</Badge>}
                        <Badge variant="outline">⏱️ {item.estimatedTime}</Badge>
                      </div>
                      <p className="text-gray-700">{item.description}</p>
                      <div className="prose max-w-none">
                        {item.type === 'video' && item.videoUrl && (
                          <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <Video className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Video content would be embedded here</p>
                            <p className="text-xs text-gray-500">URL: {item.videoUrl}</p>
                          </div>
                        )}
                        {item.type === 'document' && item.documentUrl && (
                          <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Document viewer would be embedded here</p>
                            <p className="text-xs text-gray-500">URL: {item.documentUrl}</p>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{item.content}</div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">
                          Created by {item.createdBy} on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        {!isCompleted(item.id) && (
                          <Button className="w-full mt-3 rounded-lg">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="rounded-xl card-shadow">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No knowledge items found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default LambdaKnowledge;