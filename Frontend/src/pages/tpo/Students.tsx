import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import StudentProfileModal from '@/components/modals/StudentProfileModal';

const Students = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [studentProfileOpen, setStudentProfileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock student data - replace with Firebase data
  const mockStudent = {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@college.edu',
    phone: '+91 98765 43210',
    branch: 'Computer Science Engineering',
    batch: '2024',
    cgpa: 8.75,
    location: 'Mumbai, India',
    skills: ['React', 'Node.js', 'Python', 'Java', 'MongoDB'],
    status: 'Placed',
    placedCompany: 'Google',
    package: '₹24 LPA',
    placementDate: '2024-03-15',
    profilePicture: null,
    resumeUrl: '/documents/rahul_sharma_resume.pdf',
    about: 'Passionate software engineer with experience in full-stack web development.',
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a complete e-commerce solution using MERN stack',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express']
      }
    ],
    academics: [
      {
        degree: 'B.Tech Computer Science',
        institution: 'ABC Engineering College',
        year: '2020-2024',
        percentage: 87.5
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-12-01'
      }
    ]
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Preparing student data export...",
    });
    // Simulate file download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Student data has been exported successfully.",
      });
    }, 2000);
  };

  const handleBulkActions = () => {
    toast({
      title: "Bulk Actions",
      description: "Opening bulk action menu...",
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleFilter = (filterType: string) => {
    toast({
      title: "Filter Applied",
      description: `Filtering by: ${filterType}`,
    });
  };

  const handleViewProfile = (student: any) => {
    setSelectedStudent(student || mockStudent);
    setStudentProfileOpen(true);
  };

  const handleDownloadResume = (studentId: number, studentName: string) => {
    toast({
      title: "Download Resume",
      description: `Downloading ${studentName}'s resume...`,
    });
  };

  const handleEditStudent = (studentId: number, studentName: string) => {
    toast({
      title: "Edit Student",
      description: `Opening ${studentName}'s editor...`,
    });
  };

  const students = [
    {
      id: 1,
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
      offers: 2
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
      offers: 1
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
      offers: 0
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
      offers: 3
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
      offers: 0
    }
  ];

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
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="gap-2" onClick={handleBulkActions}>
            <Users className="h-4 w-4" />
            Bulk Actions
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students by name, email, branch, or skills..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Branch')}>
                <Filter className="h-4 w-4" />
                Branch
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Year')}>
                <GraduationCap className="h-4 w-4" />
                Year
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Status')}>
                <CheckCircle className="h-4 w-4" />
                Status
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('CGPA')}>
                <Star className="h-4 w-4" />
                CGPA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
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
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => handleEditStudent(student.id, student.name)}>
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <StudentProfileModal 
        open={studentProfileOpen} 
        onOpenChange={setStudentProfileOpen}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;