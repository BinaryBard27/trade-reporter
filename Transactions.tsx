import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionApi, Transaction } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { ChevronRight, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    const result = await transactionApi.getTransactions(filter || undefined);
    if (result.error) {
      toast.error(result.error);
    } else {
      setTransactions(result.data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await transactionApi.deleteTransaction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      }
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.tradeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">All Transactions</h1>
            <p className="text-slate-600">Manage and view all trade transactions</p>
          </div>
          <Link href="/submit">
            <a>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                New Transaction
              </Button>
            </a>
          </Link>
        </div>

        {/* Filter Section */}
        <Card className="bg-white shadow-sm p-6 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-[2]">
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Search Trade ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  className="pl-10" 
                  placeholder="Search by Trade ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-900 block mb-2">
                Filter by Status
              </label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchTransactions}>
              Refresh
            </Button>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 mb-4">No transactions found</p>
              {searchQuery ? (
                 <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
              ) : (
                <Link href="/submit">
                  <a>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create First Transaction
                    </Button>
                  </a>
                </Link>
              )}
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
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
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
                      <td className="px-6 py-4 text-sm flex justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => tx.id && handleDelete(tx.id)}
                          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card className="p-4 bg-white shadow-sm">
              <p className="text-sm text-slate-600">Total Records</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{filteredTransactions.length}</p>
            </Card>
            <Card className="p-4 bg-white shadow-sm">
              <p className="text-sm text-slate-600">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ${filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0).toFixed(2)}
              </p>
            </Card>
            <Card className="p-4 bg-white shadow-sm">
              <p className="text-sm text-slate-600">Pending Count</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {filteredTransactions.filter((t) => t.status === 'PENDING').length}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
