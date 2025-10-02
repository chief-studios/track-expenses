import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, CreditCard } from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bills', href: '/bills', icon: Receipt },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar-bg border-r border-app-border z-20">
      <div className="py-6">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-900 text-smoke-white-50 border-primary-900'
                      : 'text-primary-text hover:bg-smoke-white-100 hover:text-primary-900'
                  }`
                }
              >
                <Icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
