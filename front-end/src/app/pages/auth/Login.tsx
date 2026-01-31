import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const { user } = await login(data.email, data.password);

            if (user?.role === 'admin') {
                navigate('/admin');
            } else if (user?.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Rentlify</CardTitle>
                    <p className="text-center text-gray-500">Sign in to your {location.search.includes('admin') ? 'Admin' : ''} account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder={location.search.includes('admin') ? "admin@rentlify.com" : "you@example.com"}
                                {...register('email')}
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </Button>

                        <div className="flex flex-col gap-2 text-center text-sm text-gray-600 mt-4">
                            <div>
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign up
                                </Link>
                            </div>
                            {!location.search.includes('admin') ? (
                                <Link to="/login?role=admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                    Log in as Admin
                                </Link>
                            ) : (
                                <Link to="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                    Log in as User
                                </Link>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
