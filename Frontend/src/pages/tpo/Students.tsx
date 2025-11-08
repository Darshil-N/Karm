import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { StudentService, Student } from '@/services/firebaseService';
import { sendBulkEmailFree, EmailData } from '@/lib/emailService';
import { 
  Search,
  Filter,
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Send,
  FileText
} from 'lucide-react';
import StudentProfileModal from '@/components/modals/StudentProfileModal_new';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Students = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCGPA, setSelectedCGPA] = useState<string>('all');
  const [studentProfileOpen, setStudentProfileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students from Firebase on component mount
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

  const handleExportData = () => {
    toast({
      title: "Generating PDF",
      description: "Creating student data PDF report...",
    });

    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text('Student Placement Report', 20, 20);
      
      // Add generation date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      doc.text(`Total Students: ${filteredStudents.length}`, 20, 35);
      
      // Prepare table data
      const tableData = filteredStudents.map(student => [
        student.name,
        student.email,
        student.branch,
        student.year,
        student.cgpa.toString(),
        student.placementStatus,
        student.company || 'N/A',
        student.package || 'N/A',
        (student.skillSet || []).slice(0, 3).join(', ') + ((student.skillSet || []).length > 3 ? '...' : '')
      ]);

      // Add table
      autoTable(doc, {
        head: [['Name', 'Email', 'Branch', 'Year', 'CGPA', 'Status', 'Company', 'Package', 'Skills']],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Name
          1: { cellWidth: 35 }, // Email
          2: { cellWidth: 20 }, // Branch
          3: { cellWidth: 15 }, // Year
          4: { cellWidth: 12 }, // CGPA
          5: { cellWidth: 18 }, // Status
          6: { cellWidth: 20 }, // Company
          7: { cellWidth: 18 }, // Package
          8: { cellWidth: 25 }, // Skills
        },
      });

      // Add summary statistics
      const placedCount = filteredStudents.filter(s => s.placementStatus === 'Placed').length;
      const placementRate = ((placedCount / filteredStudents.length) * 100).toFixed(1);
      const avgPackage = filteredStudents
        .filter(s => s.package && s.package !== 'N/A')
        .map(s => parseFloat(s.package.replace(/[₹,LPA\s]/g, '')))
        .reduce((sum, val, _, arr) => sum + val / arr.length, 0)
        .toFixed(1);

      const finalY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text('Summary Statistics:', 20, finalY);
      
      doc.setFontSize(10);
      doc.text(`Placement Rate: ${placementRate}%`, 20, finalY + 10);
      doc.text(`Average Package: ₹${avgPackage} LPA`, 20, finalY + 16);
      doc.text(`Placed Students: ${placedCount}`, 20, finalY + 22);
      doc.text(`Total Applications: ${filteredStudents.reduce((sum, s) => sum + s.applications, 0)}`, 20, finalY + 28);

      // Save the PDF
      const fileName = `students_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Generated Successfully",
        description: `Student report has been downloaded as ${fileName}`,
      });

    } catch (error) {
      toast({
        title: "Error Generating PDF",
        description: "There was an error creating the PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkActions = () => {
    setBulkActionOpen(true);
  };

  const handleBulkEmail = async () => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to send bulk email.",
        variant: "destructive",
      });
      return;
    }

    const selectedStudentList = filteredStudents.filter(student => selectedStudents.has(student.id));
    const emails = selectedStudentList.map(s => s.email).filter(Boolean);

    const emailSubject = "Placement Updates from TPO";
    const emailBody = `Dear Student,\n\nWe have important placement updates for you.\n\nPlease check your placement portal for more details.\n\nBest regards,\nTPO Office`;

    const emailData: EmailData = {
      to: emails,
      subject: emailSubject,
      message: emailBody,
      from: 'no-reply@college.edu',
      senderName: 'TPO Office'
    };

    try {
      toast({ title: 'Sending Emails', description: `Sending emails to ${emails.length} students...` });

      const result = await sendBulkEmailFree(emailData);

      if (result.success) {
        toast({ title: 'Emails Sent', description: `Successfully sent emails to ${result.sentCount} students.` });
        setSelectedStudents(new Set());
        setBulkActionOpen(false);
      } else {
        toast({ title: 'Email Send Failed', description: `Failed to send emails. ${result.errors?.slice(0,2).join('; ')}`, variant: 'destructive' });
      }
    } catch (error) {
      console.error('Bulk email error:', error);
      toast({ title: 'Error Sending Emails', description: 'There was an error sending bulk emails. Check configuration.', variant: 'destructive' });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to update status.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updates = Array.from(selectedStudents).map(studentId => ({
        id: studentId,
        data: { placementStatus: newStatus as any }
      }));

      await StudentService.bulkUpdateStudents(updates);

      toast({
        title: "Status Updated",
        description: `${selectedStudents.size} students' status updated to ${newStatus}.`,
      });

      setSelectedStudents(new Set());
      setBulkActionOpen(false);
    } catch (error) {
      console.error('Error updating student status:', error);
      toast({
        title: "Error Updating Status",
        description: "Failed to update student status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectStudent = (studentId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedStudents);
    if (isSelected) {
      newSelected.add(studentId);
    } else {
      newSelected.delete(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setStudentProfileOpen(true);
  };

  const handleDownloadResume = async (studentId: string, studentName: string) => {
    toast({
      title: "Download Resume",
      description: `Preparing ${studentName}'s resume PDF...`,
    });

    try {
      const student = await StudentService.getStudentById(studentId);
      if (!student) throw new Error('Student not found');

      // Generate PDF similar to StudentProfileModal
      const doc = new jsPDF();
      doc.setFontSize(24);
      doc.setTextColor(40);
      doc.text(student.name || studentName, 20, 25);

      doc.setFontSize(12);
      doc.setTextColor(100);
      if (student.email) doc.text(student.email, 20, 35);
      if (student.phone) doc.text(student.phone, 20, 42);
      if (student.location) doc.text(student.location, 20, 49);

      // Education
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Education', 20, 65);
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text(`${student.branch || ''} - ${student.year || ''}`, 20, 75);
      doc.text(`CGPA: ${student.cgpa ?? 'N/A'}`, 20, 82);

      // Skills
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text('Skills', 20, 100);
      doc.setFontSize(12);
      doc.setTextColor(60);
      const skillsText = (student.skillSet || []).join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, 110);

      // Projects
      if (student.academicDetails?.projects && student.academicDetails.projects.length > 0) {
        let yPosition = 130;
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Projects', 20, yPosition);
        student.academicDetails.projects.forEach((project, index) => {
          yPosition += 15;
          doc.setFontSize(14);
          doc.setTextColor(60);
          doc.text(`${index + 1}. ${project.title}`, 20, yPosition);

          yPosition += 8;
          doc.setFontSize(10);
          doc.setTextColor(80);
          const descLines = doc.splitTextToSize(project.description || '', 170);
          doc.text(descLines, 25, yPosition);
          yPosition += (descLines.length * 5) + 6;
        });
      }

      // Placement info
      if (student.placementStatus === 'Placed' && student.company) {
        const placementY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 220;
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text('Placement Details', 20, placementY);
        doc.setFontSize(12);
        doc.setTextColor(60);
        doc.text(`Company: ${student.company}`, 20, placementY + 12);
        if (student.package) doc.text(`Package: ${student.package}`, 20, placementY + 19);
        doc.text(`Status: ${student.placementStatus}`, 20, placementY + 26);
      }

      const fileName = `${(student.name || studentName).replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(fileName);

      toast({ title: 'Resume Downloaded', description: `${studentName}'s resume PDF has been downloaded.` });
    } catch (error) {
      console.error('Error downloading resume as PDF:', error);
      toast({ title: 'Error', description: 'Failed to generate/download resume PDF', variant: 'destructive' });
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    // Removed for TPO - no edit access
  };

  const handleEditStudent = (student: Student) => {
    // Removed for TPO - no edit access
    toast({
      title: "Access Restricted",
      description: "TPO cannot edit student profiles. Please contact the student directly.",
      variant: "destructive",
    });
  };

  // Get unique values for filter dropdowns
  const branches = useMemo(() => {
    const uniqueBranches = [...new Set(students.map(s => s.branch).filter(Boolean))];
    return ['all', ...uniqueBranches];
  }, [students]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(students.map(s => s.year).filter(Boolean))];
    return ['all', ...uniqueYears];
  }, [students]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(students.map(s => s.placementStatus).filter(Boolean))];
    return ['all', ...uniqueStatuses];
  }, [students]);

  const cgpaRanges = ['all', '9.0+', '8.0-8.9', '7.0-7.9', '6.0-6.9', 'Below 6.0'];

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.skillSet || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      // Branch filter
      const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;

      // Year filter
      const matchesYear = selectedYear === 'all' || student.year === selectedYear;

      // Status filter
      const matchesStatus = selectedStatus === 'all' || student.placementStatus === selectedStatus;

      // CGPA filter
      let matchesCGPA = true;
      if (selectedCGPA !== 'all') {
        const cgpa = student.cgpa;
        switch (selectedCGPA) {
          case '9.0+':
            matchesCGPA = cgpa >= 9.0;
            break;
          case '8.0-8.9':
            matchesCGPA = cgpa >= 8.0 && cgpa < 9.0;
            break;
          case '7.0-7.9':
            matchesCGPA = cgpa >= 7.0 && cgpa < 8.0;
            break;
          case '6.0-6.9':
            matchesCGPA = cgpa >= 6.0 && cgpa < 7.0;
            break;
          case 'Below 6.0':
            matchesCGPA = cgpa < 6.0;
            break;
        }
      }

      return matchesSearch && matchesBranch && matchesYear && matchesStatus && matchesCGPA;
    });
  }, [students, searchTerm, selectedBranch, selectedYear, selectedStatus, selectedCGPA]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Students</h1>
          <p className="text-muted-foreground">Manage student profiles, placement status, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportData}>
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button className="gap-2" onClick={handleBulkActions}>
            <Users className="h-4 w-4" />
            Bulk Actions ({selectedStudents.size})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
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
                <p className="text-sm text-muted-foreground">Placed</p>
                <p className="text-3xl font-bold">{students.filter(s => s.placementStatus === 'Placed').length}</p>
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
                <p className="text-sm text-muted-foreground">In Process</p>
                <p className="text-3xl font-bold">{students.filter(s => s.placementStatus === 'In Process').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applying</p>
                <p className="text-3xl font-bold">{students.filter(s => s.placementStatus === 'Applying').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
                <p className="text-3xl font-bold">
                  {students.length > 0 ? ((students.filter(s => s.placementStatus === 'Placed').length / students.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students by name, email, branch, or skills..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>
                      {branch === 'all' ? 'All Branches' : branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'All Status' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCGPA} onValueChange={setSelectedCGPA}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="CGPA" />
                </SelectTrigger>
                <SelectContent>
                  {cgpaRanges.map(range => (
                    <SelectItem key={range} value={range}>
                      {range === 'all' ? 'All CGPA' : range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedBranch('all');
                  setSelectedYear('all');
                  setSelectedStatus('all');
                  setSelectedCGPA('all');
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>

            {/* Select All Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm">
                Select All ({filteredStudents.length})
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="py-20">
              <div className="text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => {
            // Ensure student object exists and has all required properties
            if (!student || !student.id) return null;
            
            return (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedStudents.has(student.id)}
                      onCheckedChange={(checked) => handleSelectStudent(student.id, checked === true)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {student.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span><strong>Branch:</strong> {student.branch}</span>
                            <span><strong>Year:</strong> {student.year}</span>
                            <span><strong>CGPA:</strong> {student.cgpa}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm"><strong>Status:</strong></span>
                            <Badge 
                              variant={
                                student.placementStatus === 'Placed' ? 'default' :
                                student.placementStatus === 'In Process' ? 'secondary' :
                                student.placementStatus === 'Applying' ? 'outline' :
                                'destructive'
                              }
                            >
                              {student.placementStatus}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Applications: {student.applications} | Offers: {student.offers}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {student.company && (
                            <div className="font-medium text-primary">
                              {student.company} - {student.package}
                            </div>
                          )}
                          <div>Resume Score: <span className="font-medium">{student.resumeScore}%</span></div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(student.skillSet || []).slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(student.skillSet || []).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(student.skillSet || []).length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleViewProfile(student)}>
                      <Eye className="h-3 w-3" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleDownloadResume(student.id, student.name)}>
                      <Download className="h-3 w-3" />
                      Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          }).filter(Boolean)
        )}
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal
        open={studentProfileOpen}
        onOpenChange={setStudentProfileOpen}
        student={selectedStudent}
      />

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Perform actions on {selectedStudents.size} selected students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={handleBulkEmail} 
              className="w-full gap-2"
              disabled={selectedStudents.size === 0}
            >
              <Send className="h-4 w-4" />
              Send Bulk Email
            </Button>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Update Placement Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('Placed')}
                  disabled={selectedStudents.size === 0}
                >
                  Mark as Placed
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('In Process')}
                  disabled={selectedStudents.size === 0}
                >
                  Mark as In Process
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('Applying')}
                  disabled={selectedStudents.size === 0}
                >
                  Mark as Applying
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBulkStatusUpdate('Not Placed')}
                  disabled={selectedStudents.size === 0}
                >
                  Mark as Not Placed
                </Button>
              </div>
            </div>
            
            <Button variant="outline" onClick={() => setBulkActionOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;