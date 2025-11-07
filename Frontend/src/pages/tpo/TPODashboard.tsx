import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2,
  FileText,
  TrendingUp,
  Users,
  Plus
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Placement Dashboard</h1>
            <p className="text-muted-foreground">Manage recruitment drives and student placements</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Drive
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Drives</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-secondary mt-2">+2 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Companies</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                  <p className="text-3xl font-bold">287</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-xs text-secondary mt-2">68% placement rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offers Rolled Out</p>
                  <p className="text-3xl font-bold">342</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Drives */}
        <Card>
          <CardHeader>
            <CardTitle>Active Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: 'Google', role: 'Software Engineer', applicants: 145, status: 'Round 2' },
                { company: 'Microsoft', role: 'Cloud Architect', applicants: 98, status: 'Round 1' },
                { company: 'Amazon', role: 'SDE-1', applicants: 120, status: 'Applications Open' },
              ].map((drive, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xl">
                      {drive.company[0]}
                    </div>
                    <div>
                      <p className="font-medium">{drive.company} - {drive.role}</p>
                      <p className="text-sm text-muted-foreground">{drive.applicants} applicants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-secondary">{drive.status}</span>
                    <Button size="sm">Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">Create New Drive</h3>
              <p className="text-sm text-muted-foreground">Add a new placement drive</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">AI Resume Parser</h3>
              <p className="text-sm text-muted-foreground">Upload and parse resumes</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">Send Bulk Email</h3>
              <p className="text-sm text-muted-foreground">Communicate with students</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TPODashboard;
