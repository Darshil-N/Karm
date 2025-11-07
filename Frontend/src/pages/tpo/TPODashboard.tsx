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
    <div className="mb-8">
      <h2 className="text-xl font-bold">Project Nexus</h2>
      <p className="text-sm text-muted-foreground">TPO Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/tpo/dashboard"
        end
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </NavLink>
      <NavLink
        to="/tpo/drives"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Briefcase className="h-5 w-5" />
        Manage Drives
      </NavLink>
      <NavLink
        to="/tpo/companies"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Building2 className="h-5 w-5" />
        Companies
      </NavLink>
      <NavLink
        to="/tpo/students"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Users className="h-5 w-5" />
        Students
      </NavLink>
      <NavLink
        to="/tpo/reports"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <FileText className="h-5 w-5" />
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
