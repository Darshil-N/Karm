import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  Video,
  TrendingUp,
  Award,
  Calendar,
  Building
} from 'lucide-react';
import { ApplicationService, EnhancedDriveService, StudentService, Drive, StudentApplication } from '@/services/firebaseService';

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

const StudentDashboardContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for dynamic data
  const [studentApplications, setStudentApplications] = useState<StudentApplication[]>([]);
  const [recommendedDrives, setRecommendedDrives] = useState<Drive[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch student data and applications
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !user.studentId) return;
      
      try {
        setLoading(true);
        
        // Get student data
        const student = await StudentService.getStudentByStudentId(user.studentId);
        setStudentData(student);
        
        // Get student applications
        const applications = await ApplicationService.getStudentApplications(user.studentId);
        setStudentApplications(applications);
        
        // Get recommended drives based on student skills
        if (student && student.skillSet) {
          const recommended = await EnhancedDriveService.getRecommendedDrives(
            student.skillSet,
            student.branch,
            student.cgpa
          );
          setRecommendedDrives(recommended);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Check authentication
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    
    // Check if profile is completed (with fallback check)
    if (!user.profileCompleted && !user.approved) {
      // If not approved at all, redirect to pending approval
      navigate('/pending-approval');
      return;
    }
    
    // Only redirect to complete profile if not already there and profile not completed
    if (!user.profileCompleted && !location.pathname.includes('/complete-profile')) {
      navigate(`/complete-profile?studentId=${user.studentId}`);
      return;
    }
  }, [user, navigate, location]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'selected': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offer_received': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user || user.role !== 'student') {
    return <div>Redirecting to login...</div>;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-white/90">Ready to take the next step in your career journey?</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
            Student ID: {user.studentId}
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {user.university}
          </div>
          {studentData && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              CGPA: {studentData.cgpa}
            </div>
          )}
        </div>
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
                <span className="text-sm text-muted-foreground">
                  {studentData?.profileCompleted ? '100%' : '80%'}
                </span>
              </div>
              <Progress value={studentData?.profileCompleted ? 100 : 80} />
              <p className="text-xs text-muted-foreground mt-2">
                {studentData?.profileCompleted 
                  ? 'Profile completed! You\'re ready for applications.' 
                  : 'Complete your profile to increase visibility to recruiters'
                }
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/student/profile')}
            >
              {studentData?.profileCompleted ? 'View Profile' : 'Complete Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            My Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentApplications.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-500 mb-4">Start applying to placement drives to see your applications here</p>
              <Button onClick={() => navigate('/student/drives')}>
                Browse Placement Drives
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {studentApplications.slice(0, 3).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <Building className="h-8 w-8 text-gray-600" />
                    <div>
                      <p className="font-medium">{application.companyName} - {application.role}</p>
                      <p className="text-sm text-muted-foreground">{application.currentRound}</p>
                      <p className="text-xs text-gray-500">
                        Applied on {application.appliedAt?.toDate?.()?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                      {formatStatus(application.status)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 block"
                      onClick={() => {
                        // TODO: Implement application details modal
                        console.log('View application details:', application.id);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              {studentApplications.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/student/applications')} // TODO: Create applications page
                >
                  View All Applications ({studentApplications.length})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Drives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedDrives.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations</h3>
              <p className="text-gray-500 mb-4">Update your skills in profile to get personalized recommendations</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/student/profile')}
              >
                Update Skills
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedDrives.slice(0, 4).map((drive) => (
                <div key={drive.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">�</div>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                      {drive.status === 'active' ? 'Active' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1">{drive.companyName} - {drive.role}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {drive.package} • {drive.eligibility.minCGPA}+ CGPA
                  </p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Eligible Branches:</p>
                    <p className="text-xs font-medium">
                      {drive.eligibility.branches?.length > 0 
                        ? drive.eligibility.branches.join(', ') 
                        : 'All Branches'
                      }
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/student/drives`)}
                  >
                    View & Apply
                  </Button>
                </div>
              ))}
            </div>
          )}
          {recommendedDrives.length > 4 && (
            <div className="mt-4 text-center">
              <Button 
                variant="ghost"
                onClick={() => navigate('/student/drives')}
              >
                View All Drives
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StudentDashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === '/student' || location.pathname === '/student/' || location.pathname === '/student/dashboard';

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      {isDashboardHome ? <StudentDashboardContent /> : <Outlet />}
    </DashboardLayout>
  );
};

export default StudentDashboard;
