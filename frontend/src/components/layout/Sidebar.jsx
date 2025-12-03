import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  CubeTransparentIcon,
  UsersIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'The Oracle', href: '/oracle', icon: SparklesIcon },
  { name: 'The Saga', href: '/saga', icon: BookOpenIcon },
  { name: 'Meet The Agents', href: '/agents', icon: UsersIcon },
  { name: 'The Data Garden', href: '/data-garden', icon: ChartBarIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-gray-900 text-white shadow-lg z-40">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <CubeTransparentIcon className="h-8 w-8 text-indigo-400 mr-3" aria-hidden="true" />
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Project Nexus
          </span>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                ${location.pathname === item.href
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                }
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out
              `}
            >
              <item.icon
                className={`
                  ${location.pathname === item.href
                    ? 'text-white'
                    : 'text-indigo-300 group-hover:text-white'
                  }
                  mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200 ease-in-out
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-gray-800 p-4 border-t border-gray-700">
        <a href="#" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User Avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Agent Smith</p>
              <p className="text-xs font-medium text-indigo-200 group-hover:text-white transition-colors duration-200 ease-in-out">
                View profile
              </p>
            </div>
          </div>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;