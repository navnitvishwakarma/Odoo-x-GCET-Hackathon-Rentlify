import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/utils';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const getStrength = (pass: string) => {
        if (pass.length === 0) return 0;
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9]/.test(pass)) strength += 25;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
        return strength;
    };

    const strength = getStrength(password);

    const getStrengthColor = (val: number) => {
        if (val < 50) return 'bg-destructive';
        if (val < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const handlesubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmPassword && strength >= 50) {
            setIsUpdating(true);
            setTimeout(() => {
                setIsUpdating(false);
                navigate('/login', { state: { message: 'Password updated successfully!' } });
            }, 2000);
        }
    };

    return (
        <Card className="w-full shadow-2xl border-white/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-primary/20 text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Choose a strong password to secure your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlesubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-input-background pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Strength Indicator */}
                        <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>Strength</span>
                                <span className={cn(
                                    strength < 50 ? 'text-destructive' : strength < 75 ? 'text-yellow-500' : 'text-green-500'
                                )}>
                                    {strength < 50 ? 'Weak' : strength < 75 ? 'Medium' : 'Strong'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${strength}%` }}
                                    className={cn("h-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", getStrengthColor(strength))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-input-background"
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-[10px] text-destructive font-bold">Passwords do not match</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                        disabled={isUpdating || password !== confirmPassword || strength < 50}
                    >
                        {isUpdating ? 'Updating...' : 'Update Password'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-muted-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
