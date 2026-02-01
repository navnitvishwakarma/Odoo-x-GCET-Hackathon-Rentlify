import { useEffect, useState } from 'react';
import { api } from '@/app/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, MoreVertical, ShieldCheck, ShieldAlert, Mail, Ban, CheckCircle, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export default function AdminVendors() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const { data } = await api.get('/admin/vendors');
            setVendors(data.data);
        } catch (error) {
            console.error("Failed to fetch vendors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string) => {
        try {
            await api.patch(`/admin/vendors/${id}/verify`);
            setVendors(vendors.map(v => v._id === id ? { ...v, isEmailVerified: true } : v));
            alert("Vendor verified successfully!");
        } catch (error) {
            console.error("Verify failed", error);
            alert("Failed to verify vendor.");
        }
    };

    const handleSuspend = async (id: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            await api.patch(`/admin/vendors/${id}/suspend`, { isActive: newStatus });
            setVendors(vendors.map(v => v._id === id ? { ...v, isActive: newStatus } : v));
            alert(`Vendor ${newStatus ? 'activated' : 'suspended'} successfully!`);
        } catch (error) {
            console.error("Suspend failed", error);
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/vendors/${id}`);
            setVendors(vendors.filter(v => v._id !== id));
            alert("Vendor deleted successfully!");
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete vendor.");
        }
    };

    const handleEmail = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading vendors...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
                    <p className="text-muted-foreground">Manage accounts, verify businesses, and monitor activity.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search vendors..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Vendors ({vendors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left font-medium text-muted-foreground">Vendor</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Business Info</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Joined</th>
                                    <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No vendors found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                                {filteredVendors.map((vendor) => (
                                    <tr key={vendor._id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {vendor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{vendor.name}</div>
                                                    <div className="text-xs text-muted-foreground">{vendor.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{vendor.businessName || 'N/A'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {vendor.profile?.address?.city || 'Location N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                {vendor.isEmailVerified ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                        <ShieldAlert className="w-3 h-3 mr-1" /> Pending
                                                    </span>
                                                )}

                                                {vendor.isActive === false && (
                                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                                        <Ban className="w-3 h-3 mr-1" /> Suspended
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(vendor.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEmail(vendor.email)} className="cursor-pointer">
                                                        <Mail className="w-4 h-4 mr-2" /> Email Vendor
                                                    </DropdownMenuItem>

                                                    {!vendor.isEmailVerified && (
                                                        <DropdownMenuItem onClick={() => handleVerify(vendor._id)} className="cursor-pointer text-green-600">
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Verified
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuItem
                                                        onClick={() => handleSuspend(vendor._id, vendor.isActive !== false)}
                                                        className={`cursor-pointer ${vendor.isActive === false ? 'text-green-600' : 'text-orange-600'}`}
                                                    >
                                                        <Ban className="w-4 h-4 mr-2" />
                                                        {vendor.isActive === false ? 'Activate Account' : 'Suspend Account'}
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => handleDelete(vendor._id)} className="cursor-pointer text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
