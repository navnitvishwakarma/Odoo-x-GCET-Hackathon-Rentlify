import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const VendorSignup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        companyName: "",
        gstin: "",
        email: "",
        password: ""
    });

    const handleVendorRegister = () => {
        // Trigger auth context login to update state and localStorage
        login(formData.email || "vendor@example.com", "password", "vendor");
        navigate("/vendor/dashboard");
    };

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Vendor Registration</CardTitle>
                    <CardDescription>Start selling your gear on Rentlify today.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                            id="gstin"
                            placeholder="GSTIN"
                            value={formData.gstin}
                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="work@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <Button className="w-full" onClick={handleVendorRegister}>
                        Register as Vendor
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default VendorSignup;
