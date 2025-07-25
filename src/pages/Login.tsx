import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock users for demonstration
  const mockUsers = [
    { id: '1', name: 'Sarah Johnson', email: 'admin@alphachi.org', role: 'admin' as const, chapter: 'Alpha Chi Omega - Beta Chapter' },
    { id: '2', name: 'Mike Thompson', email: 'officer@sigmachi.org', role: 'officer' as const, chapter: 'Sigma Chi - Gamma Chapter' },
    { id: '3', name: 'Emma Davis', email: 'member@kappa.org', role: 'member' as const, chapter: 'Kappa Kappa Gamma - Delta Chapter' },
    { id: '4', name: 'National Admin', email: 'national@headquarters.org', role: 'national_hq' as const, region: 'Southeast Region' },
    { id: '5', name: 'Regional Director', email: 'regional@hq.org', role: 'regional' as const, region: 'Midwest Region' },
    { id: '6', name: 'Chapter President', email: 'chapter@alpha.org', role: 'chapter' as const, chapter: 'Alpha Alpha Alpha' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - find user by email
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid credentials. Try one of the demo accounts.');
    }
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
              <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium">{user.email}</span>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'national_hq' ? 'default' : 'secondary'} className="rounded-md">
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;