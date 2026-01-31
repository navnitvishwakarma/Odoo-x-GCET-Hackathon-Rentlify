import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { useApp, UserRole } from '@/app/context/app-context';
import { User, Store, Shield, Check } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const { signup } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && password === confirmPassword && agreeTerms && selectedRole) {
      signup(name, email, password, selectedRole);
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
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join RentEarn and start renting or earning today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === 'customer' ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedRole('customer')}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs">Rent Items</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === 'vendor' ? 'default' : 'outline'}
                  className="flex flex-col h-auto py-3"
                  onClick={() => setSelectedRole('vendor')}
                >
                  <Store className="w-5 h-5 mb-1" />
                  <span className="text-xs">List & Earn</span>
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

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background"
              />
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-input-background"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={!agreeTerms || password !== confirmPassword}>
              Create Account
            </Button>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
