import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { StudentService } from '@/services/firebaseService';
import { createSamplePendingStudents } from '@/lib/sampleData';
import {
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PendingStudent {
  id: string;
  name: string;
  email: string;
  cgpa: number;
  branch: string;
  year?: string;
  phone?: string;
  appliedAt: any;
  studentId: string;
  status?: string;
  university?: string;
  hodEmail?: string;
}

interface HODAnalytics {
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  avgPackage: number;
  pendingApprovals: number;
  departmentName: string;
  universityName: string;
  topRecruiters: Array<{ company: string; offers: number }>;
  placementStatusBreakdown: {
    placed: number;
    inProcess: number;
    unplaced: number;
  };
}

const HODDashboardContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<HODAnalytics>({
    totalStudents: 0,
    placedStudents: 0,
    placementRate: 0,
    avgPackage: 0,
    pendingApprovals: 0,
    departmentName: 'Computer Science & Engineering',
    universityName: '',
    topRecruiters: [],
    placementStatusBreakdown: { placed: 0, inProcess: 0, unplaced: 0 }
  });
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        
        console.log('Loading dashboard data for HOD:', user.email);
        
        // Load analytics and pending students with HOD filtering
        const [analyticsData, pendingData] = await Promise.all([
          StudentService.getHODAnalytics(user.email),
          StudentService.getPendingStudents(user.email)
        ]);

        console.log('Analytics data:', analyticsData);
        console.log('Pending students data:', pendingData);

        setAnalytics(analyticsData);
        setPendingStudents(pendingData.slice(0, 3)); // Show only first 3 for dashboard
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Subscribe to real-time pending students updates for this HOD
    console.log('Setting up real-time subscription for HOD:', user?.email);
    const unsubscribe = StudentService.subscribeToPendingStudents((students) => {
      console.log('Real-time update - received pending students:', students);
      setPendingStudents(students.slice(0, 3));
      // Update pending count in analytics
      setAnalytics(prev => ({
        ...prev,
        pendingApprovals: students.length
      }));
    }, user?.email);

    return () => unsubscribe();
  }, [toast, user?.email]);

  const handleApproveStudent = async (studentId: string, studentName: string) => {
    try {
      await StudentService.approveStudent(studentId);
      toast({
        title: "Student Approved",
        description: `${studentName} has been approved successfully.`,
      });
    } catch (error) {
      console.error('Error approving student:', error);
      toast({
        title: "Error Approving Student",
        description: "Failed to approve student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectStudent = async (studentId: string, studentName: string) => {
    try {
      await StudentService.rejectStudent(studentId, "Rejected by HOD");
      toast({
        title: "Student Rejected",
        description: `${studentName}'s application has been rejected.`,
      });
    } catch (error) {
      console.error('Error rejecting student:', error);
      toast({
        title: "Error Rejecting Student",
        description: "Failed to reject student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTestData = async () => {
    if (!user?.email) return;
    
    try {
      console.log('Generating test data for HOD:', user.email);
      const result = await createSamplePendingStudents(user.email, analytics.universityName || 'Test University');
      console.log('Test data generation result:', result);
      
      if (result.success) {
        toast({
          title: "Test Data Created",
          description: "Sample pending students have been created for testing.",
        });
        
        // Manually reload the data to ensure it appears
        setTimeout(async () => {
          try {
            const pendingData = await StudentService.getPendingStudents(user.email);
            console.log('Reloaded pending data after test generation:', pendingData);
            setPendingStudents(pendingData.slice(0, 3));
            setAnalytics(prev => ({
              ...prev,
              pendingApprovals: pendingData.length
            }));
          } catch (error) {
            console.error('Error reloading data:', error);
          }
        }, 1000);
      } else {
        throw new Error('Failed to create test data');
      }
    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Error Creating Test Data",
        description: "Failed to create test data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'Unknown';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Chart data
  const placementStatusData = [
    { name: 'Placed', value: analytics.placementStatusBreakdown.placed, color: '#10B981' },
    { name: 'In Process', value: analytics.placementStatusBreakdown.inProcess, color: '#F59E0B' },
    { name: 'Unplaced', value: analytics.placementStatusBreakdown.unplaced, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Department Overview</h1>
        <p className="text-muted-foreground">
          {analytics.departmentName} {analytics.universityName && `• ${analytics.universityName}`}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{analytics.totalStudents}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Placed</p>
                <p className="text-3xl font-bold">{analytics.placedStudents}</p>
                <p className="text-xs text-green-600 mt-1">{analytics.placementRate.toFixed(1)}% placement rate</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Package</p>
                <p className="text-3xl font-bold">₹{analytics.avgPackage.toFixed(1)}L</p>
                <p className="text-xs text-green-600 mt-1">+15% from last year</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-3xl font-bold">{analytics.pendingApprovals}</p>
                <p className="text-xs text-orange-600 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Student Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Student Approvals
                <Badge variant="secondary">{analytics.pendingApprovals} Pending</Badge>
              </div>
              {/* Temporary test button for development */}
              {pendingStudents.length === 0 && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateTestData}
                    className="text-xs"
                  >
                    Generate Test Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        const allPending = await StudentService.getPendingStudents(); // No HOD filter
                        console.log('All pending students (no filter):', allPending);
                        toast({
                          title: "Debug Info",
                          description: `Found ${allPending.length} total pending students. Check console for details.`,
                        });
                      } catch (error) {
                        console.error('Debug error:', error);
                      }
                    }}
                    className="text-xs"
                  >
                    Debug DB
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Debug Info */}
            <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
              <div>User Email: {user?.email || 'Not logged in'}</div>
              <div>Pending Students Array Length: {pendingStudents.length}</div>
              <div>Analytics Pending Count: {analytics.pendingApprovals}</div>
              <div>Loading State: {loading.toString()}</div>
            </div>
            
            {pendingStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No pending approvals!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-2 border-b text-sm font-medium text-muted-foreground">
                  <div>Student</div>
                  <div>Academic Info</div>
                  <div>Application</div>
                  <div>Contact</div>
                  <div>Actions</div>
                </div>
                
                {/* Student Rows - Show only first 3 for dashboard */}
                {pendingStudents.slice(0, 3).map((student) => (
                  <div key={student.id} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {student.studentId}
                        </div>
                      </div>
                    </div>
                    
                    {/* Academic Info */}
                    <div className="space-y-1">
                      <div className="text-sm font-medium">CGPA: {student.cgpa}</div>
                      <div className="text-xs text-muted-foreground">
                        {student.branch || 'Computer Science'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.year || 'Final Year'}
                      </div>
                    </div>
                    
                    {/* Application Status */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">Applied {formatTimeAgo(student.appliedAt)}</span>
                      </div>
                      <Badge variant="outline" className="text-orange-600 text-xs">
                        Pending Review
                      </Badge>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-1">
                      <div className="text-xs truncate">{student.email}</div>
                      <div className="text-xs text-muted-foreground">{student.phone || 'N/A'}</div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRejectStudent(student.id, student.name)}
                        className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-8"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveStudent(student.id, student.name)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-8"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* View All Link */}
                {analytics.pendingApprovals > 3 && (
                  <div className="text-center pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/hod/approvals'}>
                      View All Pending Approvals ({analytics.pendingApprovals - 3} more)
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placement Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Placement Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementStatusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {placementStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Recruiters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Top Recruiters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topRecruiters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4" />
              <p>No recruitment data available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-5 gap-4">
              {analytics.topRecruiters.map((recruiter, index) => (
                <div key={recruiter.company} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {recruiter.company.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{recruiter.company}</h4>
                  <p className="text-xs text-muted-foreground">
                    {recruiter.offers} {recruiter.offers === 1 ? 'offer' : 'offers'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HODDashboardContent;