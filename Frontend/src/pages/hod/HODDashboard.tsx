import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';

const HODSidebar = () => (
  <div className="p-6 space-y-6">
    <div className="mb-8">
      <h2 className="text-xl font-bold">Project Nexus</h2>
      <p className="text-sm text-muted-foreground">HOD Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/hod/dashboard"
        end
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </NavLink>
      <NavLink
        to="/hod/students"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Users className="h-5 w-5" />
        Manage Students
      </NavLink>
      <NavLink
        to="/hod/approvals"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <CheckCircle className="h-5 w-5" />
        Pending Approvals
        <Badge variant="destructive" className="ml-auto">5</Badge>
      </NavLink>
      <NavLink
        to="/hod/reports"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <FileText className="h-5 w-5" />
        Reports
      </NavLink>
    </nav>
  </div>
);

const HODDashboard = () => {
  return (
    <DashboardLayout sidebar={<HODSidebar />}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Department Overview</h1>
          <p className="text-muted-foreground">Computer Science & Engineering</p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">420</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Placed</p>
                  <p className="text-3xl font-bold">287</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-xs text-secondary mt-2">68% placement rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Package</p>
                  <p className="text-3xl font-bold">₹12L</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-xs text-secondary mt-2">+15% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Student Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Student Approvals</span>
              <Badge variant="destructive">5 Pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Rahul Sharma', email: 'rahul.sharma@student.edu', cgpa: '8.5', date: '2 days ago' },
                { name: 'Priya Patel', email: 'priya.patel@student.edu', cgpa: '9.1', date: '3 days ago' },
                { name: 'Amit Kumar', email: 'amit.kumar@student.edu', cgpa: '7.8', date: '4 days ago' },
              ].map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">CGPA: {student.cgpa} • Applied {student.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placement Statistics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Placement Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Placed</span>
                  <span className="font-bold text-secondary">287 (68%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '68%' }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Process</span>
                  <span className="font-bold text-accent">85 (20%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '20%' }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unplaced</span>
                  <span className="font-bold text-muted-foreground">48 (12%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-muted-foreground" style={{ width: '12%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Recruiters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { company: 'Google', offers: 12 },
                  { company: 'Microsoft', offers: 10 },
                  { company: 'Amazon', offers: 8 },
                  { company: 'Infosys', offers: 45 },
                  { company: 'TCS', offers: 38 },
                ].map((recruiter, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{recruiter.company}</span>
                    <span className="font-bold">{recruiter.offers} offers</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;
