import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  UserCheck,
  Shield,
  BookOpen,
  Handshake,
  Ticket,
  Type
} from 'lucide-react';
import { User } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout = ({ children, user, onLogout }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Dues Tracking', href: '/dues', icon: DollarSign },
    { name: 'Service Hours', href: '/service', icon: Clock },
    { name: 'Communications', href: '/communications', icon: MessageSquare },
    ...(user.role === 'admin' || user.role === 'national_hq' 
      ? [
          { name: 'Admin Approvals', href: '/admin', icon: UserCheck },
          { name: 'Access Control', href: '/admin-dashboard', icon: Shield },
          { name: 'Title Management', href: '/title-management', icon: Type } // New link
        ] 
      : []),
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'national_hq': return 'default';
      case 'regional': return 'aqua-600'; // Using custom aqua
      case 'chapter': return 'gold-500'; // Using custom gold
      case 'officer': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg rounded-r-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Λ</h1> {/* Capital Lambda Logo */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-aqua-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant={getRoleBadgeColor(user.role)} className="rounded-md">
              {user.role.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          {user.chapter && (
            <p className="text-xs text-gray-600 mt-2">{user.chapter}</p>
          )}
          {user.region && (
            <p className="text-xs text-gray-600 mt-2">{user.region}</p>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-aqua-100 text-aqua-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-[1.01]"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;