import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    FileText,
    Search,
    Download,
    Filter,
    ArrowUpRight
} from "lucide-react";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { InvoiceDetailsDialog } from "./InvoiceDetailsDialog";

export default function VendorInvoices() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const { data } = await api.get('/invoices');
            if (data.success) {
                setInvoices(data.data);
            }
        } catch (error: any) {
            console.error("Failed to fetch invoices", error);
            const msg = error.response?.data?.message || "Failed to load invoices";
            // Show toast so user knows SOMETHING failed
            // assuming toast is imported or available, if not, we use alert for desperate debugging
            alert(`Debug Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground">Manage and track your sales invoices.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Export Report
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by invoice # or customer..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading invoices...
                                </TableCell>
                            </TableRow>
                        ) : filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No invoices found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice._id}>
                                    <TableCell className="font-medium">
                                        {invoice.invoiceNumber}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{invoice.customer?.name || "Unknown"}</span>
                                            <span className="text-xs text-muted-foreground">{invoice.customer?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {invoice.items?.map((item: any, idx: number) => (
                                                <span key={idx} className="text-xs bg-secondary/50 px-2 py-0.5 rounded-sm truncate max-w-[200px] inline-block">
                                                    {item.quantity}x {item.description}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        ₹{invoice.totalAmount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => setSelectedInvoice(invoice)}
                                        >
                                            View <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <InvoiceDetailsDialog
                invoice={selectedInvoice}
                open={!!selectedInvoice}
                onOpenChange={(open) => !open && setSelectedInvoice(null)}
            />
        </div>
    );
}
