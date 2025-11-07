import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Video,
  TrendingUp,
  Award
} from 'lucide-react';

const StudentSidebar = () => (
  <div className="p-6 space-y-6">
    <div className="mb-8">
      <h2 className="text-xl font-bold">Project Nexus</h2>
      <p className="text-sm text-muted-foreground">Student Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/student/dashboard"
        end
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <LayoutDashboard className="h-5 w-5" />
        Dashboard
      </NavLink>
      <NavLink
        to="/student/profile"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <User className="h-5 w-5" />
        My Profile
      </NavLink>
      <NavLink
        to="/student/drives"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Briefcase className="h-5 w-5" />
        Placement Drives
      </NavLink>
      <NavLink
        to="/student/ai-resume"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <FileText className="h-5 w-5" />
        AI Resume Builder
      </NavLink>
      <NavLink
        to="/student/ai-interview"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Video className="h-5 w-5" />
        AI Mock Interview
      </NavLink>
      <NavLink
        to="/student/results"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Award className="h-5 w-5" />
        My Results
      </NavLink>
    </nav>
  </div>
);

const StudentDashboard = () => {
  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="gradient-primary rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-white/90">Ready to take the next step in your career journey?</p>
        </div>

        {/* Profile Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              My Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <Progress value={80} />
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to increase visibility to recruiters
                </p>
              </div>
              <Button variant="outline" className="w-full">Complete Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* My Applications */}
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Google - Software Engineer</p>
                  <p className="text-sm text-muted-foreground">Technical Round 2</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">In Progress</p>
                  <Button size="sm" className="mt-2">View Details</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Microsoft - Cloud Architect</p>
                  <p className="text-sm text-muted-foreground">HR Round</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-accent">Scheduled</p>
                  <Button size="sm" className="mt-2">View Details</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Drives */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">🔍</div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">New</span>
                </div>
                <h3 className="font-bold mb-1">Amazon - SDE-1</h3>
                <p className="text-sm text-muted-foreground mb-3">₹20 LPA • 7.0+ CGPA</p>
                <Button size="sm" className="w-full">View & Apply</Button>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">💻</div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Trending</span>
                </div>
                <h3 className="font-bold mb-1">Infosys - Specialist Programmer</h3>
                <p className="text-sm text-muted-foreground mb-3">₹9 LPA • 6.5+ CGPA</p>
                <Button size="sm" className="w-full">View & Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
