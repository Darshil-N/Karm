import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Search, LogOut, User, Settings, Menu, X } from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const DashboardLayout = ({ children, sidebar }: DashboardLayoutProps) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if no user is logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyber-lime/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-electric-purple/15 rounded-full animate-float stagger-delay-2"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-cyber-lime/20 rounded-full animate-float stagger-delay-4"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-electric-purple/10 rounded-full animate-float stagger-delay-3"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="loading-spinner w-12 h-12 border-4 border-cyber-lime/30 border-t-cyber-lime rounded-full mx-auto mb-4"></div>
          <p className="text-mist-white text-lg animate-pulse-slow">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, return null (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-deep-space dashboard-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyber-lime/5 rounded-full animate-float"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-electric-purple/10 rounded-full animate-float stagger-delay-2"></div>
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-cyber-lime/8 rounded-full animate-float stagger-delay-4"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-electric-purple/5 rounded-full animate-float stagger-delay-3"></div>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''} md:hidden`}
        onClick={closeMobileMenu}
      />

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-deep-space/95 border-r cyber-card-border hidden md:flex flex-col cyber-glow animate-slide-in-left relative z-10">
        <div className="animate-fade-in stagger-delay-1">
          {sidebar}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''} md:hidden cyber-glow bg-deep-space/98 backdrop-blur-lg relative z-20`}>
        <div className="p-4 border-b cyber-card-border flex justify-between items-center animate-slide-in-top">
          <h2 className="text-lg font-bold text-mist-white">Menu</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeMobileMenu}
            className="text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime hover-scale"
          >
            <X className="h-5 w-5 icon-wiggle" />
          </Button>
        </div>
        <div className="flex-1 animate-slide-in-left stagger-delay-1">
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col animate-slide-in-right relative z-10">
        {/* Topbar */}
        <header className="h-16 border-b cyber-card-border bg-deep-space/90 backdrop-blur-lg px-4 md:px-6 flex items-center justify-between hover-glow animate-slide-in-top relative z-10">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime touch-target hover-scale"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5 icon-wiggle" />
          </Button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 animate-fade-in stagger-delay-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-lime/60 group-hover:text-cyber-lime transition-colors duration-300" />
              <Input
                placeholder="Search..."
                className="pl-10 cyber-input bg-deep-space/50 border-electric-purple/30 text-mist-white placeholder:text-mist-white/50 focus:ring-cyber-lime hover-glow transition-all duration-300 group-hover:border-cyber-lime/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 animate-fade-in stagger-delay-2">
            <div className="hover-scale">
              <NotificationDropdown />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime touch-target hover-scale group">
                  <Avatar className="h-8 w-8 animate-glow-cycle">
                    <AvatarFallback className="bg-gradient-cyber text-deep-space group-hover:animate-pulse-slow">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline group-hover:text-cyber-lime transition-colors duration-300">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-deep-space/95 backdrop-blur-lg cyber-card-border animate-zoom-in">
                <DropdownMenuItem className="text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime touch-target hover-slide-right group">
                  <User className="mr-2 h-4 w-4 group-hover:icon-wiggle" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime touch-target hover-slide-right group">
                  <Settings className="mr-2 h-4 w-4 group-hover:icon-wiggle" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-electric-purple/30" />
                <DropdownMenuItem onClick={handleLogout} className="text-mist-white hover:bg-red-500/20 hover:text-red-400 touch-target hover-slide-right group">
                  <LogOut className="mr-2 h-4 w-4 group-hover:icon-flash" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-deep-space/30 responsive-padding overflow-auto cyber-grid-bg animate-fade-in stagger-delay-3 relative">
          <div className="max-w-7xl mx-auto animate-slide-in-bottom stagger-delay-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
