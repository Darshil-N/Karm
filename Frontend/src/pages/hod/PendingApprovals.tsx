import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Upload,
  Download,
  FileText,
  User,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Award,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface ApprovalRequest {
  id: string;
  type: 'student_registration' | 'placement_application' | 'document_verification' | 'exemption_request';
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  rollNumber: string;
  cgpa: number;
  semester: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  reason?: string;
  companyName?: string;
  jobTitle?: string;
  additionalInfo?: string;
  urgency: 'low' | 'medium' | 'high';
}

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    type: 'student_registration',
    studentName: 'Rahul Sharma',
    studentEmail: 'rahul.sharma@student.edu',
    studentPhone: '+91 9876543210',
    rollNumber: 'CS21B001',
    cgpa: 8.5,
    semester: 8,
    submittedDate: '2024-11-05',
    status: 'pending',
    documents: ['ID Proof', 'Academic Transcripts', 'Admission Letter'],
    urgency: 'medium'
  },
  {
    id: '2',
    type: 'placement_application',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@student.edu',
    studentPhone: '+91 9876543211',
    rollNumber: 'CS21B002',
    cgpa: 9.1,
    semester: 8,
    submittedDate: '2024-11-04',
    status: 'pending',
    companyName: 'Google',
    jobTitle: 'Software Engineer',
    documents: ['Resume', 'Cover Letter', 'Recommendation Letter'],
    urgency: 'high'
  },
  {
    id: '3',
    type: 'document_verification',
    studentName: 'Amit Kumar',
    studentEmail: 'amit.kumar@student.edu',
    studentPhone: '+91 9876543212',
    rollNumber: 'CS21B003',
    cgpa: 7.8,
    semester: 8,
    submittedDate: '2024-11-03',
    status: 'pending',
    documents: ['Degree Certificate', 'Mark Sheets', 'Character Certificate'],
    urgency: 'low'
  },
  {
    id: '4',
    type: 'exemption_request',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.reddy@student.edu',
    studentPhone: '+91 9876543213',
    rollNumber: 'CS21B004',
    cgpa: 8.9,
    semester: 8,
    submittedDate: '2024-11-02',
    status: 'pending',
    reason: 'Medical emergency - requesting attendance exemption',
    documents: ['Medical Certificate', 'Doctor\'s Report'],
    urgency: 'high'
  },
  {
    id: '5',
    type: 'placement_application',
    studentName: 'Vikash Singh',
    studentEmail: 'vikash.singh@student.edu',
    studentPhone: '+91 9876543214',
    rollNumber: 'CS21B005',
    cgpa: 7.2,
    semester: 8,
    submittedDate: '2024-11-01',
    status: 'pending',
    companyName: 'Microsoft',
    jobTitle: 'Cloud Architect',
    documents: ['Resume', 'Portfolio', 'Certification'],
    urgency: 'medium'
  }
];

const PendingApprovals = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState('name');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  
  // Upload functionality states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    requestsProcessed: number;
    errors: string[];
    warnings: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredRequests = requests.filter(request => {
    let matchesSearch = false;
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case 'name':
        matchesSearch = request.studentName.toLowerCase().includes(searchLower);
        break;
      case 'rollNumber':
        matchesSearch = request.rollNumber.toLowerCase().includes(searchLower);
        break;
      case 'email':
        matchesSearch = request.studentEmail.toLowerCase().includes(searchLower);
        break;
      case 'type':
        matchesSearch = request.type.toLowerCase().includes(searchLower);
        break;
      case 'urgency':
        matchesSearch = request.urgency.toLowerCase().includes(searchLower);
        break;
      default:
        matchesSearch = request.studentName.toLowerCase().includes(searchLower) ||
                       request.rollNumber.toLowerCase().includes(searchLower) ||
                       request.type.toLowerCase().includes(searchLower);
    }
    
    return matchesSearch;
  });

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'student_registration':
        return 'Student Registration';
      case 'placement_application':
        return 'Placement Application';
      case 'document_verification':
        return 'Document Verification';
      case 'exemption_request':
        return 'Exemption Request';
      default:
        return type;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'student_registration':
        return <Badge className="bg-blue-100 text-blue-800">Registration</Badge>;
      case 'placement_application':
        return <Badge className="bg-green-100 text-green-800">Placement</Badge>;
      case 'document_verification':
        return <Badge className="bg-purple-100 text-purple-800">Verification</Badge>;
      case 'exemption_request':
        return <Badge className="bg-orange-100 text-orange-800">Exemption</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
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
      const requiredHeaders = ['Type', 'Student Name', 'Roll Number', 'Email', 'Phone', 'CGPA', 'Semester', 'Description'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      clearInterval(progressInterval);
      setUploadProgress(95);

      const newRequests: ApprovalRequest[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim());
        
        try {
          const request: ApprovalRequest = {
            id: `imported_${Date.now()}_${i}`,
            type: (values[headers.indexOf('Type')] as ApprovalRequest['type']) || 'document_verification',
            studentName: values[headers.indexOf('Student Name')] || '',
            studentEmail: values[headers.indexOf('Email')] || '',
            studentPhone: values[headers.indexOf('Phone')] || '',
            rollNumber: values[headers.indexOf('Roll Number')] || '',
            cgpa: parseFloat(values[headers.indexOf('CGPA')]) || 0,
            semester: parseInt(values[headers.indexOf('Semester')]) || 1,
            submittedDate: new Date().toISOString().split('T')[0],
            additionalInfo: values[headers.indexOf('Description')] || '',
            documents: (values[headers.indexOf('Documents')] || '').split(';').filter(d => d.trim()),
            status: 'pending' as const,
            urgency: (values[headers.indexOf('Urgency')] as ApprovalRequest['urgency']) || 'medium'
          };

          // Validation
          if (!request.studentName) {
            errors.push(`Row ${i + 1}: Student Name is required`);
            continue;
          }
          
          if (!request.rollNumber) {
            errors.push(`Row ${i + 1}: Roll Number is required`);
            continue;
          }

          if (!request.studentEmail || !request.studentEmail.includes('@')) {
            errors.push(`Row ${i + 1}: Valid email is required`);
            continue;
          }

          if (!['student_registration', 'placement_application', 'document_verification', 'exemption_request'].includes(request.type)) {
            warnings.push(`Row ${i + 1}: Invalid request type, defaulting to 'document_verification'`);
            request.type = 'document_verification';
          }

          // Check for duplicates
          const existingRequest = requests.find(r => r.rollNumber === request.rollNumber && r.type === request.type && r.status === 'pending');
          if (existingRequest) {
            warnings.push(`Row ${i + 1}: Similar pending request for ${request.rollNumber} already exists`);
          }

          if (request.cgpa < 0 || request.cgpa > 10) {
            warnings.push(`Row ${i + 1}: CGPA should be between 0 and 10`);
          }

          newRequests.push(request);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setUploadProgress(100);

      // Update requests list
      if (newRequests.length > 0) {
        setRequests(prev => [...prev, ...newRequests]);
      }

      setUploadResult({
        success: errors.length === 0,
        requestsProcessed: newRequests.length,
        errors,
        warnings
      });

      toast({
        title: `Upload ${errors.length === 0 ? 'Successful' : 'Completed with Issues'}`,
        description: `${newRequests.length} approval requests added successfully`,
        variant: errors.length === 0 ? 'default' : 'destructive'
      });

    } catch (error) {
      setUploadResult({
        success: false,
        requestsProcessed: 0,
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

  const downloadApprovalTemplate = () => {
    const headers = ['Type', 'Student Name', 'Roll Number', 'Email', 'Phone', 'CGPA', 'Semester', 'Description', 'Documents', 'Urgency'];
    const sampleData = [
      ['student_registration', 'John Doe', 'CS21B001', 'john.doe@student.edu', '+91 9876543210', '8.5', '8', 'New student registration request', 'marksheet.pdf;id_proof.pdf', 'high'],
      ['placement_application', 'Jane Smith', 'CS21B002', 'jane.smith@student.edu', '+91 9876543211', '9.1', '8', 'Application for TCS placement drive', 'resume.pdf;certificates.pdf', 'medium'],
      ['document_verification', 'Mike Johnson', 'CS21B003', 'mike.johnson@student.edu', '+91 9876543212', '7.8', '6', 'Verification of internship documents', 'internship_certificate.pdf', 'low']
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + sampleData.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "approval_requests_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { 
        ...req, 
        status: 'approved' as const,
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
    
    toast({
      title: "Request Approved",
      description: `${request.studentName}'s ${getTypeDisplay(request.type)} request has been approved.`,
      variant: "default"
    });
  };

  const handleReject = (requestId: string, reason: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    if (!reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this request.",
        variant: "destructive"
      });
      return;
    }
    
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { 
        ...req, 
        status: 'rejected' as const, 
        reason,
        rejectedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
    
    setRejectionReason('');
    
    toast({
      title: "Request Rejected",
      description: `${request.studentName}'s ${getTypeDisplay(request.type)} request has been rejected.`,
      variant: "destructive"
    });
  };

  const handleBulkApprove = (requestIds: string[]) => {
    if (requestIds.length === 0) return;
    
    setRequests(prev => prev.map(req => 
      requestIds.includes(req.id) ? { 
        ...req, 
        status: 'approved' as const,
        approvedDate: new Date().toISOString().split('T')[0]
      } : req
    ));
    
    toast({
      title: "Bulk Approval Completed",
      description: `${requestIds.length} requests have been approved.`,
      variant: "default"
    });
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleSelectAll = () => {
    const pendingIds = pendingRequests.map(r => r.id);
    setSelectedRequests(prev => 
      prev.length === pendingIds.length ? [] : pendingIds
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve student requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Requests
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Approval Requests</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Upload Instructions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Upload a CSV file with approval request information</li>
                    <li>• Required columns: Type, Student Name, Roll Number, Email, Phone, CGPA, Semester, Description</li>
                    <li>• Optional columns: Documents, Urgency</li>
                    <li>• Valid request types: student_registration, placement_application, document_verification, exemption_request</li>
                    <li>• Valid urgency levels: low, medium, high</li>
                    <li>• Documents should be separated by semicolons (;)</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={downloadApprovalTemplate}>
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
                        Requests processed: {uploadResult.requestsProcessed}
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
          
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {pendingRequests.length} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold">{requests.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
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
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-orange-600">
                  {requests.filter(r => r.urgency === 'high' && r.status === 'pending').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
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
                  {searchType === 'type' && 'Search by Type'}
                  {searchType === 'urgency' && 'Search by Urgency'}
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
                        value="type"
                        onSelect={() => {
                          setSearchType('type');
                          setSearchOpen(false);
                        }}
                      >
                        Search by Request Type
                      </CommandItem>
                      <CommandItem
                        value="urgency"
                        onSelect={() => {
                          setSearchType('urgency');
                          setSearchOpen(false);
                        }}
                      >
                        Search by Urgency
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
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedRequests.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedRequests.length} selected</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequests([])}
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Selected ({selectedRequests.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Selected Requests</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve {selectedRequests.length} selected requests? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          handleBulkApprove(selectedRequests);
                          setSelectedRequests([]);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Requests */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({requests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({requests.filter(r => r.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({requests.filter(r => r.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingRequests.length > 0 && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  checked={selectedRequests.length === pendingRequests.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  Select All ({pendingRequests.length} requests)
                </span>
                {selectedRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedRequests.length} selected
                  </Badge>
                )}
              </div>
            )}
            
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selectedRequests.includes(request.id)}
                        onCheckedChange={() => handleSelectRequest(request.id)}
                        className="mt-1"
                      />
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{request.studentName}</h3>
                          {getTypeBadge(request.type)}
                          {getUrgencyBadge(request.urgency)}
                        </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{request.rollNumber} • CGPA: {request.cgpa}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{request.studentEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{request.studentPhone}</span>
                        </div>
                      </div>

                      {request.companyName && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>Company:</strong> {request.companyName} - {request.jobTitle}
                          </p>
                        </div>
                      )}

                      {request.reason && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>Reason:</strong> {request.reason}
                          </p>
                        </div>
                      )}

                      {request.documents && request.documents.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Documents Submitted:</p>
                          <div className="flex flex-wrap gap-2">
                            {request.documents.map((doc, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Request Details - {getTypeDisplay(request.type)}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Student Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      <span>{selectedRequest.studentName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4" />
                                      <span>{selectedRequest.rollNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Award className="h-4 w-4" />
                                      <span>CGPA: {selectedRequest.cgpa}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedRequest.studentEmail}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Request Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>Type: {getTypeDisplay(selectedRequest.type)}</div>
                                    <div>Priority: {selectedRequest.urgency}</div>
                                    <div>Submitted: {new Date(selectedRequest.submittedDate).toLocaleDateString()}</div>
                                    {selectedRequest.companyName && (
                                      <div>Company: {selectedRequest.companyName}</div>
                                    )}
                                    {selectedRequest.jobTitle && (
                                      <div>Position: {selectedRequest.jobTitle}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {selectedRequest.reason && (
                                <div>
                                  <h4 className="font-medium mb-2">Additional Information</h4>
                                  <p className="text-sm bg-gray-50 p-3 rounded-lg">
                                    {selectedRequest.reason}
                                  </p>
                                </div>
                              )}

                              {selectedRequest.documents && (
                                <div>
                                  <h4 className="font-medium mb-2">Documents</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {selectedRequest.documents.map((doc, idx) => (
                                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{doc}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Request</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please provide a reason for rejecting this request.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Textarea
                            placeholder="Enter rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleReject(request.id, rejectionReason)}
                              disabled={!rejectionReason.trim()}
                            >
                              Reject Request
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingRequests.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">No pending approval requests at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'approved').map((request) => (
              <Card key={request.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{request.studentName}</h3>
                        {getTypeBadge(request.type)}
                        <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.rollNumber} • Approved on {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-4">
            {requests.filter(r => r.status === 'rejected').map((request) => (
              <Card key={request.id} className="border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{request.studentName}</h3>
                        {getTypeBadge(request.type)}
                        <Badge variant="destructive">Rejected</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.rollNumber} • Rejected on {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                      {request.reason && (
                        <p className="text-sm bg-red-50 p-2 rounded">
                          <strong>Reason:</strong> {request.reason}
                        </p>
                      )}
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PendingApprovals;