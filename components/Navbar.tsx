
import React from 'react';
import { User, LogOut, BookOpen } from 'lucide-react';
import { Student } from '../types';

interface NavbarProps {
  user: Student | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLoginClick }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent hidden sm:block">
              纪老师会计特训站
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.StudentID}</span>
                  <span className="mx-1 opacity-30">|</span>
                  <span className="text-xs">
                    今日剩余: {user.MaxUsage - user.UsageCount}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                学生登录
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
