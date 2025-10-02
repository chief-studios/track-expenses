import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import { DollarSign, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-header-bg border-b border-app-border z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <DollarSign className="h-8 w-8 text-primary-900" />
              <span className="ml-2 text-xl font-bold text-primary-text">ExpenseTracker</span>
            </div>
          </div>
          
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-secondary-text" />
                <span className="text-sm font-medium text-primary-text">{user?.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900 text-smoke-white-50">
                  {user?.role}
                </span>
              </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
