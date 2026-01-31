import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Settings as SettingsIcon,
    Users,
    Shield,
    CreditCard,
    Bell,
    Cpu,
    Globe,
    Mail,
    Phone,
    DollarSign,
    AlertTriangle,
    Database,
    CheckCircle2,
    Save
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings updated successfully', {
                description: 'Your changes have been saved to the platform configuration.',
                icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
            });
        }, 1200);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground">Configure global platform behavior, security, and payment rules.</p>
            </div>

            <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-6">
                <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-1 md:w-64">
                    <TabsTrigger
                        value="general"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <SettingsIcon className="mr-3 h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <Users className="mr-3 h-4 w-4" /> User & Vendor
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <Shield className="mr-3 h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="payment"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <CreditCard className="mr-3 h-4 w-4" /> Payouts
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <Bell className="mr-3 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="system"
                        className="justify-start px-4 py-3 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary rounded-xl"
                    >
                        <Cpu className="mr-3 h-4 w-4" /> System
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* General Settings */}
                    <TabsContent value="general" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">General Information</CardTitle>
                                <CardDescription>Update your platform branding and contact details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="platform-name">Platform Name</Label>
                                        <Input id="platform-name" defaultValue="Rentlify" className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="support-email">Support Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="support-email" defaultValue="support@rentlify.com" className="pl-10 bg-muted/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-number">Contact Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="contact-number" defaultValue="+1 (555) 000-0000" className="pl-10 bg-muted/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Default Currency</Label>
                                        <Select defaultValue="usd">
                                            <SelectTrigger className="bg-muted/50">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD ($)</SelectItem>
                                                <SelectItem value="eur">EUR (€)</SelectItem>
                                                <SelectItem value="inr">INR (₹)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Regional Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Default Timezone</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Select defaultValue="utc-5">
                                            <SelectTrigger className="pl-10 bg-gray-50/50">
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="utc-8">Pacific Time (PT)</SelectItem>
                                                <SelectItem value="utc-5">Eastern Time (ET)</SelectItem>
                                                <SelectItem value="utc+0">Greenwich Mean Time (GMT)</SelectItem>
                                                <SelectItem value="utc+5.5">India Standard Time (IST)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* User & Vendor Settings */}
                    <TabsContent value="users" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Onboarding Controls</CardTitle>
                                <CardDescription>Manage how new registrations are handled.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Allow User Signup</Label>
                                        <p className="text-xs text-muted-foreground">Public registration for customer accounts.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Allow Vendor Signup</Label>
                                        <p className="text-xs text-muted-foreground">Public registration for vendor accounts.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Verification Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Email Verification Mandatory</Label>
                                        <p className="text-xs text-muted-foreground">Users must verify email before renting.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">GST Verification for Vendors</Label>
                                        <p className="text-xs text-muted-foreground">Vendors must provide valid GSTIN to list items.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Authentication Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Minimum Password Length</Label>
                                    <Input type="number" defaultValue="8" className="bg-muted/50" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Strong Password Policy</Label>
                                        <p className="text-xs text-muted-foreground">Require special characters and numbers.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Enable 2FA</Label>
                                        <p className="text-xs text-muted-foreground">Prompt users to setup two-factor authentication.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payout Settings */}
                    <TabsContent value="payment" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Commission & Payouts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Platform Commission (%)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="number" defaultValue="10" className="pl-10 bg-gray-50/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Vendor Payout Cycle</Label>
                                    <Select defaultValue="weekly">
                                        <SelectTrigger className="bg-muted/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Enable Refunds</Label>
                                        <p className="text-xs text-muted-foreground">Allow automated refund processing.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Email Notifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">New Vendor Alerts</Label>
                                        <p className="text-xs text-muted-foreground">Notify admins when a new vendor signs up.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator className="bg-gray-100" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Booking Confirmations</Label>
                                        <p className="text-xs text-muted-foreground">Send automated emails after successful rentals.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* System Tab */}
                    <TabsContent value="system" className="mt-0 space-y-6">
                        <Card className="border-none shadow-sm shadow-gray-200 bg-red-50/30 border-red-100 border">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                                    <AlertTriangle className="h-4 w-4 text-red-600" /> Maintenance Mode
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold text-foreground">Active Maintenance</Label>
                                        <p className="text-xs text-muted-foreground">Show maintenance page to all public users.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Database className="h-4 w-4 text-primary" /> API & Backups
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm py-2 px-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        API Status: Operational
                                    </div>
                                    <span className="text-[10px] text-green-600 font-mono">99.9% Uptime</span>
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Frequency</Label>
                                    <Select defaultValue="daily">
                                        <SelectTrigger className="bg-muted/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Every Hour</SelectItem>
                                            <SelectItem value="daily">Daily @ 02:00 AM</SelectItem>
                                            <SelectItem value="weekly">Weekly on Sunday</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Sticky Save Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 gap-3 group bg-primary"
                >
                    {isSaving ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="font-bold">{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
                </Button>
            </div>
        </div>
    );
}
