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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { StudentService } from '@/services/firebaseService';
import { 
  Upload, 
  FileImage,
  Search,
  Filter,
  Eye,
  Download,
  Edit3,
  Trophy,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  branch: string;
  year: string;
  company: string;
  position: string;
  packageAmount: number;
  interviewDate?: any;
  offerDate?: any;
  joiningDate?: any;
  location?: string;
  status: 'placed' | 'selected' | 'pending' | 'rejected';
  resultType: 'placement' | 'internship' | 'higher_studies';
  uploadedBy: string;
  uploadedAt: any;
  documentUrl?: string;
  extractedData?: {
    text: string;
    confidence: number;
  };
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: any;
  notes?: string;
}

interface PlacementStats {
  totalPlacements: number;
  totalStudents: number;
  placementRate: number;
  averagePackage: number;
  topPackage: number;
  byBranch: { [key: string]: number };
  byCompany: { [key: string]: number };
  recentPlacements: number;
}

const Results = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [resultDetailOpen, setResultDetailOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [placementStats, setPlacementStats] = useState<PlacementStats | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    studentId: '',
    company: '',
    position: '',
    packageAmount: '',
    location: '',
    resultType: 'placement' as 'placement' | 'internship' | 'higher_studies',
    status: 'placed' as 'placed' | 'selected' | 'pending' | 'rejected',
    notes: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load results and stats from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resultsData = await StudentService.getStudentResults();
        setResults(resultsData);
        
        // Calculate placement statistics
        const stats = calculatePlacementStats(resultsData);
        setPlacementStats(stats);
      } catch (error) {
        console.error('Error loading results:', error);
        toast({
          title: "Error Loading Results",
          description: "Failed to load student results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = StudentService.subscribeToStudentResults((resultsData) => {
      setResults(resultsData);
      const stats = calculatePlacementStats(resultsData);
      setPlacementStats(stats);
    });

    return () => unsubscribe();
  }, [toast]);

  const calculatePlacementStats = (resultsData: StudentResult[]): PlacementStats => {
    const placements = resultsData.filter(r => r.status === 'placed');
    const packages = placements.map(p => p.packageAmount).filter(p => p > 0);
    
    const byBranch: { [key: string]: number } = {};
    const byCompany: { [key: string]: number } = {};
    
    placements.forEach(placement => {
      byBranch[placement.branch] = (byBranch[placement.branch] || 0) + 1;
      byCompany[placement.company] = (byCompany[placement.company] || 0) + 1;
    });

    // Get recent placements (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPlacements = placements.filter(p => 
      p.uploadedAt && p.uploadedAt.toDate() > thirtyDaysAgo
    ).length;

    return {
      totalPlacements: placements.length,
      totalStudents: new Set(resultsData.map(r => r.studentId)).size,
      placementRate: resultsData.length > 0 ? (placements.length / resultsData.length) * 100 : 0,
      averagePackage: packages.length > 0 ? packages.reduce((a, b) => a + b, 0) / packages.length : 0,
      topPackage: packages.length > 0 ? Math.max(...packages) : 0,
      byBranch,
      byCompany,
      recentPlacements
    };
  };

  // Filter results based on search and filters
  const filteredResults = results.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = selectedBranch === 'all' || result.branch === selectedBranch;
    const matchesStatus = selectedStatus === 'all' || result.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Get unique values for filters
  const branches = [...new Set(results.map(r => r.branch).filter(Boolean))];
  const statuses = [...new Set(results.map(r => r.status))];

  // File upload and OCR processing
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        // In a real application, you would implement OCR here
        // For now, we'll simulate the process
        simulateOCR(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const simulateOCR = async (file: File) => {
    // Simulate OCR processing
    setTimeout(() => {
      // Mock extracted data - in real app, use actual OCR service
      const mockData = {
        company: "Tech Solutions Inc",
        position: "Software Engineer",
        packageAmount: "8.5",
        location: "Bangalore"
      };

      setUploadForm(prev => ({
        ...prev,
        ...mockData
      }));

      toast({
        title: "Text Extracted",
        description: "Data has been automatically extracted from the image. Please verify and edit if needed.",
      });
    }, 2000);
  };

  const handleUploadResult = async () => {
    if (!uploadForm.studentId || !uploadForm.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const resultData = {
        ...uploadForm,
        packageAmount: parseFloat(uploadForm.packageAmount) || 0,
        uploadedBy: 'HOD', // In real app, get from auth context
        uploadedAt: new Date(),
        verified: false
      };

      await StudentService.addStudentResult(resultData);
      
      toast({
        title: "Result Added",
        description: "Student result has been added successfully.",
      });

      // Reset form
      setUploadForm({
        studentId: '',
        company: '',
        position: '',
        packageAmount: '',
        location: '',
        resultType: 'placement',
        status: 'placed',
        notes: ''
      });
      setUploadedFile(null);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Error uploading result:', error);
      toast({
        title: "Error Adding Result",
        description: "Failed to add student result. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewResult = (result: StudentResult) => {
    setSelectedResult(result);
    setResultDetailOpen(true);
  };

  const exportResultsToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Placement Results Report', 20, 20);
    
    // Add statistics
    doc.setFontSize(12);
    if (placementStats) {
      doc.text(`Total Placements: ${placementStats.totalPlacements}`, 20, 40);
      doc.text(`Placement Rate: ${placementStats.placementRate.toFixed(1)}%`, 20, 50);
      doc.text(`Average Package: ₹${placementStats.averagePackage.toFixed(1)} LPA`, 20, 60);
    }

    // Add table
    const tableData = filteredResults.map(result => [
      result.studentName,
      result.studentId,
      result.branch,
      result.company,
      result.position,
      `₹${result.packageAmount} LPA`,
      result.status,
      result.location || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Name', 'ID', 'Branch', 'Company', 'Position', 'Package', 'Status', 'Location']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save('placement-results.pdf');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-green-100 text-green-800';
      case 'selected':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Placement Results</h1>
          <p className="text-muted-foreground">
            Track and manage student placement outcomes
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Add Result
          </Button>
          <Button variant="outline" onClick={exportResultsToPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {placementStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Placements</p>
                  <p className="text-2xl font-bold">{placementStats.totalPlacements}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-2xl font-bold">{placementStats.placementRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Package</p>
                  <p className="text-2xl font-bold">₹{placementStats.averagePackage.toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Package</p>
                  <p className="text-2xl font-bold">₹{placementStats.topPackage}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student name, ID, company, or position..." 
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredResults.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Company & Role</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status & Location</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{result.studentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.studentId} • {result.branch}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.company}</div>
                        <div className="text-sm text-muted-foreground">{result.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">₹{result.packageAmount} LPA</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                        {result.location && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {result.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(result.uploadedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewResult(result)}
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

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Student Result</DialogTitle>
            <DialogDescription>
              Upload placement result or manually enter details. You can upload an image for automatic data extraction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload Result Document (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <FileImage className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload an image for automatic data extraction
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Image
                  </Label>
                </div>
                {uploadedFile && (
                  <p className="mt-2 text-sm font-medium text-green-600">
                    ✓ {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID (e.g., KM1234)"
                  value={uploadForm.studentId}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, studentId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="Company name"
                  value={uploadForm.company}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Job position/role"
                  value={uploadForm.position}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, position: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Package (LPA)</Label>
                <Input
                  id="package"
                  type="number"
                  placeholder="0.00"
                  value={uploadForm.packageAmount}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, packageAmount: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Work location"
                  value={uploadForm.location}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultType">Result Type</Label>
                <Select value={uploadForm.resultType} onValueChange={(value: any) => setUploadForm(prev => ({ ...prev, resultType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placement">Placement</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="higher_studies">Higher Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={uploadForm.status} onValueChange={(value: any) => setUploadForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information..."
                value={uploadForm.notes}
                onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadResult} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add Result'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Detail Dialog */}
      <Dialog open={resultDetailOpen} onOpenChange={setResultDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Result Details</DialogTitle>
            <DialogDescription>
              Complete information about the placement result.
            </DialogDescription>
          </DialogHeader>
          {selectedResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Student Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedResult.studentName}</p>
                    <p><strong>Student ID:</strong> {selectedResult.studentId}</p>
                    <p><strong>Email:</strong> {selectedResult.email}</p>
                    <p><strong>Branch:</strong> {selectedResult.branch}</p>
                    <p><strong>Year:</strong> {selectedResult.year}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Placement Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Company:</strong> {selectedResult.company}</p>
                    <p><strong>Position:</strong> {selectedResult.position}</p>
                    <p><strong>Package:</strong> ₹{selectedResult.packageAmount} LPA</p>
                    <p><strong>Location:</strong> {selectedResult.location || 'N/A'}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge className={getStatusColor(selectedResult.status)}>
                        {selectedResult.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {selectedResult.notes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Notes</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedResult.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold">Upload Information</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Uploaded by:</strong> {selectedResult.uploadedBy}</p>
                  <p><strong>Upload date:</strong> {formatDate(selectedResult.uploadedAt)}</p>
                  <div className="flex items-center gap-2">
                    <strong>Verification:</strong>
                    {selectedResult.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;