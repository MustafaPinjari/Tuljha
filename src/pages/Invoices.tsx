import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'react-hot-toast';
import { Share2, Mail, Send } from 'lucide-react';
import { db, Invoice, Organization, FoodOrder } from '../db';

function Invoices() {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [status, setStatus] = useState<'paid' | 'pending'>('pending');

  const organizations = useLiveQuery<Organization[]>(() => db.organizations.toArray());
  const orders = useLiveQuery<FoodOrder[]>(() => db.foodOrders.toArray());
  const invoices = useLiveQuery<Invoice[]>(() => 
    db.invoices
      .orderBy('createdAt')
      .reverse()
      .toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders?.find(o => o.id === Number(selectedOrder));
    if (!order) return;
  
    try {
      await db.invoices.add({
        organizationId: order.organizationId,
        orderId: order.id!,
        amount: order.totalCost,
        status,
        createdAt: new Date()
      });
      setSelectedOrder('');
      setStatus('pending');
      toast.success('Invoice generated successfully');
    } catch (error) {
      console.error("Invoice generation failed:", error);  // Log error for debugging
      toast.error('Failed to generate invoice');  // You can include more error information here if needed
    }
  };
  

  const handleShare = (type: 'email' | 'whatsapp', invoice: Invoice) => {
    const org = organizations?.find(o => o.id === invoice.organizationId);
    const order = orders?.find(o => o.id === invoice.orderId);
    
    if (!org || !order) return;

    const message = `Invoice for ${org.name}\nAmount: ₹${invoice.amount}\nOrder Details: ${order.foodItems.join(', ')}\nStatus: ${invoice.status}`;

    if (type === 'email') {
      window.location.href = `mailto:${org.email}?subject=Invoice&body=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Invoices</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Generate Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Order</label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Order</option>
              {orders?.map((order) => (
                <option key={order.id} value={order.id}>
                  {organizations?.find(org => org.id === order.organizationId)?.name} - 
                  {new Date(order.orderDate).toLocaleDateString()} - 
                  ₹{order.totalCost}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'paid' | 'pending')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">
            <Send className="h-4 w-4 mr-2" />
            Generate Invoice
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Invoices List</h2>
        <div className="table-wrapper">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {invoices?.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {organizations?.find(org => org.id === invoice.organizationId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₹{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShare('email', invoice)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleShare('whatsapp', invoice)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoices;