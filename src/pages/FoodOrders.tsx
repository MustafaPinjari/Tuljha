import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { db } from '../db';

function FoodOrders() {
  const [organizationId, setOrganizationId] = useState('');
  const [peopleServed, setPeopleServed] = useState('');
  const [foodItems, setFoodItems] = useState('');
  const [totalCost, setTotalCost] = useState('');

  const organizations = useLiveQuery(() => db.organizations.toArray());
  const orders = useLiveQuery(() => 
    db.foodOrders
      .orderBy('orderDate')
      .reverse()
      .toArray()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.foodOrders.add({
        organizationId: Number(organizationId),
        peopleServed: Number(peopleServed),
        foodItems: foodItems.split(',').map(item => item.trim()),
        totalCost: Number(totalCost),
        orderDate: new Date()
      });
      setOrganizationId('');
      setPeopleServed('');
      setFoodItems('');
      setTotalCost('');
      toast.success('Order added successfully');
    } catch (error) {
      toast.error('Failed to add order');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Food Orders</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">New Food Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Organization</option>
              {organizations?.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of People</label>
            <input
              type="number"
              value={peopleServed}
              onChange={(e) => setPeopleServed(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Food Items (comma-separated)</label>
            <input
              type="text"
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Cost</label>
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {organizations?.find(org => org.id === order.organizationId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.peopleServed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.foodItems.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FoodOrders;