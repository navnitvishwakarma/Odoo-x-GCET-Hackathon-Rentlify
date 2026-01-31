import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    UserX,
    UserCheck,
    Trash2,
    Mail,
    Building2,
    Calendar,
    ShieldCheck,
    Clock,
    UserPlus
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'vendor' | 'admin';
    companyName?: string;
    gstin?: string;
    status: 'active' | 'pending' | 'blocked';
    registeredDate: string;
    avatar?: string;
    lastLogin: string;
    totalRentals: number;
    totalListings?: number;
    isVerified: boolean;
}

const mockUsers: User[] = [
    {
        id: 'USR001',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        status: 'active',
        registeredDate: '2025-01-15',
        lastLogin: '2 hours ago',
        totalRentals: 12,
        isVerified: true
    },
    {
        id: 'USR002',
        name: 'Sarah Williams',
        email: 'sarah@progear.com',
        role: 'vendor',
        companyName: 'ProGear Rentals',
        gstin: '07AAAAA0000A1Z5',
        status: 'active',
        registeredDate: '2025-02-20',
        lastLogin: '10 mins ago',
        totalRentals: 45,
        totalListings: 18,
        isVerified: true
    },
    {
        id: 'USR003',
        name: 'Mike Johnson',
        email: 'mike@gmail.com',
        role: 'customer',
        status: 'blocked',
        registeredDate: '2025-03-10',
        lastLogin: '3 days ago',
        totalRentals: 2,
        isVerified: false
    },
    {
        id: 'USR004',
        name: 'Alex Rivera',
        email: 'alex@techrent.com',
        role: 'vendor',
        companyName: 'TechRent Co',
        gstin: '22BBBBB1111B2Z6',
        status: 'pending',
        registeredDate: '2026-01-30',
        lastLogin: 'Just now',
        totalRentals: 0,
        totalListings: 5,
        isVerified: false
    }
];

export function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    const toggleSelectUser = (id: string) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">Active</Badge>;
            case 'blocked':
                return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">Blocked</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-200">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
                    <p className="text-muted-foreground">Manage and monitor all platform users, vendors, and roles.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New User
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or company..."
                                className="pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="p-2">
                                        <p className="text-xs font-semibold mb-2 px-2 uppercase text-muted-foreground">Filter by Role</p>
                                        <div className="space-y-1">
                                            {['all', 'admin', 'vendor', 'customer'].map((role) => (
                                                <Button
                                                    key={role}
                                                    variant={roleFilter === role ? 'secondary' : 'ghost'}
                                                    size="sm"
                                                    className="w-full justify-start capitalize"
                                                    onClick={() => setRoleFilter(role)}
                                                >
                                                    {role}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {selectedUsers.length > 0 && (
                                <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md animate-in fade-in slide-in-from-right-1">
                                    <span className="text-sm font-medium">{selectedUsers.length} selected</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">Block</Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">Approve</Button>
                                    <Button variant="ghost" size="sm" className="text-destructive h-8 px-2">Delete</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[40px]">
                                        <Checkbox
                                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="font-semibold">User</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Registered</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors group">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedUsers.includes(user.id)}
                                                    onCheckedChange={() => toggleSelectUser(user.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-border">
                                                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedUser(user)}>
                                                            {user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium capitalize">{user.role}</span>
                                                    {user.companyName && (
                                                        <div className="flex items-center text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-fit">
                                                            <Building2 className="h-2.5 w-2.5 mr-1" />
                                                            {user.companyName}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(user.status)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {user.registeredDate}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {user.status === 'blocked' ? (
                                                            <DropdownMenuItem className="text-green-600">
                                                                <UserCheck className="mr-2 h-4 w-4" /> Unblock User
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="text-red-500">
                                                                <UserX className="mr-2 h-4 w-4" /> Block User
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="text-red-600 font-medium">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[400px] text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground/30 ring-8 ring-muted/20">
                                                    <Search className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold">No users found</h3>
                                                    <p className="text-sm text-muted-foreground max-w-[250px]">
                                                        Try adjusting your search or filters to find what you're looking for.
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}>
                                                    Clear all filters
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* User Detail Side Drawer */}
            <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto border-l-0 shadow-2xl">
                    {selectedUser && (
                        <div className="space-y-8 pt-6">
                            <SheetHeader className="relative">
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                                            {selectedUser.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-2xl font-bold">{selectedUser.name}</SheetTitle>
                                        <SheetDescription className="flex items-center gap-2 mt-1">
                                            <Mail className="h-3 w-3" /> {selectedUser.email}
                                        </SheetDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {getStatusBadge(selectedUser.status)}
                                    {selectedUser.isVerified && (
                                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Verified</Badge>
                                    )}
                                </div>
                            </SheetHeader>

                            <div className="grid grid-cols-2 gap-6 bg-muted/50 p-6 rounded-2xl border border-border">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> Last login
                                    </Label>
                                    <p className="font-semibold text-foreground">{selectedUser.lastLogin}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> Registered Date
                                    </Label>
                                    <p className="font-semibold text-foreground">{selectedUser.registeredDate}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                                        <ShieldCheck className="h-3 w-3" /> Total Rentals
                                    </Label>
                                    <p className="font-semibold text-foreground">{selectedUser.totalRentals} Completed</p>
                                </div>
                                {selectedUser.role === 'vendor' && (
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                                            <Building2 className="h-3 w-3" /> Active Listings
                                        </Label>
                                        <p className="font-semibold text-foreground">{selectedUser.totalListings} Items</p>
                                    </div>
                                )}
                            </div>

                            {selectedUser.role === 'vendor' && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm border-b pb-2">Business Documentation</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/5 p-2 rounded-lg">
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{selectedUser.companyName}</p>
                                                    <p className="text-[10px] font-mono text-muted-foreground">{selectedUser.gstin}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold text-green-600 bg-green-50/50">VERIFIED</Badge>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4">
                                <div className="flex flex-col gap-3">
                                    {selectedUser.status === 'pending' && (
                                        <Button className="w-full bg-green-600 hover:bg-green-700 h-11 text-white">Approve Vendor Application</Button>
                                    )}
                                    {selectedUser.status === 'active' ? (
                                        <Button variant="destructive" className="w-full h-11">Suspend Account</Button>
                                    ) : selectedUser.status === 'blocked' ? (
                                        <Button className="w-full h-11 bg-accent hover:bg-accent/90">Reactivate Account</Button>
                                    ) : null}
                                    <Button variant="outline" className="w-full h-11 border-gray-200">Send Direct Message</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
