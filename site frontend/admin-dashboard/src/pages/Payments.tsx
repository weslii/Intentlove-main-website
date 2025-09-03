import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  Download,
  Plus,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard as CreditCardIcon,
  Banknote,
  Smartphone,
} from "lucide-react";

// Mock data for payments
const payments = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customer: "John Doe",
    amount: 6597,
    method: "Paystack",
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    transactionId: "TXN_123456789",
    fees: 200,
    netAmount: 6397,
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customer: "Jane Smith",
    amount: 7999,
    method: "Bank Transfer",
    status: "pending",
    date: "2024-01-14T14:20:00Z",
    transactionId: "TXN_987654321",
    fees: 0,
    netAmount: 7999,
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    customer: "Mike Johnson",
    amount: 6496,
    method: "Paystack",
    status: "failed",
    date: "2024-01-13T09:15:00Z",
    transactionId: "TXN_456789123",
    fees: 200,
    netAmount: 0,
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    customer: "Sarah Wilson",
    amount: 12999,
    method: "Cash",
    status: "completed",
    date: "2024-01-12T16:45:00Z",
    transactionId: "CASH_001",
    fees: 0,
    netAmount: 12999,
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    customer: "David Brown",
    amount: 4500,
    method: "Paystack",
    status: "processing",
    date: "2024-01-11T11:30:00Z",
    transactionId: "TXN_789123456",
    fees: 200,
    netAmount: 4300,
  },
];

const statusOptions = ["all", "completed", "pending", "processing", "failed"];
const methodOptions = ["all", "Paystack", "Bank Transfer", "Cash"];

export const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status === "completed");
  const pendingPayments = payments.filter(p => p.status === "pending");
  const failedPayments = payments.filter(p => p.status === "failed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Paystack":
        return <CreditCardIcon className="w-4 h-4" />;
      case "Bank Transfer":
        return <Banknote className="w-4 h-4" />;
      case "Cash":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleExportPayments = () => {
    try {
      // Prepare payment data for export
      const exportData = filteredPayments.map(payment => ({
        'Payment ID': payment.id,
        'Order ID': payment.orderId,
        'Customer': payment.customer,
        'Amount': formatCurrency(payment.amount),
        'Method': payment.method,
        'Status': payment.status,
        'Date': formatDate(payment.date),
        'Transaction ID': payment.transactionId,
        'Fees': formatCurrency(payment.fees),
        'Net Amount': formatCurrency(payment.netAmount)
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `payments-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${exportData.length} payments to CSV!`);
    } catch (error) {
      console.error('Error exporting payments:', error);
      toast.error('Failed to export payments. Please try again.');
    }
  };

  return (
    <div className="admin-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">Track and manage payment transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedPayments.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{failedPayments.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {methodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-medium">{payment.id}</p>
                      <p className="text-sm text-muted-foreground">{payment.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(payment.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Transaction Details</p>
                    <p className="text-muted-foreground">Order: {payment.orderId}</p>
                    <p className="text-muted-foreground">TXN ID: {payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Payment Method</p>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-muted-foreground">{payment.method}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Fees & Net Amount</p>
                    <p className="text-muted-foreground">Fees: {formatCurrency(payment.fees)}</p>
                    <p className="text-muted-foreground">Net: {formatCurrency(payment.netAmount)}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Actions</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {payment.status === "pending" && (
                        <Button size="sm">
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 