import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { StudentService } from '@/services/firebaseService';
import { 
  Search, 
  Filter, 
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Eye,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';

interface PendingStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  cgpa: number;
  studentId: string;
  appliedAt: any;
  status: string;
  location?: string;
  skillSet?: string[];
  marks10th?: number;
  marks12th?: number;
  linkedinProfile?: string;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  achievements?: string[];
}

const PendingApprovals = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get current HOD user
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<PendingStudent | null>(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [studentToReject, setStudentToReject] = useState<PendingStudent | null>(null);

  // Load pending students from Firebase filtered by HOD email
  useEffect(() => {
    const loadPendingStudents = async () => {
      try {
        setLoading(true);
        // Only load students for this HOD's university
        const studentsData = await StudentService.getPendingStudents(user?.email);
        setPendingStudents(studentsData);
      } catch (error) {
        console.error('Error loading pending students:', error);
        toast({
          title: "Error Loading Students",
          description: "Failed to load pending students. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPendingStudents();

    // Subscribe to real-time updates filtered by HOD email
    const unsubscribe = StudentService.subscribeToPendingStudents((studentsData) => {
      setPendingStudents(studentsData);
    }, user?.email);

    return () => unsubscribe();
  }, [toast, user?.email]); // Add user.email as dependency

  // Filter students based on search and filters
  const filteredStudents = pendingStudents.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  // Get unique branches
  const branches = [...new Set(pendingStudents.map(s => s.branch).filter(Boolean))];

  const handleApproveStudent = async (student: PendingStudent) => {
    try {
      await StudentService.approveStudent(student.id);
      toast({
        title: "Student Approved Successfully",
        description: `${student.name} (${student.studentId}) from ${student.university} has been approved and can now login to access the portal.`,
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

  const handleRejectStudent = async () => {
    if (!studentToReject) return;

    try {
      await StudentService.rejectStudent(studentToReject.id, rejectionReason);
      toast({
        title: "Student Rejected",
        description: `${studentToReject.name}'s application has been rejected.`,
      });
      
      setRejectDialogOpen(false);
      setRejectionReason('');
      setStudentToReject(null);
    } catch (error) {
      console.error('Error rejecting student:', error);
      toast({
        title: "Error Rejecting Student",
        description: "Failed to reject student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewStudent = (student: PendingStudent) => {
    setSelectedStudent(student);
    setStudentDetailOpen(true);
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

  const openRejectDialog = (student: PendingStudent) => {
    setStudentToReject(student);
    setRejectDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pending Approvals</h1>
          <p className="text-muted-foreground">
            ({filteredStudents.length} pending approval{filteredStudents.length !== 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-2">
            <Clock className="h-4 w-4" />
            {pendingStudents.length} Total Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or student ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by Branch:</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedBranch === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBranch('all')}
                >
                  All Branches
                </Button>
                {branches.map(branch => (
                  <Button
                    key={branch}
                    variant={selectedBranch === branch ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedBranch(branch)}
                  >
                    {branch}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Students Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-20">
              {pendingStudents.length === 0 ? (
                <>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Pending Approvals</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All student applications have been processed.
                  </p>
                </>
              ) : (
                <>
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Application Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {student.studentId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">CGPA: {student.cgpa}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.branch}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.year}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-sm">Applied {formatTimeAgo(student.appliedAt)}</span>
                        </div>
                        <Badge variant="outline" className="text-orange-600">
                          Pending Review
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{student.email}</div>
                        <div className="text-sm text-muted-foreground">{student.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openRejectDialog(student)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveStudent(student)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={studentDetailOpen} onOpenChange={setStudentDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Application Details</DialogTitle>
            <DialogDescription>
              Review the complete student application before making a decision.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedStudent.studentId} • {selectedStudent.branch}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    Applied {formatTimeAgo(selectedStudent.appliedAt)}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
                    <p><strong>Branch:</strong> {selectedStudent.branch}</p>
                    <p><strong>Year:</strong> {selectedStudent.year}</p>
                    {selectedStudent.marks10th && (
                      <p><strong>10th Marks:</strong> {selectedStudent.marks10th}%</p>
                    )}
                    {selectedStudent.marks12th && (
                      <p><strong>12th Marks:</strong> {selectedStudent.marks12th}%</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                    <p><strong>Location:</strong> {selectedStudent.location || 'N/A'}</p>
                    {selectedStudent.linkedinProfile && (
                      <p>
                        <strong>LinkedIn:</strong>{' '}
                        <a 
                          href={selectedStudent.linkedinProfile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedStudent.skillSet && selectedStudent.skillSet.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skillSet.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.projects && selectedStudent.projects.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Projects</h4>
                  <div className="space-y-3">
                    {selectedStudent.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md">
                        <h5 className="font-medium">{project.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.achievements && selectedStudent.achievements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Achievements</h4>
                  <ul className="space-y-1">
                    {selectedStudent.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => openRejectDialog(selectedStudent)}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <UserX className="h-4 w-4" />
                  Reject Application
                </Button>
                <Button 
                  onClick={() => {
                    handleApproveStudent(selectedStudent);
                    setStudentDetailOpen(false);
                  }}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserCheck className="h-4 w-4" />
                  Approve Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Reject Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {studentToReject?.name}'s application? 
              Please provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setRejectionReason('');
              setStudentToReject(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectStudent}
              className="bg-red-600 hover:bg-red-700"
              disabled={!rejectionReason.trim()}
            >
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PendingApprovals;