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
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Download, 
  Edit,
  Save,
  X,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  FileText,
  AlertCircle,
  Eye,
  FileImage,
  File
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  maxMarks: number;
}

interface StudentResult {
  id: string;
  studentName: string;
  rollNumber: string;
  semester: number;
  branch: string;
  cgpa: number;
  sgpa: number;
  subjects: {
    [subjectId: string]: {
      marks: number;
      grade: string;
      status: 'Pass' | 'Fail' | 'Absent';
    };
  };
  overallStatus: 'Pass' | 'Fail' | 'ATKT';
  attendance: number;
  uploadedDocuments?: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadDate: Date;
  }[];
}

interface UploadResult {
  success: boolean;
  studentsProcessed: number;
  errors: string[];
  warnings: string[];
}

const mockSubjects: Subject[] = [
  { id: 'CS401', name: 'Data Structures', code: 'CS401', credits: 4, maxMarks: 100 },
  { id: 'CS402', name: 'Database Management', code: 'CS402', credits: 4, maxMarks: 100 },
  { id: 'CS403', name: 'Computer Networks', code: 'CS403', credits: 3, maxMarks: 100 },
  { id: 'CS404', name: 'Operating Systems', code: 'CS404', credits: 4, maxMarks: 100 },
  { id: 'CS405', name: 'Software Engineering', code: 'CS405', credits: 3, maxMarks: 100 },
  { id: 'CS406', name: 'Web Technologies', code: 'CS406', credits: 3, maxMarks: 100 }
];

const mockStudentResults: StudentResult[] = [
  {
    id: '1',
    studentName: 'Rahul Sharma',
    rollNumber: 'CS21B001',
    semester: 4,
    branch: 'Computer Science',
    cgpa: 8.5,
    sgpa: 8.7,
    subjects: {
      'CS401': { marks: 87, grade: 'A', status: 'Pass' },
      'CS402': { marks: 92, grade: 'A+', status: 'Pass' },
      'CS403': { marks: 78, grade: 'B+', status: 'Pass' },
      'CS404': { marks: 85, grade: 'A', status: 'Pass' },
      'CS405': { marks: 88, grade: 'A', status: 'Pass' },
      'CS406': { marks: 90, grade: 'A+', status: 'Pass' }
    },
    overallStatus: 'Pass',
    attendance: 92
  },
  {
    id: '2',
    studentName: 'Priya Patel',
    rollNumber: 'CS21B002',
    semester: 4,
    branch: 'Computer Science',
    cgpa: 9.1,
    sgpa: 9.3,
    subjects: {
      'CS401': { marks: 95, grade: 'A+', status: 'Pass' },
      'CS402': { marks: 98, grade: 'A+', status: 'Pass' },
      'CS403': { marks: 91, grade: 'A+', status: 'Pass' },
      'CS404': { marks: 94, grade: 'A+', status: 'Pass' },
      'CS405': { marks: 89, grade: 'A', status: 'Pass' },
      'CS406': { marks: 93, grade: 'A+', status: 'Pass' }
    },
    overallStatus: 'Pass',
    attendance: 98
  },
  {
    id: '3',
    studentName: 'Amit Kumar',
    rollNumber: 'CS21B003',
    semester: 4,
    branch: 'Computer Science',
    cgpa: 6.8,
    sgpa: 6.5,
    subjects: {
      'CS401': { marks: 65, grade: 'B', status: 'Pass' },
      'CS402': { marks: 58, grade: 'C+', status: 'Pass' },
      'CS403': { marks: 72, grade: 'B+', status: 'Pass' },
      'CS404': { marks: 34, grade: 'F', status: 'Fail' },
      'CS405': { marks: 68, grade: 'B', status: 'Pass' },
      'CS406': { marks: 71, grade: 'B+', status: 'Pass' }
    },
    overallStatus: 'ATKT',
    attendance: 78
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    rollNumber: 'CS21B004',
    semester: 4,
    branch: 'Computer Science',
    cgpa: 8.9,
    sgpa: 9.0,
    subjects: {
      'CS401': { marks: 91, grade: 'A+', status: 'Pass' },
      'CS402': { marks: 88, grade: 'A', status: 'Pass' },
      'CS403': { marks: 92, grade: 'A+', status: 'Pass' },
      'CS404': { marks: 89, grade: 'A', status: 'Pass' },
      'CS405': { marks: 90, grade: 'A+', status: 'Pass' },
      'CS406': { marks: 94, grade: 'A+', status: 'Pass' }
    },
    overallStatus: 'Pass',
    attendance: 95
  }
];

const Results = () => {
  const { addNotification } = useNotifications();
  const [results, setResults] = useState<StudentResult[]>(mockStudentResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingResult, setEditingResult] = useState<StudentResult | null>(null);
  const [editedMarks, setEditedMarks] = useState<{[subjectId: string]: number}>({});
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [viewingResult, setViewingResult] = useState<StudentResult | null>(null);

  const filteredResults = results.filter(result => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'All' || result.semester.toString() === semesterFilter;
    const matchesStatus = statusFilter === 'All' || result.overallStatus === statusFilter;
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const getGradeFromMarks = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  };

  const getStatusFromMarks = (marks: number): 'Pass' | 'Fail' => {
    return marks >= 40 ? 'Pass' : 'Fail';
  };

  const calculateSGPA = (subjects: StudentResult['subjects']): number => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    Object.keys(subjects).forEach(subjectId => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      if (subject) {
        const marks = subjects[subjectId].marks;
        let gradePoint = 0;
        
        if (marks >= 90) gradePoint = 10;
        else if (marks >= 80) gradePoint = 9;
        else if (marks >= 70) gradePoint = 8;
        else if (marks >= 60) gradePoint = 7;
        else if (marks >= 50) gradePoint = 6;
        else if (marks >= 40) gradePoint = 5;
        else gradePoint = 0;

        totalCredits += subject.credits;
        totalGradePoints += gradePoint * subject.credits;
      }
    });

    return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
  };

  const handleEditMarks = (result: StudentResult) => {
    setEditingResult(result);
    setEditedMarks(
      Object.keys(result.subjects).reduce((acc, subjectId) => {
        acc[subjectId] = result.subjects[subjectId].marks;
        return acc;
      }, {} as {[subjectId: string]: number})
    );
  };

  const handleSaveMarks = () => {
    if (!editingResult) return;

    const updatedSubjects = { ...editingResult.subjects };
    Object.keys(editedMarks).forEach(subjectId => {
      const marks = editedMarks[subjectId];
      updatedSubjects[subjectId] = {
        marks,
        grade: getGradeFromMarks(marks),
        status: getStatusFromMarks(marks)
      };
    });

    const newSGPA = calculateSGPA(updatedSubjects);
    const hasFailedSubject = Object.values(updatedSubjects).some(s => s.status === 'Fail');
    const overallStatus = hasFailedSubject ? 'ATKT' : 'Pass';

    const updatedResult: StudentResult = {
      ...editingResult,
      subjects: updatedSubjects,
      sgpa: newSGPA,
      overallStatus
    };

    setResults(prev => prev.map(r => r.id === editingResult.id ? updatedResult : r));
    setEditingResult(null);
    setEditedMarks({});
    
    // Add notification for result update
    addNotification({
      title: 'Results Updated',
      message: `Academic results updated for ${editingResult.studentName} (${editingResult.rollNumber})`,
      type: 'success',
      actionUrl: '/hod/results',
      actionText: 'View Results'
    });
    
    toast({
      title: "Results Updated",
      description: `Successfully updated results for ${editingResult.studentName}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/csv', 'application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV, PDF, JPG, or PNG file.",
        variant: "destructive"
      });
      return;
    }

    if (file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        processCSVData(csv);
      };
      reader.readAsText(file);
    } else {
      // Handle PDF, JPG, PNG files
      processDocumentFile(file);
    }
  };

  const processDocumentFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file processing
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create a URL for the file (in real app, this would be uploaded to server)
      const fileUrl = URL.createObjectURL(file);
      
      const newDocument = {
        fileName: file.name,
        fileType: file.type,
        fileUrl: fileUrl,
        uploadDate: new Date()
      };

      // For demo purposes, add document to all students
      // In real app, you'd associate with specific students
      setResults(prev => prev.map(student => ({
        ...student,
        uploadedDocuments: [
          ...(student.uploadedDocuments || []),
          newDocument
        ]
      })));

      setUploadResult({
        success: true,
        studentsProcessed: results.length,
        errors: [],
        warnings: []
      });

      addNotification({
        title: 'Document Upload Completed',
        message: `Successfully uploaded ${file.name} for student results`,
        type: 'success',
        actionUrl: '/hod/results',
        actionText: 'View Results'
      });

      toast({
        title: "Document Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });

    } catch (error) {
      setUploadResult({
        success: false,
        studentsProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Upload failed'],
        warnings: []
      });

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processCSVData = async (csvData: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Expected format: Roll Number, Student Name, CS401, CS402, CS403, CS404, CS405, CS406
      const expectedHeaders = ['Roll Number', 'Student Name', ...mockSubjects.map(s => s.code)];
      const headerValidation = expectedHeaders.every(h => headers.includes(h));
      
      if (!headerValidation) {
        throw new Error(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
      }

      const errors: string[] = [];
      const warnings: string[] = [];
      const updatedResults: StudentResult[] = [...results];
      let processedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        setUploadProgress((i / (lines.length - 1)) * 100);
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate processing time

        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) {
          errors.push(`Row ${i + 1}: Insufficient data`);
          continue;
        }

        const rollNumber = values[headers.indexOf('Roll Number')];
        const studentName = values[headers.indexOf('Student Name')];
        
        const existingResultIndex = updatedResults.findIndex(r => r.rollNumber === rollNumber);
        if (existingResultIndex === -1) {
          warnings.push(`Row ${i + 1}: Student ${rollNumber} not found in database`);
          continue;
        }

        const updatedSubjects = { ...updatedResults[existingResultIndex].subjects };
        let hasInvalidMarks = false;

        mockSubjects.forEach(subject => {
          const markValue = values[headers.indexOf(subject.code)];
          const marks = parseInt(markValue);
          
          if (isNaN(marks) || marks < 0 || marks > subject.maxMarks) {
            errors.push(`Row ${i + 1}: Invalid marks for ${subject.code} (${markValue})`);
            hasInvalidMarks = true;
          } else {
            updatedSubjects[subject.id] = {
              marks,
              grade: getGradeFromMarks(marks),
              status: getStatusFromMarks(marks)
            };
          }
        });

        if (!hasInvalidMarks) {
          const newSGPA = calculateSGPA(updatedSubjects);
          const hasFailedSubject = Object.values(updatedSubjects).some(s => s.status === 'Fail');
          const overallStatus = hasFailedSubject ? 'ATKT' : 'Pass';

          updatedResults[existingResultIndex] = {
            ...updatedResults[existingResultIndex],
            subjects: updatedSubjects,
            sgpa: newSGPA,
            overallStatus
          };
          processedCount++;
        }
      }

      setResults(updatedResults);
      setUploadResult({
        success: true,
        studentsProcessed: processedCount,
        errors,
        warnings
      });

      // Add notification for bulk upload
      addNotification({
        title: 'Bulk Results Upload Completed',
        message: `Successfully processed ${processedCount} student results with ${errors.length} errors`,
        type: errors.length === 0 ? 'success' : 'warning',
        actionUrl: '/hod/results',
        actionText: 'View Results'
      });

      toast({
        title: "Upload Completed",
        description: `Processed ${processedCount} students with ${errors.length} errors`,
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

  const downloadTemplate = () => {
    const headers = ['Roll Number', 'Student Name', ...mockSubjects.map(s => s.code)];
    const sampleData = [
      ['CS21B001', 'Rahul Sharma', '87', '92', '78', '85', '88', '90'],
      ['CS21B002', 'Priya Patel', '95', '98', '91', '94', '89', '93'],
      ['CS21B003', 'Amit Kumar', '65', '58', '72', '34', '68', '71']
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + sampleData.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "marks_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-blue-600" />;
    }
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const renderDocument = (doc: any) => {
    if (doc.fileType === 'application/pdf') {
      return (
        <iframe
          src={doc.fileUrl}
          className="w-full h-96 border rounded"
          title={doc.fileName}
        />
      );
    } else if (doc.fileType.startsWith('image/')) {
      return (
        <img
          src={doc.fileUrl}
          alt={doc.fileName}
          className="max-w-full h-auto border rounded"
        />
      );
    }
    return <p>Unsupported file type</p>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'Fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'ATKT':
        return <Badge className="bg-yellow-100 text-yellow-800">ATKT</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Roll Number,Semester,SGPA,CGPA,Status,Attendance\n"
      + filteredResults.map(result => 
          `${result.studentName},${result.rollNumber},${result.semester},${result.sgpa},${result.cgpa},${result.overallStatus},${result.attendance}%`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Results</h1>
          <p className="text-muted-foreground">View and manage student academic results</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Marks
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Student Marks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>CSV files:</strong> Bulk upload marks for multiple students</li>
                    <li>• <strong>PDF files:</strong> Upload result documents (mark sheets, transcripts)</li>
                    <li>• <strong>Image files (JPG/PNG):</strong> Upload scanned result documents</li>
                    <li>• Required CSV columns: Roll Number, Student Name, and subject codes ({mockSubjects.map(s => s.code).join(', ')})</li>
                    <li>• Marks should be between 0 and {mockSubjects[0]?.maxMarks || 100}</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={downloadTemplate}>
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
                  accept=".csv,.pdf,.jpg,.jpeg,.png"
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
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    setUploadResult(null);
                    setUploadProgress(0);
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={exportResults} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Results
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
                <p className="text-3xl font-bold">{results.length}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((results.filter(r => r.overallStatus === 'Pass').length / results.length) * 100)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ATKT Cases</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {results.filter(r => r.overallStatus === 'ATKT').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average SGPA</p>
                <p className="text-3xl font-bold">
                  {(results.reduce((sum, r) => sum + r.sgpa, 0) / results.length).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Semesters</SelectItem>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
                <SelectItem value="8">Semester 8</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="ATKT">ATKT</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results ({filteredResults.length} students)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Academic Info</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{result.studentName}</p>
                      <p className="text-sm text-muted-foreground">{result.rollNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">Semester {result.semester}</p>
                      <p className="text-sm text-muted-foreground">{result.branch}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">SGPA: {result.sgpa}</p>
                      <p className="text-sm text-muted-foreground">CGPA: {result.cgpa}</p>
                      <p className="text-xs text-muted-foreground">Attendance: {result.attendance}%</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(result.overallStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {result.uploadedDocuments && result.uploadedDocuments.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {getFileIcon(result.uploadedDocuments[0].fileType)}
                          <span className="text-xs text-muted-foreground">
                            {result.uploadedDocuments.length} file{result.uploadedDocuments.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No documents</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setViewingResult(result)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl">
                          <DialogHeader>
                            <DialogTitle>Detailed Results - {result.studentName}</DialogTitle>
                          </DialogHeader>
                          {viewingResult && (
                            <Tabs defaultValue="marks" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="marks">Subject Marks</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="marks" className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Academic Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>SGPA:</span>
                                          <span className="font-bold">{viewingResult.sgpa}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>CGPA:</span>
                                          <span className="font-bold">{viewingResult.cgpa}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Status:</span>
                                          {getStatusBadge(viewingResult.overallStatus)}
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Attendance:</span>
                                          <span className="font-bold">{viewingResult.attendance}%</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Subject Performance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-3">
                                        {mockSubjects.map((subject) => {
                                          const subjectResult = viewingResult.subjects[subject.id];
                                          return (
                                            <div key={subject.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                              <div>
                                                <p className="font-medium text-sm">{subject.name}</p>
                                                <p className="text-xs text-muted-foreground">{subject.code}</p>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-bold">{subjectResult?.marks || 0}</p>
                                                <Badge variant={subjectResult?.status === 'Pass' ? 'default' : 'destructive'} className="text-xs">
                                                  {subjectResult?.grade || 'N/A'}
                                                </Badge>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="documents" className="space-y-4">
                                {viewingResult.uploadedDocuments && viewingResult.uploadedDocuments.length > 0 ? (
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-3">
                                          {viewingResult.uploadedDocuments.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                              <div className="flex items-center gap-2">
                                                {getFileIcon(doc.fileType)}
                                                <div>
                                                  <p className="font-medium text-sm">{doc.fileName}</p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Uploaded {doc.uploadDate.toLocaleDateString()}
                                                  </p>
                                                </div>
                                              </div>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedDocument(doc.fileUrl)}
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Document Preview</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        {selectedDocument ? (
                                          <div className="space-y-2">
                                            {renderDocument(viewingResult.uploadedDocuments?.find(doc => doc.fileUrl === selectedDocument))}
                                          </div>
                                        ) : (
                                          <div className="text-center text-muted-foreground py-8">
                                            Select a document to preview
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </div>
                                ) : (
                                  <Card>
                                    <CardContent className="text-center py-8">
                                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                      <h3 className="font-medium mb-2">No Documents Uploaded</h3>
                                      <p className="text-muted-foreground">No result documents have been uploaded for this student.</p>
                                    </CardContent>
                                  </Card>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="analytics" className="space-y-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold text-green-600">
                                        {Object.values(viewingResult.subjects).filter(s => s.status === 'Pass').length}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Passed Subjects</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold text-red-600">
                                        {Object.values(viewingResult.subjects).filter(s => s.status === 'Fail').length}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Failed Subjects</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-6 text-center">
                                      <p className="text-2xl font-bold">
                                        {(Object.values(viewingResult.subjects).reduce((sum, s) => sum + s.marks, 0) / Object.values(viewingResult.subjects).length).toFixed(1)}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Average Marks</p>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditMarks(result)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Edit Marks - {result.studentName}</DialogTitle>
                          </DialogHeader>
                          {editingResult && (
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p><strong>Roll Number:</strong> {editingResult.rollNumber}</p>
                                  <p><strong>Semester:</strong> {editingResult.semester}</p>
                                </div>
                                <div>
                                  <p><strong>Current SGPA:</strong> {editingResult.sgpa}</p>
                                  <p><strong>Status:</strong> {editingResult.overallStatus}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <h4 className="font-medium">Subject Marks</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {mockSubjects.map((subject) => (
                                    <div key={subject.id} className="space-y-2">
                                      <Label htmlFor={subject.id}>
                                        {subject.name} ({subject.code}) - Max: {subject.maxMarks}
                                      </Label>
                                      <Input
                                        id={subject.id}
                                        type="number"
                                        min="0"
                                        max={subject.maxMarks}
                                        value={editedMarks[subject.id] || 0}
                                        onChange={(e) => setEditedMarks(prev => ({
                                          ...prev,
                                          [subject.id]: Number(e.target.value)
                                        }))}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Grade: {getGradeFromMarks(editedMarks[subject.id] || 0)}</span>
                                        <span>Status: {getStatusFromMarks(editedMarks[subject.id] || 0)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Updated Summary</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <strong>New SGPA:</strong> {calculateSGPA(Object.keys(editedMarks).reduce((acc, subjectId) => {
                                      acc[subjectId] = {
                                        marks: editedMarks[subjectId],
                                        grade: getGradeFromMarks(editedMarks[subjectId]),
                                        status: getStatusFromMarks(editedMarks[subjectId])
                                      };
                                      return acc;
                                    }, {} as StudentResult['subjects']))}
                                  </div>
                                  <div>
                                    <strong>Failed Subjects:</strong> {Object.values(editedMarks).filter(marks => marks < 40).length}
                                  </div>
                                  <div>
                                    <strong>New Status:</strong> {Object.values(editedMarks).some(marks => marks < 40) ? 'ATKT' : 'Pass'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingResult(null)}>
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button onClick={handleSaveMarks}>
                              <Save className="h-4 w-4 mr-1" />
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subject-wise Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSubjects.map((subject) => {
              const subjectResults = filteredResults.map(r => r.subjects[subject.id]?.marks || 0);
              const average = subjectResults.reduce((sum, marks) => sum + marks, 0) / subjectResults.length;
              const passCount = subjectResults.filter(marks => marks >= 40).length;
              const passRate = (passCount / subjectResults.length) * 100;

              return (
                <div key={subject.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{subject.name} ({subject.code})</h4>
                    <Badge variant="outline">{subject.credits} Credits</Badge>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Average Marks:</span>
                      <span className="ml-2 font-medium">{average.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pass Rate:</span>
                      <span className="ml-2 font-medium">{passRate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Highest Score:</span>
                      <span className="ml-2 font-medium">{Math.max(...subjectResults)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;