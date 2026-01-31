import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Role } from '../../types/auth.types';

const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'vendor'] as const),
    businessName: z.string().optional(),
    gstNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => {
    if (data.role === 'vendor') {
        return !!data.businessName && !!data.gstNumber;
    }
    return true;
}, {
    message: "Business details are required for vendors",
    path: ["businessName"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState<Role>('customer');
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'customer'
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');

            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                ...(data.role === 'vendor' && {
                    businessName: data.businessName,
                    gstNumber: data.gstNumber,
                })
            };

            await registerUser(payload);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Create an Account</CardTitle>
                    <p className="text-center text-gray-500">Join Rentlify today</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                            <button
                                type="button"
                                onClick={() => { setRole('customer'); setValue('role', 'customer'); }}
                                className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'customer'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => { setRole('vendor'); setValue('role', 'vendor'); }}
                                className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'vendor'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Vendor
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input placeholder="John Doe" {...register('name')} />
                            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" placeholder="you@example.com" {...register('email')} />
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        {role === 'vendor' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900">Business Details</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company Name</label>
                                    <Input placeholder="Acme Rentals" {...register('businessName')} />
                                    {errors.businessName && <p className="text-sm text-red-600">{errors.businessName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">GSTIN</label>
                                    <Input placeholder="22AAAAA0000A1Z5" {...register('gstNumber')} />
                                    {errors.gstNumber && <p className="text-sm text-red-600">{errors.gstNumber.message}</p>}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input type="password" placeholder="••••••••" {...register('password')} />
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm Password</label>
                                <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
                                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                            {role === 'vendor' ? 'Register As Vendor' : 'Create Account'}
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
