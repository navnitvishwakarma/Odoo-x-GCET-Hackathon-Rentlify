import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useApp, UserRole } from '@/app/context/app-context';
import { User, Store, Shield } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && selectedRole) {
      login(email, password, selectedRole);
      // Navigate based on role
      if (selectedRole === 'admin') {
        onNavigate('admin-dashboard');
      } else if (selectedRole === 'vendor') {
        onNavigate('vendor-dashboard');
      } else {
        onNavigate('home');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center">
              <span className="text-2xl">R</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Select Your Role</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === 'customer' ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedRole('customer')}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs">Customer</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'vendor' ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedRole('vendor')}
                >
                  <Store className="w-5 h-5 mb-1" />
                  <span className="text-xs">Vendor</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'admin' ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedRole('admin')}
                >
                  <Shield className="w-5 h-5 mb-1" />
                  <span className="text-xs">Admin</span>
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
