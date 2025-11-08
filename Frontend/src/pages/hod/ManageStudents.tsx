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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { StudentService, Student } from '@/services/firebaseService';
import { 
  Search, 
  Filter, 
  Eye,
  Download,
  Users,
  Building2,
  TrendingUp,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ManageStudents = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);

  // Load students from Firebase
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await StudentService.getAllStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error loading students:', error);
        toast({
          title: "Error Loading Students",
          description: "Failed to load students. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();

    // Subscribe to real-time updates
    const unsubscribe = StudentService.subscribeToStudents((studentsData) => {
      setStudents(studentsData);
    });

    return () => unsubscribe();
  }, [toast]);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;
    const matchesStatus = selectedStatus === 'all' || student.placementStatus === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Get unique values for filters
  const branches = [...new Set(students.map(s => s.branch).filter(Boolean))];
  const statuses = [...new Set(students.map(s => s.placementStatus).filter(Boolean))];

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentDetailOpen(true);
  };

  const exportStudentsToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Students Report', 20, 20);
    
    // Add summary
    doc.setFontSize(12);
    const placedCount = filteredStudents.filter(s => s.placementStatus === 'Placed').length;
    const placementRate = filteredStudents.length > 0 ? (placedCount / filteredStudents.length * 100).toFixed(1) : '0';
    
    doc.text(`Total Students: ${filteredStudents.length}`, 20, 40);
    doc.text(`Placed Students: ${placedCount}`, 20, 50);
    doc.text(`Placement Rate: ${placementRate}%`, 20, 60);

    // Add table
    const tableData = filteredStudents.map(student => [
      student.name,
      student.studentId,
      student.branch,
      student.year,
      student.cgpa.toString(),
      student.placementStatus,
      student.company || 'N/A',
      student.package || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Name', 'ID', 'Branch', 'Year', 'CGPA', 'Status', 'Company', 'Package']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('students-report.pdf');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-green-100 text-green-800';
      case 'In Process':
        return 'bg-blue-100 text-blue-800';
      case 'Unplaced':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalStudents = filteredStudents.length;
  const placedStudents = filteredStudents.filter(s => s.placementStatus === 'Placed').length;
  const placementRate = totalStudents > 0 ? (placedStudents / totalStudents * 100) : 0;
  const averageCGPA = totalStudents > 0 ? 
    filteredStudents.reduce((sum, s) => sum + s.cgpa, 0) / totalStudents : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Students</h1>
          <p className="text-muted-foreground">
            View and manage student information and placement status
          </p>
        </div>
        <Button onClick={exportStudentsToPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Placed Students</p>
                <p className="text-2xl font-bold">{placedStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
                <p className="text-2xl font-bold">{placementRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg CGPA</p>
                <p className="text-2xl font-bold">{averageCGPA.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-20">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Placement Status</TableHead>
                  <TableHead>Activity</TableHead>
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
                            {student.studentId} • {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">CGPA: {student.cgpa}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.branch} • {student.year}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge className={getStatusColor(student.placementStatus)}>
                          {student.placementStatus}
                        </Badge>
                        {student.company && (
                          <div className="text-sm text-muted-foreground">
                            {student.company}
                          </div>
                        )}
                        {student.package && (
                          <div className="text-sm font-medium text-green-600">
                            ₹{student.package}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>Applications: {student.applications}</div>
                        <div>Interviews: {student.interviews}</div>
                        <div>Offers: {student.offers}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information about the student and their placement journey.
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
                    {selectedStudent.studentId} • {selectedStudent.branch} • {selectedStudent.year}
                  </p>
                  <Badge className={getStatusColor(selectedStudent.placementStatus)} variant="outline">
                    {selectedStudent.placementStatus}
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
                    <p><strong>Registration:</strong> {formatDate(selectedStudent.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedStudent.phone}</span>
                    </div>
                    {selectedStudent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedStudent.location}</span>
                      </div>
                    )}
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

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Placement Activity</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Applications:</strong> {selectedStudent.applications}</p>
                    <p><strong>Interviews:</strong> {selectedStudent.interviews}</p>
                    <p><strong>Offers:</strong> {selectedStudent.offers}</p>
                  </div>
                </div>

                {selectedStudent.placementStatus === 'Placed' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Placement Details</h4>
                    <div className="space-y-2 text-sm">
                      {selectedStudent.company && (
                        <p><strong>Company:</strong> {selectedStudent.company}</p>
                      )}
                      {selectedStudent.package && (
                        <p><strong>Package:</strong> ₹{selectedStudent.package}</p>
                      )}
                      {selectedStudent.location && (
                        <p><strong>Location:</strong> {selectedStudent.location}</p>
                      )}
                    </div>
                  </div>
                )}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudents;