import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Shield, Users, Building, MapPin, UserCheck } from 'lucide-react';
import { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock users for demonstration with full details
  const mockUsers = [
    { 
      id: '1', 
      name: 'System Administrator', 
      email: 'admin@lambdaempire.org', 
      role: 'admin' as const, 
      chapter: 'Alpha Chi Omega - Beta Chapter',
      region: 'National',
      membershipId: 'LEM-ADM-001'
    },
    { 
      id: '2', 
      name: 'National Director', 
      email: 'national@lambdaempire.org', 
      role: 'national_hq' as const, 
      region: 'National HQ',
      membershipId: 'LEM-NAT-001'
    },
    { 
      id: '3', 
      name: 'Regional Coordinator', 
      email: 'regional@lambdaempire.org', 
      role: 'regional' as const, 
      region: 'Southeast Region',
      membershipId: 'LEM-REG-001'
    },
    { 
      id: '4', 
      name: 'Chapter President', 
      email: 'chapter@lambdaempire.org', 
      role: 'chapter' as const, 
      chapter: 'Alpha Alpha Alpha',
      region: 'Southeast Region',
      membershipId: 'LEM-CHP-001'
    },
    { 
      id: '5', 
      name: 'Chapter Officer', 
      email: 'officer@lambdaempire.org', 
      role: 'officer' as const, 
      chapter: 'Alpha Chi Omega - Beta Chapter',
      region: 'Southeast Region',
      membershipId: 'LEM-OFF-001'
    },
    { 
      id: '6', 
      name: 'Regular Member', 
      email: 'member@lambdaempire.org', 
      role: 'member' as const, 
      chapter: 'Kappa Kappa Gamma - Delta Chapter',
      region: 'Southeast Region',
      membershipId: 'LEM-MEM-001'
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'national_hq': return <Shield className="h-4 w-4" />;
      case 'regional': return <MapPin className="h-4 w-4" />;
      case 'chapter': return <Building className="h-4 w-4" />;
      case 'officer': return <UserCheck className="h-4 w-4" />;
      case 'member': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'national_hq': return 'default';
      case 'regional': return 'secondary';
      case 'chapter': return 'outline';
      case 'officer': return 'outline';
      case 'member': return 'outline';
      default: return 'outline';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - find user by email
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid credentials. Try one of the demo accounts below or use quick login.');
    }
  };

  const quickLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aqua-600 to-gold-500 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold mb-2">Λ</h1> {/* Capital Lambda Logo */}
          <p className="text-white/80">Lambda Empire Management System</p>
        </div>

        <Card className="shadow-2xl rounded-xl animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your chapter dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>
              <Button type="submit" className="w-full bg-aqua-600 hover:bg-aqua-700 text-white rounded-lg transition-all duration-300 hover:scale-[1.01]">
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick Login for Testing</p>
                <p className="text-xs text-gray-500">Click any role to login instantly</p>
              </div>
              
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    onClick={() => quickLogin(user)}
                    className="w-full justify-start text-left rounded-lg h-auto p-3 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-aqua-600">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge variant={getRoleColor(user.role)} className="rounded-md text-xs">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Admin:</strong> Full system access & management</p>
                <p><strong>National HQ:</strong> Multi-region oversight</p>
                <p><strong>Regional:</strong> Regional chapter management</p>
                <p><strong>Chapter:</strong> Single chapter leadership</p>
                <p><strong>Officer:</strong> Chapter administrative duties</p>
                <p><strong>Member:</strong> Basic member access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;