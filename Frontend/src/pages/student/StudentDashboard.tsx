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
    <div className="mb-8 animate-slide-in-left">
      <h2 className="text-xl font-bold text-mist-white">Project Nexus</h2>
      <p className="text-sm text-cyber-lime/80">Student Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/student/dashboard"
        end
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-1"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <LayoutDashboard className="h-5 w-5 group-hover:icon-wiggle" />
        Dashboard
      </NavLink>
      <NavLink
        to="/student/profile"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-2"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <User className="h-5 w-5 group-hover:icon-wiggle" />
        My Profile
      </NavLink>
      <NavLink
        to="/student/drives"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-3"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Briefcase className="h-5 w-5 group-hover:icon-wiggle" />
        Placement Drives
      </NavLink>
      <NavLink
        to="/student/ai-resume"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-4"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <FileText className="h-5 w-5 group-hover:icon-wiggle" />
        AI Resume Builder
      </NavLink>
      <NavLink
        to="/student/ai-interview"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-5"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Video className="h-5 w-5 group-hover:icon-wiggle" />
        AI Mock Interview
      </NavLink>
      <NavLink
        to="/student/results"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-mist-white hover:bg-electric-purple/20 hover:text-cyber-lime border border-transparent hover:border-cyber-lime/30 group animate-slide-in-left stagger-delay-6"
        activeClassName="bg-electric-purple/30 text-cyber-lime border-cyber-lime/50"
      >
        <Award className="h-5 w-5 group-hover:icon-wiggle" />
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
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Banner */}
      <div className="hero-cyber-bg rounded-lg responsive-padding text-foreground shadow-cyber particles-bg relative overflow-hidden hover-glow">
        <h1 className="responsive-text-3xl font-bold mb-2 text-foreground text-shimmer">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mb-4">Ready to take the next step in your career journey?</p>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 relative z-10">
          <div className="bg-accent/20 px-3 py-1 rounded-full text-sm text-accent cyber-pulse">
            Student ID: {user.studentId}
          </div>
          <div className="bg-accent/20 px-3 py-1 rounded-full text-sm text-accent">
            {user.university}
          </div>
          {studentData && (
            <div className="bg-accent/20 px-3 py-1 rounded-full text-sm text-accent">
              CGPA: {studentData.cgpa}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Profile Status */}
        <Card className="cyber-card circuit-pattern hover-glow-intense animate-fade-in stagger-delay-1 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-mist-white responsive-text-xl group-hover:text-cyber-lime transition-colors duration-300">
              <TrendingUp className="h-5 w-5 text-cyber-lime group-hover:icon-heartbeat" />
              My Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-mist-white">Profile Completion</span>
                  <span className="text-sm text-cyber-lime/80 animate-pulse-slow">
                    {studentData?.profileCompleted ? '100%' : '80%'}
                  </span>
                </div>
                <Progress value={studentData?.profileCompleted ? 100 : 80} className="progress-animated hover-glow" />
                <p className="text-xs text-mist-white/70 mt-2 group-hover:text-mist-white transition-colors duration-300">
                  {studentData?.profileCompleted 
                    ? 'Profile completed! You\'re ready for applications.' 
                    : 'Complete your profile to increase visibility to recruiters'
                  }
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-cyber-lime text-cyber-lime hover:bg-cyber-lime hover:text-deep-space btn-wave hover-scale transition-all duration-300"
                onClick={() => navigate('/student/profile')}
              >
                {studentData?.profileCompleted ? 'View Profile' : 'Complete Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Applications */}
        <Card className="cyber-card circuit-pattern hover-glow-intense animate-fade-in stagger-delay-2 group">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-mist-white responsive-text-xl group-hover:text-electric-purple transition-colors duration-300">
              <Briefcase className="h-5 w-5 text-electric-purple group-hover:icon-wiggle" />
              My Applications
            </CardTitle>
          </CardHeader>
        <CardContent>
          {studentApplications.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <Briefcase className="h-12 w-12 text-cyber-lime/60 mx-auto mb-4 animate-bounce-gentle" />
              <h3 className="text-lg font-medium text-mist-white mb-2">No Applications Yet</h3>
              <p className="text-mist-white/70 mb-4">Start applying to placement drives to see your applications here</p>
              <Button 
                onClick={() => navigate('/student/drives')}
                className="bg-gradient-cyber hover:bg-gradient-cyber/90 text-deep-space btn-wave hover-scale"
              >
                Browse Placement Drives
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {studentApplications.slice(0, 3).map((application, index) => (
                <div 
                  key={application.id} 
                  className={`flex items-center justify-between p-4 bg-electric-purple/10 rounded-lg border border-electric-purple/30 hover:border-cyber-lime/50 hover:bg-electric-purple/20 transition-all duration-300 hover-scale-sm animate-slide-in-left stagger-delay-${index + 1} group`}
                >
                  <div className="flex items-center gap-4">
                    <Building className="h-8 w-8 text-cyber-lime group-hover:icon-wiggle" />
                    <div>
                      <p className="font-medium text-mist-white group-hover:text-cyber-lime transition-colors duration-300">
                        {application.companyName} - {application.role}
                      </p>
                      <p className="text-sm text-electric-purple">{application.currentRound}</p>
                      <p className="text-xs text-mist-white/60">
                        Applied on {application.appliedAt?.toDate?.()?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full animate-pulse-slow ${getStatusColor(application.status)}`}>
                      {formatStatus(application.status)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 block border-cyber-lime/50 text-cyber-lime hover:bg-cyber-lime hover:text-deep-space hover-scale"
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
                  className="w-full text-electric-purple hover:text-cyber-lime hover:bg-electric-purple/20 hover-slide-right"
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
      <Card className="cyber-card circuit-pattern hover-glow-intense animate-fade-in stagger-delay-3 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-mist-white group-hover:text-cyber-lime transition-colors duration-300">
            <Award className="h-5 w-5 text-cyber-lime group-hover:icon-heartbeat" />
            Recommended For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedDrives.length === 0 ? (
            <div className="text-center py-8 animate-fade-in">
              <Award className="h-12 w-12 text-electric-purple/60 mx-auto mb-4 animate-float" />
              <h3 className="text-lg font-medium text-mist-white mb-2">No Recommendations</h3>
              <p className="text-mist-white/70 mb-4">Update your skills in profile to get personalized recommendations</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/student/profile')}
                className="border-electric-purple text-electric-purple hover:bg-electric-purple hover:text-deep-space hover-scale"
              >
                Update Skills
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedDrives.slice(0, 4).map((drive, index) => (
                <div 
                  key={drive.id} 
                  className={`border cyber-card-border rounded-lg p-4 bg-electric-purple/5 hover:bg-electric-purple/10 hover:border-cyber-lime/50 transition-all duration-300 hover-scale-sm animate-slide-in-bottom stagger-delay-${index + 1} group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl animate-bounce-gentle">🏢</div>
                    <span className={`text-xs px-2 py-1 rounded animate-pulse-slow ${
                      drive.status === 'active' 
                        ? 'bg-cyber-lime/20 text-cyber-lime' 
                        : 'bg-electric-purple/20 text-electric-purple'
                    }`}>
                      {drive.status === 'active' ? 'Active' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1 text-mist-white group-hover:text-cyber-lime transition-colors duration-300">
                    {drive.companyName} - Software Developer
                  </h3>
                  <p className="text-sm text-cyber-lime/80 mb-3">
                    LPA 8-12 • 7.0+ CGPA
                  </p>
                  <div className="mb-3">
                    <p className="text-xs text-mist-white/60 mb-1">Eligible Branches:</p>
                    <p className="text-xs font-medium text-electric-purple">
                      CS, IT, ECE
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-cyber hover:bg-gradient-cyber/90 text-deep-space btn-wave hover-scale"
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
