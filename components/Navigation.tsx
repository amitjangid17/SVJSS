import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Users, Home, UserPlus, Shield, LogIn } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, isAdmin, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'members', label: 'Members Directory', icon: Users },
    { id: 'register', label: 'Join Community', icon: UserPlus },
    ...(isAdmin 
      ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield }] 
      : [{ id: 'admin-login', label: 'Admin Login', icon: LogIn }]
    ),
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold">Jangid Samaj</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.id || (currentPage === 'admin-login' && item.id === 'admin-login')
                      ? 'bg-primary-foreground text-primary'
                      : 'hover:bg-primary/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {isAdmin && (
              <Button variant="outline" onClick={onLogout} className="text-primary">
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                          currentPage === item.id || (currentPage === 'admin-login' && item.id === 'admin-login')
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  {isAdmin && (
                    <Button variant="outline" onClick={onLogout} className="mt-4">
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}