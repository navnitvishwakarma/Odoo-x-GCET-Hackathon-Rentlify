import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth, UserRole } from '@/context/AuthContext';
import { User, Store, Shield, CheckCircle2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && selectedRole) {
      login(email, password, selectedRole);
      // Navigate based on role
      if (selectedRole === 'admin') {
        navigate('/admin');
      } else if (selectedRole === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <Card className="w-full shadow-2xl border-white/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold">R</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {location.state?.message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {location.state.message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Your Role</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={selectedRole === 'customer' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 transition-all"
                onClick={() => setSelectedRole('customer')}
              >
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs">Customer</span>
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'vendor' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 transition-all"
                onClick={() => setSelectedRole('vendor')}
              >
                <Store className="w-5 h-5 mb-1" />
                <span className="text-xs">Vendor</span>
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 transition-all"
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
              <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </Link>
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
          <Button type="submit" className="w-full h-11 font-semibold shadow-lg shadow-primary/20">
            Sign In
          </Button>

          {/* Divider */}
          <div className="relative py-2">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/80 px-2 text-xs text-muted-foreground backdrop-blur-md">
              or
            </span>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary font-bold hover:underline transition-all"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
