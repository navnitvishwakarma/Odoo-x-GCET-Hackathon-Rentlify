import { useState } from "react";
import { User, Lock, Bell, Save } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/services/api";

export default function VendorSettings() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business Profile</CardTitle>
                            <CardDescription>
                                Update your business information visible to customers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Business Name</label>
                                    <Input defaultValue={`${user?.name}'s Business`} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Contact Email</label>
                                    <Input defaultValue={user?.email} disabled />
                                    <p className="text-xs text-muted-foreground">Contact support to change email.</p>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input defaultValue="+91 98765 43210" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Business Address</label>
                                    <Input defaultValue="123 Market Street, City, State" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>
                                Manage your password and account security.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Current Password</label>
                                    <Input type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">New Password</label>
                                    <Input type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Confirm New Password</label>
                                    <Input type="password" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Choose what you want to be notified about.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">New Orders</label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive emails when you get a new rental request.
                                    </p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">Order Updates</label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when an order status changes.
                                    </p>
                                </div>
                                <input type="checkbox" className="toggle" defaultChecked />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleSave} disabled={isLoading}>
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
