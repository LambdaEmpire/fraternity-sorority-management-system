import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Search, BookOpen, ChevronRight, FileText, Video, Link as LinkIcon, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '../App';

interface KnowledgeBaseProps {
  user: User;
  onLogout: () => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  type: 'document' | 'video' | 'link';
  content: string;
  url?: string;
  required?: boolean; // New field for requirement
  completedBy?: string[]; // To track who completed it
}

const KnowledgeBase = ({ user, onLogout }: KnowledgeBaseProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isNewArticleDialogOpen, setIsNewArticleDialogOpen] = useState(false);

  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Chapter Meeting Best Practices',
      category: 'Chapter Operations',
      type: 'document',
      content: 'Learn how to run effective and engaging chapter meetings, including agenda templates and parliamentary procedure basics.',
      required: true,
      completedBy: ['Jessica Chen']
    },
    {
      id: '2',
      title: 'Understanding Your Dues Breakdown',
      category: 'Financial Management',
      type: 'document',
      content: 'A detailed explanation of where your quarterly dues go, including chapter expenses, national fees, and philanthropy contributions.',
      required: false,
      completedBy: []
    },
    {
      id: '3',
      title: 'Service Hours Reporting Guide',
      category: 'Member Responsibilities',
      type: 'video',
      content: 'Watch this video tutorial on how to properly log and report your service hours through the portal.',
      url: 'https://www.youtube.com/watch?v=example1',
      required: true,
      completedBy: []
    },
    {
      id: '4',
      title: 'Recruitment Strategies for Success',
      category: 'Recruitment',
      type: 'document',
      content: 'Explore proven strategies for attracting and recruiting new members, from social events to formal recruitment processes.',
      required: false,
      completedBy: []
    },
    {
      id: '5',
      title: 'National Headquarters Policies',
      category: 'National Policies',
      type: 'link',
      content: 'Link to the official National Headquarters policy manual for all members.',
      url: 'https://www.nationalhq.org/policies',
      required: true,
      completedBy: ['Sarah Johnson', 'Emma Wilson']
    },
    {
      id: '6',
      title: 'Leadership Development Program',
      category: 'Personal Growth',
      type: 'document',
      content: 'Details about the chapter\'s leadership development program, including workshops, mentorship opportunities, and leadership roles.',
      required: false,
      completedBy: []
    }
  ]);

  const categories = Array.from(new Set(articles.map(article => article.category)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'video': return Video;
      case 'link': return LinkIcon;
      default: return BookOpen;
    }
  };

  const handleMarkComplete = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, completedBy: [...(article.completedBy || []), user.name] }
        : article
    ));
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to create new article
    setIsNewArticleDialogOpen(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-gray-600">Find resources and guides to help you excel in the organization</p>
          </div>
          {(user.role === 'admin' || user.role === 'national_hq' || user.role === 'regional' || user.role === 'chapter') && (
            <Dialog open={isNewArticleDialogOpen} onOpenChange={setIsNewArticleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Article
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle>Add New Knowledge Base Article</DialogTitle>
                  <DialogDescription>
                    Create a new resource for members.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateArticle} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="articleTitle">Title</Label>
                    <Input id="articleTitle" placeholder="e.g., How to Log Service Hours" required className="rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="articleCategory">Category</Label>
                    <Select required>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="articleType">Type</Label>
                    <Select required>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="articleContent">Content/Description</Label>
                    <Textarea 
                      id="articleContent" 
                      placeholder="Provide a summary or full content..."
                      rows={4}
                      required 
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="articleUrl">URL (for video/link)</Label>
                    <Input id="articleUrl" placeholder="https://example.com/video" className="rounded-lg" />
                  </div>
                  {(user.role === 'admin' || user.role === 'national_hq') && (
                    <div className="flex items-center space-x-2">
                      <Switch id="required" />
                      <Label htmlFor="required">Required for Members</Label>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsNewArticleDialogOpen(false)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      Cancel
                    </Button>
                    <Button type="submit" className="rounded-lg transition-all duration-300 hover:scale-[1.01]">Add Article</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="rounded-xl card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles, guides, or videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>

        {/* Required Articles Section */}
        {user.role === 'member' && (
          <Card className="rounded-xl card-shadow">
            <CardHeader>
              <CardTitle>Required Readings/Viewings</CardTitle>
              <CardDescription>
                Important resources you need to complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.filter(a => a.required && !(a.completedBy || []).includes(user.name)).map(article => {
                  const Icon = getTypeIcon(article.type);
                  return (
                    <div key={article.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">{article.title}</p>
                          <p className="text-sm text-red-700">{article.category}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleMarkComplete(article.id)} className="rounded-lg transition-all duration-300 hover:scale-[1.01]">
                        Mark Complete
                      </Button>
                    </div>
                  );
                })}
                {articles.filter(a => a.required && !(a.completedBy || []).includes(user.name)).length === 0 && articles.filter(a => a.required).length > 0 && (
                  <div className="text-center py-4">
                    <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
                    <p className="text-gray-500">All required items completed!</p>
                  </div>
                )}
                {articles.filter(a => a.required).length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No required items currently.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const Icon = getTypeIcon(article.type);
            const isCompleted = (article.completedBy || []).includes(user.name);
            return (
              <Card key={article.id} className="rounded-xl card-shadow card-hover-effect">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-aqua-600" />
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{article.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-3">{article.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="link" className="px-0 rounded-lg transition-all duration-300 hover:scale-[1.01]">
                      {article.type === 'video' ? 'Watch Video' : article.type === 'link' ? 'Visit Link' : 'Read More'}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    {article.required && (
                      <Badge variant={isCompleted ? 'default' : 'destructive'} className="rounded-md">
                        {isCompleted ? 'Completed' : 'Required'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <Card className="rounded-xl card-shadow">
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No articles found matching your criteria.</p>
              <p className="text-sm text-gray-400">Try a different search or filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default KnowledgeBase;