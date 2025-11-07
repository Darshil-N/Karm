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
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Send,
  FileText
} from 'lucide-react';
import StudentProfileModal from '@/components/modals/StudentProfileModal';
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
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91-9876543210',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 8.7,
      placementStatus: 'Placed',
      company: 'Google',
      package: '₹24 LPA',
      skillSet: ['React', 'Node.js', 'Python', 'AWS'],
      location: 'Mumbai',
      resumeScore: 85,
      applications: 8,
      offers: 2,
      profileDetails: {
        rollNumber: 'CS2020001',
        dateOfBirth: '2001-05-15',
        address: '123 Main St, Mumbai',
        fatherName: 'Ram Sharma',
        motherName: 'Sita Sharma',
        emergencyContact: '+91-9876543220'
      },
      academicDetails: {
        tenthPercentage: 89.5,
        twelfthPercentage: 91.2,
        backlogs: 0,
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a complete e-commerce solution using MERN stack',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            duration: '3 months'
          }
        ],
        internships: [
          {
            company: 'TechCorp',
            role: 'Software Developer Intern',
            duration: '6 months',
            description: 'Worked on frontend development'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023-12-01'
          }
        ]
      },
      placementHistory: [
        {
          company: 'Google',
          role: 'Software Engineer',
          applicationDate: '2024-02-15',
          status: 'Selected',
          currentRound: 'Offer Extended'
        }
      ]
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91-9876543211',
      branch: 'Information Technology',
      year: '4th Year',
      cgpa: 9.1,
      placementStatus: 'In Process',
      company: 'Microsoft',
      package: 'Pending',
      skillSet: ['Java', 'Spring', 'Angular', 'Docker'],
      location: 'Bangalore',
      resumeScore: 92,
      applications: 5,
      offers: 1,
      profileDetails: {
        rollNumber: 'IT2020002',
        dateOfBirth: '2001-08-22',
        address: '456 Tech Park, Bangalore',
        fatherName: 'Raj Patel',
        motherName: 'Maya Patel',
        emergencyContact: '+91-9876543221'
      },
      academicDetails: {
        tenthPercentage: 95.0,
        twelfthPercentage: 93.5,
        backlogs: 0,
        projects: [],
        internships: [],
        certifications: []
      },
      placementHistory: []
    },
    {
      id: 3,
      name: 'Arjun Singh',
      email: 'arjun.singh@example.com',
      phone: '+91-9876543212',
      branch: 'Electronics',
      year: '4th Year',
      cgpa: 7.8,
      placementStatus: 'Applying',
      company: null,
      package: null,
      skillSet: ['C++', 'Embedded Systems', 'IoT', 'MATLAB'],
      location: 'Delhi',
      resumeScore: 78,
      applications: 12,
      offers: 0,
      profileDetails: {
        rollNumber: 'EC2020003',
        dateOfBirth: '2001-12-10',
        address: '789 Electronics City, Delhi',
        fatherName: 'Vikram Singh',
        motherName: 'Pooja Singh',
        emergencyContact: '+91-9876543222'
      },
      academicDetails: {
        tenthPercentage: 82.0,
        twelfthPercentage: 85.5,
        backlogs: 1,
        projects: [],
        internships: [],
        certifications: []
      },
      placementHistory: []
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91-9876543213',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 8.9,
      placementStatus: 'Placed',
      company: 'Amazon',
      package: '₹22 LPA',
      skillSet: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      location: 'Hyderabad',
      resumeScore: 88,
      applications: 6,
      offers: 3,
      profileDetails: {
        rollNumber: 'CS2020004',
        dateOfBirth: '2001-03-25',
        address: '321 HITEC City, Hyderabad',
        fatherName: 'Ravi Reddy',
        motherName: 'Lakshmi Reddy',
        emergencyContact: '+91-9876543223'
      },
      academicDetails: {
        tenthPercentage: 88.5,
        twelfthPercentage: 90.0,
        backlogs: 0,
        projects: [],
        internships: [],
        certifications: []
      },
      placementHistory: []
    },
    {
      id: 5,
      name: 'Vikash Kumar',
      email: 'vikash.kumar@example.com',
      phone: '+91-9876543214',
      branch: 'Mechanical',
      year: '4th Year',
      cgpa: 7.5,
      placementStatus: 'Not Placed',
      company: null,
      package: null,
      skillSet: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Project Management'],
      location: 'Chennai',
      resumeScore: 72,
      applications: 15,
      offers: 0,
      profileDetails: {
        rollNumber: 'ME2020005',
        dateOfBirth: '2001-07-18',
        address: '654 Engineering Hub, Chennai',
        fatherName: 'Suresh Kumar',
        motherName: 'Anita Kumar',
        emergencyContact: '+91-9876543224'
      },
      academicDetails: {
        tenthPercentage: 78.0,
        twelfthPercentage: 80.5,
        backlogs: 2,
        projects: [],
        internships: [],
        certifications: []
      },
      placementHistory: []
    }
  ]);

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
        student.skillSet.slice(0, 3).join(', ') + (student.skillSet.length > 3 ? '...' : '')
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

  const handleBulkEmail = () => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to send bulk email.",
        variant: "destructive",
      });
      return;
    }

    const selectedStudentList = filteredStudents.filter(student => 
      selectedStudents.has(student.id)
    );
    
    const emailSubject = "Placement Updates from TPO";
    const emailBody = `Dear Students,\n\nWe have important placement updates for you.\n\nPlease check your placement portal for more details.\n\nBest regards,\nTPO Office`;
    
    const mailtoLink = `mailto:${selectedStudentList.map(s => s.email).join(',')}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(mailtoLink, '_blank');
    
    toast({
      title: "Email Client Opened",
      description: `Bulk email prepared for ${selectedStudents.size} students.`,
    });

    setBulkActionOpen(false);
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedStudents.size === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to update status.",
        variant: "destructive",
      });
      return;
    }

    setStudents(prevStudents => 
      prevStudents.map(student => 
        selectedStudents.has(student.id)
          ? { ...student, placementStatus: newStatus }
          : student
      )
    );

    toast({
      title: "Status Updated",
      description: `${selectedStudents.size} students' status updated to ${newStatus}.`,
    });

    setSelectedStudents(new Set());
    setBulkActionOpen(false);
  };

  const handleSelectStudent = (studentId: number, isSelected: boolean) => {
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

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student);
    setStudentProfileOpen(true);
  };

  const handleDownloadResume = (studentId: number, studentName: string) => {
    toast({
      title: "Download Resume",
      description: `Downloading ${studentName}'s resume...`,
    });
    
    // Simulate file download
    setTimeout(() => {
      // Create a simple text file for demonstration
      const resumeContent = `
Resume - ${studentName}
Student ID: ${studentId}
Generated on: ${new Date().toLocaleDateString()}

This is a placeholder resume file.
In a real application, this would download the actual PDF resume.
      `;
      
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${studentName.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: `${studentName}'s resume has been downloaded.`,
      });
    }, 1000);
  };

  const handleUpdateStudent = (updatedStudent: any) => {
    // Removed for TPO - no edit access
  };

  const handleEditStudent = (student: any) => {
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
        student.skillSet.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed': return 'bg-secondary text-secondary-foreground';
      case 'In Process': return 'bg-accent text-accent-foreground';
      case 'Applying': return 'bg-primary text-primary-foreground';
      case 'Not Placed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Placed': return <CheckCircle className="h-4 w-4" />;
      case 'In Process': return <Clock className="h-4 w-4" />;
      case 'Applying': return <Users className="h-4 w-4" />;
      case 'Not Placed': return <XCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

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
                <p className="text-sm text-muted-foreground">Placed</p>
                <p className="text-3xl font-bold">287</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-1">68% placement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Process</p>
                <p className="text-3xl font-bold">89</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applying</p>
                <p className="text-3xl font-bold">44</p>
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
                <p className="text-sm text-muted-foreground">Avg Package</p>
                <p className="text-3xl font-bold">₹8.2L</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all"
                  checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({filteredStudents.length})
                </Label>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students by name, email, branch, or skills..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[140px]">
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
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
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
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
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
              </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No students found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedBranch('all');
                    setSelectedYear('all');
                    setSelectedStatus('all');
                    setSelectedCGPA('all');
                    setSearchTerm('');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Checkbox
                    checked={selectedStudents.has(student.id)}
                    onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                  />
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{student.name}</h3>
                      <Badge className={getStatusColor(student.placementStatus)}>
                        {getStatusIcon(student.placementStatus)}
                        <span className="ml-1">{student.placementStatus}</span>
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {student.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {student.location}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {student.branch} - {student.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          CGPA: {student.cgpa}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
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
                          {student.skillSet.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {student.skillSet.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.skillSet.length - 3} more
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
        )))}
      </div>

      {/* Modals */}
      <StudentProfileModal 
        open={studentProfileOpen} 
        onOpenChange={setStudentProfileOpen}
        student={selectedStudent}
      />

      {/* Bulk Actions Dialog */}
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