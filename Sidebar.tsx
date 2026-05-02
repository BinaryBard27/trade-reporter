import { BarChart3, FileText, PlusCircle, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/submit', label: 'Submit Transaction', icon: PlusCircle },
    { href: '/transactions', label: 'All Transactions', icon: TrendingUp },
    { href: '/report', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen shadow-lg">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Trade Reporter
        </h1>
        <p className="text-sm text-slate-400 mt-1">Transaction Management</p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
        <p className="text-xs text-slate-500">v1.0.0</p>
      </div>
    </aside>
  );
}
