import { useState, useEffect } from "react";
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
    const [profileData, setProfileData] = useState({
        businessName: '',
        gstNumber: '',
        address: { street: '', city: '', state: '', zip: '', country: 'India' },
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/vendors/me');
                if (data.data) {
                    setProfileData({
                        businessName: data.data.businessName || '',
                        gstNumber: data.data.gstNumber || '',
                        address: data.data.address || { street: '', city: '', state: '', zip: '', country: 'India' },
                        bio: data.data.bio || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfileData(prev => ({
                ...prev,
                [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value }
            }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.put('/vendors/me', profileData);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to save settings. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                                    <Input name="businessName" value={profileData.businessName} onChange={handleChange} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">GST Number</label>
                                    <Input name="gstNumber" value={profileData.gstNumber} onChange={handleChange} placeholder="GSTIN" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <Input name="bio" value={profileData.bio} onChange={handleChange} placeholder="Tell us about your business" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">City</label>
                                        <Input name="address.city" value={profileData.address.city} onChange={handleChange} />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">State</label>
                                        <Input name="address.state" value={profileData.address.state} onChange={handleChange} />
                                    </div>
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
                            <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                                Password updates are currently disabled. Please contact support.
                            </div>
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
