import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Utensils, 
  Receipt, 
  Wallet, 
  Download,
  Hotel,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/organizations', icon: Building2, label: 'Organizations' },
  { path: '/food-orders', icon: Utensils, label: 'Food Orders' },
  { path: '/invoices', icon: Receipt, label: 'Invoices' },
  { path: '/expenses', icon: Wallet, label: 'Expenses' },
  { path: '/downloads', icon: Download, label: 'Downloads' }
];

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark:bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-screen 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-64 
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 
        p-4 
        transition-transform duration-200 ease-in-out
        z-40
      `}>
        <div className="flex items-center gap-2 mb-8">
          <Hotel className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">Hotel Manager</span>
        </div>

        <div className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === path
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="absolute bottom-4 left-4 p-2 rounded-lg 
            text-gray-600 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700
            transition-colors duration-200"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Main content */}
      <main className={`
        lg:ml-64 p-8
        text-gray-900 dark:text-gray-100
        transition-colors duration-200
      `}>
        {children}
      </main>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;