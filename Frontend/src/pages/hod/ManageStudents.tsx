import { useState, useRef } from 'react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye, 
  Edit,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  cgpa: number;
  semester: number;
  branch: string;
  placementStatus: 'Placed' | 'In Process' | 'Unplaced';
  company?: string;
  package?: string;
  joiningDate?: string;
  address: string;
  skills: string[];
  projects: number;
  internships: number;
  certifications: number;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@student.edu',
    phone: '+91 9876543210',
    rollNumber: 'CS21B001',
    cgpa: 8.5,
    semester: 8,
    branch: 'Computer Science',
    placementStatus: 'Placed',
    company: 'Google',
    package: '₹24 LPA',
    joiningDate: '2024-07-01',
    address: 'Mumbai, Maharashtra',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    projects: 5,
    internships: 2,
    certifications: 3
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@student.edu',
    phone: '+91 9876543211',
    rollNumber: 'CS21B002',
    cgpa: 9.1,
    semester: 8,
    branch: 'Computer Science',
    placementStatus: 'In Process',
    address: 'Ahmedabad, Gujarat',
    skills: ['Java', 'Spring Boot', 'Angular', 'Docker'],
    projects: 6,
    internships: 3,
    certifications: 4
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.kumar@student.edu',
    phone: '+91 9876543212',
    rollNumber: 'CS21B003',
    cgpa: 7.8,
    semester: 8,
    branch: 'Computer Science',
    placementStatus: 'Unplaced',
    address: 'Delhi, India',
    skills: ['JavaScript', 'Vue.js', 'MySQL', 'Linux'],
    projects: 4,
    internships: 1,
    certifications: 2
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@student.edu',
    phone: '+91 9876543213',
    rollNumber: 'CS21B004',
    cgpa: 8.9,
    semester: 8,
    branch: 'Computer Science',
    placementStatus: 'Placed',
    company: 'Microsoft',
    package: '₹28 LPA',
    joiningDate: '2024-08-15',
    address: 'Hyderabad, Telangana',
    skills: ['C#', '.NET', 'Azure', 'SQL Server'],
    projects: 7,
    internships: 2,
    certifications: 5
  },
  {
    id: '5',
    name: 'Vikash Singh',
    email: 'vikash.singh@student.edu',
    phone: '+91 9876543214',
    rollNumber: 'CS21B005',
    cgpa: 7.2,
    semester: 8,
    branch: 'Computer Science',
    placementStatus: 'In Process',
    address: 'Patna, Bihar',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    projects: 3,
    internships: 1,
    certifications: 1
  }
];

const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState('name');
  
  // Upload functionality states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    studentsProcessed: number;
    errors: string[];
    warnings: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredStudents = students.filter(student => {
    let matchesSearch = false;
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case 'name':
        matchesSearch = student.name.toLowerCase().includes(searchLower);
        break;
      case 'rollNumber':
        matchesSearch = student.rollNumber.toLowerCase().includes(searchLower);
        break;
      case 'email':
        matchesSearch = student.email.toLowerCase().includes(searchLower);
        break;
      case 'branch':
        matchesSearch = student.branch.toLowerCase().includes(searchLower);
        break;
      case 'company':
        matchesSearch = student.company?.toLowerCase().includes(searchLower) || false;
        break;
      default:
        matchesSearch = student.name.toLowerCase().includes(searchLower) ||
                       student.rollNumber.toLowerCase().includes(searchLower) ||
                       student.email.toLowerCase().includes(searchLower);
    }
    
    const matchesStatus = statusFilter === 'All' || student.placementStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Placed':
        return <Badge className="bg-green-100 text-green-800">Placed</Badge>;
      case 'In Process':
        return <Badge className="bg-yellow-100 text-yellow-800">In Process</Badge>;
      case 'Unplaced':
        return <Badge variant="secondary">Unplaced</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Upload functionality
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate required headers
      const requiredHeaders = ['Name', 'Roll Number', 'Email', 'CGPA', 'Semester', 'Branch', 'Phone', 'Address'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      clearInterval(progressInterval);
      setUploadProgress(95);

      const newStudents: Student[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim());
        
        try {
          const student: Student = {
            id: `imported_${Date.now()}_${i}`,
            name: values[headers.indexOf('Name')] || '',
            rollNumber: values[headers.indexOf('Roll Number')] || '',
            email: values[headers.indexOf('Email')] || '',
            cgpa: parseFloat(values[headers.indexOf('CGPA')]) || 0,
            semester: parseInt(values[headers.indexOf('Semester')]) || 1,
            branch: values[headers.indexOf('Branch')] || '',
            phone: values[headers.indexOf('Phone')] || '',
            address: values[headers.indexOf('Address')] || '',
            placementStatus: (values[headers.indexOf('Placement Status')] as any) || 'Unplaced',
            company: values[headers.indexOf('Company')] || undefined,
            package: values[headers.indexOf('Package')] || undefined,
            joiningDate: values[headers.indexOf('Joining Date')] || undefined,
            skills: (values[headers.indexOf('Skills')] || '').split(';').filter(s => s.trim()),
            projects: parseInt(values[headers.indexOf('Projects')]) || 0,
            internships: parseInt(values[headers.indexOf('Internships')]) || 0,
            certifications: parseInt(values[headers.indexOf('Certifications')]) || 0
          };

          // Validation
          if (!student.name) {
            errors.push(`Row ${i + 1}: Name is required`);
            continue;
          }
          
          if (!student.rollNumber) {
            errors.push(`Row ${i + 1}: Roll Number is required`);
            continue;
          }

          if (!student.email || !student.email.includes('@')) {
            errors.push(`Row ${i + 1}: Valid email is required`);
            continue;
          }

          // Check for duplicates
          const existingStudent = students.find(s => s.rollNumber === student.rollNumber);
          if (existingStudent) {
            warnings.push(`Row ${i + 1}: Student ${student.rollNumber} already exists, skipping`);
            continue;
          }

          if (student.cgpa < 0 || student.cgpa > 10) {
            warnings.push(`Row ${i + 1}: CGPA should be between 0 and 10`);
          }

          newStudents.push(student);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setUploadProgress(100);

      // Update students list
      if (newStudents.length > 0) {
        setStudents(prev => [...prev, ...newStudents]);
      }

      setUploadResult({
        success: errors.length === 0,
        studentsProcessed: newStudents.length,
        errors,
        warnings
      });

      toast({
        title: `Upload ${errors.length === 0 ? 'Successful' : 'Completed with Issues'}`,
        description: `${newStudents.length} students added successfully`,
        variant: errors.length === 0 ? 'default' : 'destructive'
      });

    } catch (error) {
      setUploadResult({
        success: false,
        studentsProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
        warnings: []
      });

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const downloadStudentTemplate = () => {
    const headers = ['Name', 'Roll Number', 'Email', 'CGPA', 'Semester', 'Branch', 'Phone', 'Address', 'Placement Status', 'Company', 'Package', 'Joining Date', 'Skills', 'Projects', 'Internships', 'Certifications'];
    const sampleData = [
      ['John Doe', 'CS21B001', 'john.doe@student.edu', '8.5', '8', 'Computer Science', '+91 9876543210', 'Mumbai, Maharashtra', 'Placed', 'Google', '₹24 LPA', '2024-07-01', 'React;Node.js;Python', '5', '2', '3'],
      ['Jane Smith', 'CS21B002', 'jane.smith@student.edu', '9.1', '8', 'Computer Science', '+91 9876543211', 'Delhi, India', 'In Process', '', '', '', 'Java;Spring Boot;Angular', '6', '3', '4'],
      ['Mike Johnson', 'CS21B003', 'mike.johnson@student.edu', '7.8', '8', 'Computer Science', '+91 9876543212', 'Bangalore, Karnataka', 'Unplaced', '', '', '', 'Python;Django;SQL', '4', '1', '2']
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + sampleData.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportStudentData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Roll Number,Email,CGPA,Semester,Placement Status,Company,Package\n"
      + filteredStudents.map(student => 
          `${student.name},${student.rollNumber},${student.email},${student.cgpa},${student.semester},${student.placementStatus},${student.company || 'N/A'},${student.package || 'N/A'}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Students</h1>
          <p className="text-muted-foreground">Overview and management of all department students</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Students
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Student Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload a CSV file with student information</li>
                    <li>• Required columns: Name, Roll Number, Email, CGPA, Semester, Branch, Phone, Address</li>
                    <li>• Optional columns: Placement Status, Company, Package, Joining Date, Skills, Projects, Internships, Certifications</li>
                    <li>• CGPA should be between 0 and 10</li>
                    <li>• Skills should be separated by semicolons (;)</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={downloadStudentTemplate}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {uploadResult && (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-lg ${
                      uploadResult.success 
                        ? uploadResult.errors.length === 0 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {uploadResult.success ? (
                          uploadResult.errors.length === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <h4 className="font-medium">
                          {uploadResult.success ? 'Upload Completed' : 'Upload Failed'}
                        </h4>
                      </div>
                      <p className="text-sm mb-2">
                        Students processed: {uploadResult.studentsProcessed}
                      </p>
                      
                      {uploadResult.errors.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-red-700 mb-1">Errors:</h5>
                          <ul className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
                            {uploadResult.errors.map((error, idx) => (
                              <li key={idx}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {uploadResult.warnings.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-yellow-700 mb-1">Warnings:</h5>
                          <ul className="text-sm text-yellow-600 space-y-1 max-h-32 overflow-y-auto">
                            {uploadResult.warnings.map((warning, idx) => (
                              <li key={idx}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={exportStudentData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Placed</p>
                <p className="text-3xl font-bold text-green-600">
                  {students.filter(s => s.placementStatus === 'Placed').length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Process</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {students.filter(s => s.placementStatus === 'In Process').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average CGPA</p>
                <p className="text-3xl font-bold">
                  {(students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(2)}
                </p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={searchOpen}
                    className="w-[200px] justify-between"
                  >
                    {searchType === 'name' && 'Search by Name'}
                    {searchType === 'rollNumber' && 'Search by Roll No'}
                    {searchType === 'email' && 'Search by Email'}
                    {searchType === 'branch' && 'Search by Branch'}
                    {searchType === 'company' && 'Search by Company'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search type..." />
                    <CommandList>
                      <CommandEmpty>No search type found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="name"
                          onSelect={() => {
                            setSearchType('name');
                            setSearchOpen(false);
                          }}
                        >
                          Search by Name
                        </CommandItem>
                        <CommandItem
                          value="rollNumber"
                          onSelect={() => {
                            setSearchType('rollNumber');
                            setSearchOpen(false);
                          }}
                        >
                          Search by Roll Number
                        </CommandItem>
                        <CommandItem
                          value="email"
                          onSelect={() => {
                            setSearchType('email');
                            setSearchOpen(false);
                          }}
                        >
                          Search by Email
                        </CommandItem>
                        <CommandItem
                          value="branch"
                          onSelect={() => {
                            setSearchType('branch');
                            setSearchOpen(false);
                          }}
                        >
                          Search by Branch
                        </CommandItem>
                        <CommandItem
                          value="company"
                          onSelect={() => {
                            setSearchType('company');
                            setSearchOpen(false);
                          }}
                        >
                          Search by Company
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${searchType === 'rollNumber' ? 'roll number' : searchType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Placed">Placed</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Unplaced">Unplaced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List ({filteredStudents.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Academic Info</TableHead>
                <TableHead>Placement Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">CGPA: {student.cgpa}</p>
                      <p className="text-sm text-muted-foreground">Semester {student.semester}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(student.placementStatus)}
                      {student.company && (
                        <p className="text-sm text-muted-foreground">{student.company}</p>
                      )}
                      {student.package && (
                        <p className="text-sm font-medium text-green-600">{student.package}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{student.email}</p>
                      <p className="text-sm text-muted-foreground">{student.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Student Details - {student.name}</DialogTitle>
                          </DialogHeader>
                          {selectedStudent && (
                            <Tabs defaultValue="personal" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="academic">Academic</TabsTrigger>
                                <TabsTrigger value="placement">Placement</TabsTrigger>
                                <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="personal" className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStudent.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStudent.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStudent.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedStudent.rollNumber}</span>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="academic" className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold">{selectedStudent.cgpa}</p>
                                      <p className="text-sm text-muted-foreground">CGPA</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold">{selectedStudent.semester}</p>
                                      <p className="text-sm text-muted-foreground">Semester</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold">{selectedStudent.branch}</p>
                                      <p className="text-sm text-muted-foreground">Branch</p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="placement" className="space-y-4">
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge(selectedStudent.placementStatus)}
                                  </div>
                                  {selectedStudent.company && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Company:</span>
                                      <span>{selectedStudent.company}</span>
                                    </div>
                                  )}
                                  {selectedStudent.package && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Package:</span>
                                      <span className="text-green-600 font-bold">{selectedStudent.package}</span>
                                    </div>
                                  )}
                                  {selectedStudent.joiningDate && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Joining Date:</span>
                                      <span>{selectedStudent.joiningDate}</span>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="skills" className="space-y-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Technical Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedStudent.skills.map((skill, idx) => (
                                        <Badge key={idx} variant="outline">{skill}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-2xl font-bold">{selectedStudent.projects}</p>
                                        <p className="text-sm text-muted-foreground">Projects</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-2xl font-bold">{selectedStudent.internships}</p>
                                        <p className="text-sm text-muted-foreground">Internships</p>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6 text-center">
                                        <p className="text-2xl font-bold">{selectedStudent.certifications}</p>
                                        <p className="text-sm text-muted-foreground">Certifications</p>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudents;