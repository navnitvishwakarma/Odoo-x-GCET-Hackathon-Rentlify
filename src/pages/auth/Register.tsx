import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth, UserRole } from '@/context/AuthContext';
import { User, Store, Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Basic Info State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Business Specific State
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');

  // Promo State
  const [couponCode, setCouponCode] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'vendor') {
      setSelectedRole('vendor');
    }
  }, [searchParams]);

  const isFormValid = !!(
    name &&
    email &&
    password &&
    password === confirmPassword &&
    agreeTerms &&
    (selectedRole !== 'vendor' || (companyName && gstin))
  );

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      signup(name, email, password, selectedRole);
      // Redirect to verification pending page
      navigate('/verify-email');
    }
  };

  return (
    <Card className="w-full shadow-2xl border-white/20 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-primary text-primary-foreground w-12 h-12 rounded-lg flex items-center justify-center font-bold shadow-lg">
            <span className="text-2xl">R</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>
          Join Rentlify and start renting or earning today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">I want to</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={selectedRole === 'customer' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 gap-1 transition-all"
                onClick={() => setSelectedRole('customer')}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Rent Items</span>
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'vendor' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 gap-1 transition-all"
                onClick={() => setSelectedRole('vendor')}
              >
                <Store className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">List & Earn</span>
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-3 gap-1 transition-all"
                onClick={() => setSelectedRole('admin')}
              >
                <Shield className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Admin</span>
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm <span className="text-destructive">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input-background"
                />
              </div>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[10px] text-destructive font-medium -mt-2">Passwords do not match</p>
            )}
          </div>

          {/* Dynamic Business Fields */}
          <AnimatePresence mode="wait">
            {selectedRole === 'vendor' && (
              <motion.div
                key="vendor-fields"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 pt-2 pb-2 border-t border-border/50"
              >
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="companyName"
                    placeholder="Legal Business Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN <span className="text-destructive">*</span></Label>
                  <Input
                    id="gstin"
                    placeholder="15-digit GST Number"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="bg-input-background uppercase"
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    GSTIN is required to generate legal rental invoices.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Promo Code Toggle */}
          <div className="pt-2">
            {!showCoupon ? (
              <button
                type="button"
                onClick={() => setShowCoupon(true)}
                className="text-xs text-primary hover:underline transition-all"
              >
                Have a referral or promotional code?
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    placeholder="SUMMER2026"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="bg-input-background"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCoupon(false)}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Compliance */}
          <div className="flex items-start gap-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-xs text-muted-foreground leading-tight cursor-pointer"
            >
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold shadow-lg shadow-primary/20 transition-all"
            disabled={!isFormValid}
          >
            Create Account
          </Button>

          <div className="relative py-2">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/80 px-3 text-[10px] uppercase font-bold text-muted-foreground backdrop-blur-md">
              or
            </span>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
