import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/app/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/app/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import { Separator } from "@/app/components/ui/separator";

interface InvoiceDetailsDialogProps {
    invoice: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({ invoice, open, onOpenChange }: InvoiceDetailsDialogProps) {
    if (!invoice) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                Invoice {invoice.invoiceNumber}
                            </DialogTitle>
                            <DialogDescription>
                                Issued on {format(new Date(invoice.createdAt), "MMMM dd, yyyy")}
                            </DialogDescription>
                        </div>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="text-sm">
                            {invoice.status.toUpperCase()}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8 py-4">
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Billed To</h4>
                        <div className="text-sm">
                            <p className="font-medium">{invoice.customer?.name || "Unknown Customer"}</p>
                            <p className="text-muted-foreground">{invoice.customer?.email}</p>
                            <p className="text-muted-foreground">{invoice.customer?.phone || "No phone"}</p>
                            {invoice.customer?.gstNumber && (
                                <p className="text-xs text-muted-foreground mt-1">GSTIN: {invoice.customer.gstNumber}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Vendor Details</h4>
                        <div className="text-sm">
                            <p className="font-medium">{invoice.vendor?.businessName || invoice.vendor?.name}</p>
                            <p className="text-muted-foreground">{invoice.vendor?.email}</p>
                            {invoice.vendor?.gstNumber && (
                                <p className="text-xs text-muted-foreground mt-1">GSTIN: {invoice.vendor.gstNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items?.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        ₹{item.unitPrice?.toLocaleString() || (item.amount / item.quantity).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₹{item.amount.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Tax (18% GST)</span>
                        <span>₹{invoice.taxAmount.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total</span>
                        <span>₹{invoice.totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
