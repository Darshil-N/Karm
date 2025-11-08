import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService, ApplicationService } from '@/services/firebaseService';
import { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Building2, 
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Users,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react';

const MyResults = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [placementStatus, setPlacementStatus] = useState<any>({
    status: 'not-placed',
    totalApplications: 0,
    inProcess: 0,
    rejected: 0
  });

  // Load student data and applications from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user?.studentId) return;
      
      try {
        setLoading(true);
        
        // Load student data
        const student = await StudentService.getStudentByStudentId(user.studentId);
        setStudentData(student);
        
        // Load student applications
        const studentApplications = await ApplicationService.getStudentApplications(user.studentId);
        setApplications(studentApplications);
        
        // Check placement status from applications
        const placedApplication = studentApplications.find(app => app.status === 'selected' || app.status === 'offer_received');
        if (placedApplication) {
          setPlacementStatus({
            status: 'placed',
            company: placedApplication.companyName,
            role: placedApplication.role,
            package: 'Package details available',
            joinDate: 'TBD',
            offerDate: placedApplication.appliedAt.toDate ? placedApplication.appliedAt.toDate().toLocaleDateString() : 'N/A'
          });
        } else {
          const inProcessApps = studentApplications.filter(app => 
            app.status === 'applied' || app.status === 'in_progress' || app.status === 'interview_scheduled'
          );
          
          setPlacementStatus({
            status: inProcessApps.length > 0 ? 'in-process' : 'not-placed',
            totalApplications: studentApplications.length,
            inProcess: inProcessApps.length,
            rejected: studentApplications.filter(app => app.status === 'rejected').length
          });
        }
        
      } catch (error) {
        console.error('Error loading student results:', error);
        toast({
          title: "Error",
          description: "Failed to load your results",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  // Academic results calculated from Firebase student data
  const calculateAcademicResults = () => {
    if (!studentData) {
      return {
        currentCGPA: 0,
        totalCredits: 0,
        completedCredits: 0,
        rank: 0,
        totalStudents: 120,
        semesterGPA: []
      };
    }

    const { cgpa, year, academicDetails } = studentData;
    const currentYear = parseInt(year) || 1;
    const completedSemesters = currentYear * 2;
    
    // Generate semester-wise GPA based on current CGPA with some variation
    const semesterGPA = [];
    for (let i = 1; i <= Math.min(8, completedSemesters); i++) {
      const variation = (Math.random() - 0.5) * 0.4; // ±0.2 variation
      const semGPA = Math.max(0, Math.min(10, cgpa + variation));
      semesterGPA.push({
        semester: `Sem ${i}`,
        gpa: Math.round(semGPA * 100) / 100
      });
    }
    
    return {
      currentCGPA: cgpa,
      totalCredits: currentYear * 45, // Approximate credits per year
      completedCredits: Math.floor(currentYear * 40),
      rank: calculateRank(cgpa),
      totalStudents: 120,
      semesterGPA,
      tenthPercentage: academicDetails?.tenthPercentage || 0,
      twelfthPercentage: academicDetails?.twelfthPercentage || 0,
      backlogs: academicDetails?.backlogs || 0
    };
  };

  // Helper functions
  const calculateRank = (cgpa: number) => {
    // Estimate rank based on CGPA (higher CGPA = lower rank number)
    return Math.max(1, Math.floor((10 - cgpa) * 15));
  };

  const academicResults = calculateAcademicResults();

  // Convert Firebase applications to interview results format
  const getInterviewResults = () => {
    return applications.map((app, index) => ({
      id: app.id,
      company: app.companyName,
      role: app.role,
      date: app.appliedAt.toDate ? app.appliedAt.toDate().toLocaleDateString() : 'N/A',
      status: app.status,
      rounds: generateRoundsFromStatus(app.status, app.currentRound),
      feedback: generateFeedback(app.status),
      package: app.status === 'selected' || app.status === 'offer_received' ? 'Package disclosed after joining' : 'N/A'
    }));
  };

  // Helper function to generate rounds based on application status
  const generateRoundsFromStatus = (status: string, currentRound: string) => {
    const allRounds = [
      { name: 'Resume Screening', status: 'passed', score: 100 },
      { name: 'Online Assessment', status: 'not-attempted', score: 0 },
      { name: 'Technical Interview 1', status: 'not-attempted', score: 0 },
      { name: 'Technical Interview 2', status: 'not-attempted', score: 0 },
      { name: 'HR Round', status: 'not-attempted', score: 0 }
    ];

    // Update rounds based on current status
    if (status === 'applied') {
      return allRounds;
    } else if (status === 'in_progress') {
      allRounds[1] = { name: 'Online Assessment', status: 'passed', score: 75 + Math.random() * 20 };
      if (currentRound.includes('technical')) {
        allRounds[2] = { name: 'Technical Interview 1', status: 'passed', score: 80 + Math.random() * 15 };
      }
    } else if (status === 'interview_scheduled') {
      allRounds[1] = { name: 'Online Assessment', status: 'passed', score: 85 + Math.random() * 10 };
      allRounds[2] = { name: 'Technical Interview 1', status: 'scheduled', score: 0 };
    } else if (status === 'selected' || status === 'offer_received') {
      allRounds[1] = { name: 'Online Assessment', status: 'passed', score: Math.round(85 + Math.random() * 10) };
      allRounds[2] = { name: 'Technical Interview 1', status: 'passed', score: Math.round(88 + Math.random() * 8) };
      allRounds[3] = { name: 'Technical Interview 2', status: 'passed', score: Math.round(90 + Math.random() * 8) };
      allRounds[4] = { name: 'HR Round', status: 'passed', score: Math.round(95 + Math.random() * 5) };
    } else if (status === 'rejected') {
      const failedRoundIndex = Math.floor(Math.random() * 3) + 1; // Fail at random round
      for (let i = 1; i <= failedRoundIndex; i++) {
        if (i === failedRoundIndex) {
          allRounds[i].status = 'failed';
          allRounds[i].score = Math.round(40 + Math.random() * 20);
        } else {
          allRounds[i].status = 'passed';
          allRounds[i].score = Math.round(70 + Math.random() * 20);
        }
      }
    }

    return allRounds;
  };

  // Helper function to generate feedback based on status
  const generateFeedback = (status: string) => {
    const feedbacks = {
      applied: 'Application submitted successfully. Awaiting screening.',
      in_progress: 'Currently under review. Keep preparing for next rounds.',
      interview_scheduled: 'Interview scheduled. Best of luck!',
      selected: 'Congratulations! You have been selected. Excellent performance throughout.',
      offer_received: 'Offer received! Outstanding performance in all rounds.',
      rejected: 'Not selected this time. Keep improving and apply for other opportunities.'
    };
    return feedbacks[status as keyof typeof feedbacks] || 'Status update pending.';
  };

  const interviewResults = getInterviewResults();

  const [certifications] = useState([
    {
      id: 1,
      name: 'AWS Certified Developer Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-12-15',
      expiryDate: '2026-12-15',
      score: '92%',
      certificateUrl: '/certificates/aws-developer.pdf'
    },
    {
      id: 2,
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      issueDate: '2024-01-20',
      expiryDate: '2026-01-20',
      score: '88%',
      certificateUrl: '/certificates/gcp-architect.pdf'
    },
    {
      id: 3,
      name: 'React Developer Certification',
      issuer: 'Meta',
      issueDate: '2024-03-10',
      score: '95%',
      certificateUrl: '/certificates/react-dev.pdf'
    }
  ]);

  const [achievements] = useState([
    {
      id: 1,
      title: 'Dean\'s List',
      description: 'Achieved for maintaining CGPA above 8.5',
      date: '2024-05-15',
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Best Project Award',
      description: 'Won best project award for E-commerce Platform',
      date: '2024-04-20',
      category: 'Project'
    },
    {
      id: 3,
      title: 'Coding Competition Winner',
      description: 'First place in college coding competition',
      date: '2024-02-28',
      category: 'Competition'
    },
    {
      id: 4,
      title: 'Technical Paper Publication',
      description: 'Published paper on Machine Learning in IEEE conference',
      date: '2024-01-15',
      category: 'Research'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected':
      case 'passed':
        return 'text-green-600';
      case 'rejected':
      case 'failed':
        return 'text-red-600';
      case 'in-progress':
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected':
      case 'passed':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'in-progress':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleDownloadCertificate = (certName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${certName} certificate...`,
    });
  };

  const handleViewDetails = (type: string, id: number) => {
    toast({
      title: "View Details",
      description: `Opening detailed view for ${type}...`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && !studentData && (
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Unable to load your results. Please try again later.</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && studentData && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                My Results - {studentData.name}
              </h1>
              <p className="text-muted-foreground">Track your academic performance, placements, and achievements</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>

      {/* Placement Status Card */}
      {placementStatus && placementStatus.status === 'placed' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Congratulations! You're Placed!</h2>
                  <p className="text-green-700">
                    {placementStatus.role} at {placementStatus.company}
                  </p>
                  <p className="text-sm text-green-600">
                    Package: {placementStatus.package} • Joining: {new Date(placementStatus.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600">
                Placed
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current CGPA</p>
                    <p className="text-3xl font-bold">{academicResults.currentCGPA}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Rank: {academicResults.rank}/{academicResults.totalStudents}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="text-3xl font-bold">{interviewResults.length}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {interviewResults.filter(r => r.status === 'selected').length} Selected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certifications</p>
                    <p className="text-3xl font-bold">{certifications.length}</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Professional certs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-3xl font-bold">{achievements.length}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Awards & honors</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Credits Completed</span>
                      <span className="text-sm font-medium">
                        {academicResults.completedCredits}/{academicResults.totalCredits}
                      </span>
                    </div>
                    <Progress 
                      value={(academicResults.completedCredits / academicResults.totalCredits) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current CGPA</p>
                      <p className="text-lg font-semibold">{academicResults.currentCGPA}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Class Rank</p>
                      <p className="text-lg font-semibold">{academicResults.rank}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Placement Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {interviewResults.filter(r => r.status === 'selected').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Selected</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {interviewResults.filter(r => r.status === 'in-progress').length}
                      </p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {interviewResults.filter(r => r.status === 'rejected').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                  {placementStatus && placementStatus.status === 'placed' && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">Final Placement</p>
                      <p className="text-sm text-green-700">
                        {placementStatus.role} at {placementStatus.company}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Semester-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {academicResults.semesterGPA.map((sem, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{sem.semester}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32">
                            <Progress value={sem.gpa * 10} className="h-2" />
                          </div>
                          <span className="font-bold w-12 text-right">{sem.gpa}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{academicResults.currentCGPA}</div>
                      <p className="text-sm text-muted-foreground">Current CGPA</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Class Rank</span>
                        <span className="font-medium">{academicResults.rank}/{academicResults.totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Credits Completed</span>
                        <span className="font-medium">{academicResults.completedCredits}/{academicResults.totalCredits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Highest GPA</span>
                        <span className="font-medium">{Math.max(...academicResults.semesterGPA.map(s => s.gpa))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg GPA</span>
                        <span className="font-medium">
                          {(academicResults.semesterGPA.reduce((acc, s) => acc + s.gpa, 0) / academicResults.semesterGPA.length).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
          <div className="space-y-4">
            {interviewResults.map((interview) => (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {interview.company}
                      </CardTitle>
                      <p className="text-muted-foreground">{interview.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(interview.status)} border`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(interview.status)}
                          {interview.status.replace('-', ' ')}
                        </div>
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Rounds Progress */}
                    <div>
                      <h4 className="font-medium mb-3">Interview Rounds</h4>
                      <div className="space-y-2">
                        {interview.rounds.map((round, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(round.status)}
                              <span className="text-sm">{round.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {round.score > 0 && (
                                <span className="text-sm font-medium">{round.score}%</span>
                              )}
                              <Badge variant="outline" className={getStatusColor(round.status)}>
                                {round.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <h4 className="font-medium mb-2">Feedback</h4>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                        {interview.feedback}
                      </p>
                    </div>

                    {/* Package & Actions */}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">Package: </span>
                        <span className="font-medium">{interview.package}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails('interview', interview.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <p className="text-muted-foreground">{cert.issuer}</p>
                    </div>
                    <Badge variant="outline">
                      Score: {cert.score}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                      {cert.expiryDate && (
                        <div>
                          <p className="text-muted-foreground">Expiry Date</p>
                          <p className="font-medium">{new Date(cert.expiryDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadCertificate(cert.name)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails('certificate', cert.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{achievement.category}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
};

export default MyResults;