import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { FileDown, FileSpreadsheet, Image, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { db, Organization, FoodOrder, Invoice, Expense } from '../db';

function Downloads() {
  const organizations = useLiveQuery<Organization[]>(() => db.organizations.toArray());
  const orders = useLiveQuery<FoodOrder[]>(() => db.foodOrders.toArray());
  const invoices = useLiveQuery<Invoice[]>(() => db.invoices.toArray());
  const expenses = useLiveQuery<Expense[]>(() => db.expenses.toArray());

  const downloadExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data.map(item => ({
      ...item,
      createdAt: item.createdAt?.toLocaleDateString(),
      date: item.date?.toLocaleDateString(),
      orderDate: item.orderDate?.toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const downloadPDF = (data: any[], filename: string) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    
    let y = 20;
    data.forEach((item) => {
      const processedItem = {
        ...item,
        createdAt: item.createdAt?.toLocaleDateString(),
        date: item.date?.toLocaleDateString(),
        orderDate: item.orderDate?.toLocaleDateString()
      };
      
      const text = Object.entries(processedItem)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(text, 10, y);
      y += 10;
    });
    
    doc.save(`${filename}.pdf`);
  };

  const downloadImage = (data: any[], filename: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = 800;
    canvas.height = data.length * 30 + 50;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    
    let y = 40;
    data.forEach((item) => {
      const processedItem = {
        ...item,
        createdAt: item.createdAt?.toLocaleDateString(),
        date: item.date?.toLocaleDateString(),
        orderDate: item.orderDate?.toLocaleDateString()
      };
      
      const text = Object.entries(processedItem)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      ctx.fillText(text, 20, y);
      y += 30;
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const downloadData = (type: string, data: any[], filename: string) => {
    const processedData = data.map(item => ({
      ...item,
      id: undefined // Remove id from downloads
    }));

    switch (type) {
      case 'excel':
        downloadExcel(processedData, filename);
        break;
      case 'pdf':
        downloadPDF(processedData, filename);
        break;
      case 'image':
        downloadImage(processedData, filename);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Downloads</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Organizations', data: organizations, filename: 'organizations' },
          { title: 'Food Orders', data: orders, filename: 'orders' },
          { title: 'Invoices', data: invoices, filename: 'invoices' },
          { title: 'Expenses', data: expenses, filename: 'expenses' }
        ].map(({ title, data, filename }) => (
          <div key={title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h2>
            <div className="space-y-3">
              <button
                onClick={() => downloadData('excel', data || [], filename)}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Download Excel
              </button>
              
              <button
                onClick={() => downloadData('pdf', data || [], filename)}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
              >
                <FileText className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                Download PDF
              </button>
              
              <button
                onClick={() => downloadData('image', data || [], filename)}
                className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
              >
                <Image className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Download Image
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Downloads;