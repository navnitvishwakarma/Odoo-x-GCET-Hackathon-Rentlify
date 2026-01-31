import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/app/components/dashboard-sidebar";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardLayout({ role }: { role: "admin" | "vendor" }) {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            <DashboardSidebar role={role} />
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="h-16 border-b flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-lg font-semibold capitalize">{role} Portal</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
