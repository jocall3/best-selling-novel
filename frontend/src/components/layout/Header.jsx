import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock user data - in a real app, this would come from context or a hook
  const user = {
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@inquiry.org',
    avatarUrl: `https://i.pravatar.cc/150?u=dr_evelyn_reed`,
    role: 'Lead Researcher'
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Data Sets', path: '/data' },
    { name: 'Team', path: '/team' },
  ];

  const activeLinkClass = "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400";
  const inactiveLinkClass = "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600";

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-slate-100">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 100 100" 
                className="transform -rotate-12 text-indigo-600 dark:text-indigo-500 transition-transform duration-300 hover:rotate-0"
              >
                <rect x="20" y="-20" width="60" height="60" rx="10" transform="rotate(45 50 50)" fill="currentColor" />
              </svg>
              <span className="hidden sm:inline">Inquiry Foundation</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:h-full">
            <ul className="flex items-center space-x-8 h-full">
              {navLinks.map((link) => (
                <li key={link.name} className="h-full flex items-center">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `h-full flex items-center transition-colors duration-200 font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* User Profile Dropdown */}
            <div className="relative hidden sm:block">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <img
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-transparent"
                  src={user.avatarUrl}
                  alt="User avatar"
                />
                <div className="text-left">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
                <ChevronDown size={16} className="text-slate-500" />
              </button>
              {/* Dropdown menu would go here */}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="User avatar" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user.name}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700">Your Profile</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700">Settings</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700">Sign out</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;