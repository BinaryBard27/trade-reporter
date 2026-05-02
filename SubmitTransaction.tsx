import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionApi } from '@/lib/api';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

const transactionSchema = z.object({
  tradeId: z.string().min(1, 'Trade ID is required'),
  instrumentType: z.string().min(1, 'Instrument type is required'),
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.string().min(1, 'Status is required'),
  tradeDate: z.string().min(1, 'Trade date is required'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function SubmitTransaction() {
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      status: 'PENDING',
      currency: 'USD',
      tradeDate: new Date().toISOString().split('T')[0],
      amount: '',
      tradeId: '',
      instrumentType: '',
    },
  });

  const instrumentType = watch('instrumentType');
  const currency = watch('currency');
  const status = watch('status');

  const onSubmit: SubmitHandler<TransactionFormData> = async (data) => {
    setLoading(true);
    const result = await transactionApi.submitTransaction({
      ...data,
      amount: parseFloat(data.amount),
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Transaction submitted successfully!');
      setTimeout(() => navigate('/transactions'), 1500);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Submit Transaction</h1>
          <p className="text-slate-600">Create a new trade transaction</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Trade ID */}
            <div>
              <Label htmlFor="tradeId" className="text-sm font-semibold text-slate-900">
                Trade ID
              </Label>
              <Input
                id="tradeId"
                placeholder="e.g., TRD001"
                {...register('tradeId')}
                className="mt-2"
              />
              {errors.tradeId && (
                <p className="text-sm text-red-600 mt-1">{errors.tradeId.message}</p>
              )}
            </div>

            {/* Instrument Type */}
            <div>
              <Label htmlFor="instrumentType" className="text-sm font-semibold text-slate-900">
                Instrument Type
              </Label>
              <Select value={instrumentType} onValueChange={(value) => setValue('instrumentType', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select instrument type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="BOND">Bond</SelectItem>
                  <SelectItem value="DERIVATIVE">Derivative</SelectItem>
                  <SelectItem value="COMMODITY">Commodity</SelectItem>
                  <SelectItem value="FOREX">Forex</SelectItem>
                </SelectContent>
              </Select>
              {errors.instrumentType && (
                <p className="text-sm text-red-600 mt-1">{errors.instrumentType.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-sm font-semibold text-slate-900">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
                className="mt-2"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency" className="text-sm font-semibold text-slate-900">
                Currency
              </Label>
              <Select value={currency} onValueChange={(value) => setValue('currency', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-sm text-red-600 mt-1">{errors.currency.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" className="text-sm font-semibold text-slate-900">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Trade Date */}
            <div>
              <Label htmlFor="tradeDate" className="text-sm font-semibold text-slate-900">
                Trade Date
              </Label>
              <Input
                id="tradeDate"
                type="date"
                {...register('tradeDate')}
                className="mt-2"
              />
              {errors.tradeDate && (
                <p className="text-sm text-red-600 mt-1">{errors.tradeDate.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Submitting...' : 'Submit Transaction'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/transactions')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
