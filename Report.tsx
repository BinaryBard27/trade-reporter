import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transactionApi, Transaction } from '@/lib/api';
import { toast } from 'sonner';
import { Download, Calendar } from 'lucide-react';

export default function Report() {
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateReport = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both dates');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('From date must be before to date');
      return;
    }

    setLoading(true);
    const result = await transactionApi.getReport(fromDate, toDate);
    if (result.error) {
      toast.error(result.error);
    } else {
      setTransactions(result.data || []);
      setGenerated(true);
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (transactions.length === 0) {
      toast.error('No data to download');
      return;
    }

    const headers = ['Trade ID', 'Instrument Type', 'Amount', 'Currency', 'Status', 'Trade Date'];
    const rows = transactions.map((tx) => [
      tx.tradeId,
      tx.instrumentType,
      parseFloat(tx.amount.toString()).toFixed(2),
      tx.currency,
      tx.status,
      tx.tradeDate,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-report-${fromDate}-to-${toDate}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Report downloaded successfully');
  };

  const stats = {
    totalRecords: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
    byStatus: {
      pending: transactions.filter((t) => t.status === 'PENDING').length,
      completed: transactions.filter((t) => t.status === 'COMPLETED').length,
      cancelled: transactions.filter((t) => t.status === 'CANCELLED').length,
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Transaction Reports</h1>
          <p className="text-slate-600">Generate and download transaction reports by date range</p>
        </div>

        {/* Date Range Filter */}
        <Card className="bg-white shadow-sm p-8 mb-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fromDate" className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={generateReport}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              {generated && transactions.length > 0 && (
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Report Results */}
        {generated && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-600">Total Records</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalRecords}</p>
              </Card>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-600">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${stats.totalAmount.toFixed(2)}
                </p>
              </Card>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.byStatus.pending}</p>
              </Card>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.byStatus.completed}</p>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card className="bg-white shadow-sm overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No transactions found for the selected date range
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Trade ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Instrument
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Currency
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{tx.tradeId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{tx.instrumentType}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {parseFloat(tx.amount.toString()).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{tx.currency}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{tx.tradeDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
