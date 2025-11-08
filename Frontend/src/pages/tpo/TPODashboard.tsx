import DashboardLayout from '@/components/DashboardLayout';
import { NavLink } from '@/components/NavLink';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2,
  FileText,
  Users
} from 'lucide-react';

const TPOSidebar = () => (
  <div className="p-6 space-y-6">
    <div className="mb-8 animate-slide-in-left">
      <h2 className="text-xl font-bold text-mist-white">Project Nexus</h2>
      <p className="text-sm text-cyber-lime/80">TPO Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/tpo/dashboard"
        end
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-1"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <LayoutDashboard className="h-5 w-5 group-hover:icon-wiggle" />
        Dashboard
      </NavLink>
      <NavLink
        to="/tpo/drives"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-2"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Briefcase className="h-5 w-5 group-hover:icon-wiggle" />
        Manage Drives
      </NavLink>
      <NavLink
        to="/tpo/companies"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-3"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Building2 className="h-5 w-5 group-hover:icon-wiggle" />
        Companies
      </NavLink>
      <NavLink
        to="/tpo/students"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-4"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Users className="h-5 w-5 group-hover:icon-wiggle" />
        Students
      </NavLink>
      <NavLink
        to="/tpo/reports"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-5"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <FileText className="h-5 w-5 group-hover:icon-wiggle" />
        Reports
      </NavLink>
    </nav>
  </div>
);

const TPODashboard = () => {
  return (
    <DashboardLayout sidebar={<TPOSidebar />}>
      <Outlet />
    </DashboardLayout>
  );
};

export default TPODashboard;
