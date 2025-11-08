import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DriveService, StudentService, ApplicationService } from '@/services/firebaseService';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Loader2
} from 'lucide-react';

const PlacementDrives = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Load drives and student data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all drives
        const allDrives = await DriveService.getAllDrives();
        
        // Filter only active drives
        const activeDrives = allDrives.filter(drive => 
          drive.status === 'active' || drive.status === 'upcoming'
        );
        
        setDrives(activeDrives);

        // Load student data if user is available
        if (user?.studentId) {
          const student = await StudentService.getStudentByStudentId(user.studentId);
          setStudentData(student);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load placement drives",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const handleApplyToDrive = async (drive: any) => {
    if (!user || !studentData) {
      toast({
        title: "Error",
        description: "Please complete your profile first",
        variant: "destructive"
      });
      return;
    }

    // Check eligibility
    if (drive.eligibilityCriteria.minCGPA && studentData.cgpa < parseFloat(drive.eligibilityCriteria.minCGPA)) {
      toast({
        title: "Not Eligible",
        description: `Minimum CGPA required: ${drive.eligibilityCriteria.minCGPA}`,
        variant: "destructive"
      });
      return;
    }

    if (drive.eligibilityCriteria.allowedBranches && drive.eligibilityCriteria.allowedBranches.length > 0) {
      if (!drive.eligibilityCriteria.allowedBranches.includes(studentData.branch)) {
        toast({
          title: "Not Eligible",
          description: `This drive is only for: ${drive.eligibilityCriteria.allowedBranches.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
    }

    setSelectedDrive(drive);
    setIsApplicationModalOpen(true);
  };

  const submitApplication = async () => {
    if (!selectedDrive || !studentData) return;

    try {
      setIsApplying(true);
      
      await ApplicationService.applyForDrive(user?.studentId || '', selectedDrive.id, {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        cgpa: studentData.cgpa,
        branch: studentData.branch,
        year: studentData.year,
        skillSet: studentData.skillSet || [],
        resume: studentData.resume || ''
      });

      toast({
        title: "Application Submitted",
        description: `Successfully applied to ${selectedDrive.companyName}`,
      });
      
      setIsApplicationModalOpen(false);
      setSelectedDrive(null);
      
      // Refresh drives to update application status
      const allDrives = await DriveService.getAllDrives();
      const activeDrives = allDrives.filter(drive => 
        drive.status === 'active' || drive.status === 'upcoming'
      );
      setDrives(activeDrives);
      
    } catch (error: any) {
      console.error('Error applying to drive:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };



  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleApply = async (drive: any) => {
    await handleApplyToDrive(drive);
  };

  const handleBookmark = (driveId: number, companyName: string, isBookmarked: boolean) => {
    toast({
      title: isBookmarked ? "Removed from Bookmarks" : "Added to Bookmarks",
      description: `${companyName} drive ${isBookmarked ? 'removed from' : 'added to'} your bookmarks.`,
    });
  };

  const handleViewDetails = (driveId: number) => {
    toast({
      title: "Drive Details",
      description: "Opening detailed drive information...",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'upcoming': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredDrives = drives.filter(drive => {
    const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drive.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = false;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'open') {
      matchesStatus = drive.status === 'active' || drive.status === 'open';
    } else {
      matchesStatus = drive.status.toLowerCase() === filterStatus.toLowerCase();
    }
    
    const matchesType = filterType === 'all' || drive.jobType?.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalDrives: drives.length,
    openDrives: drives.filter(d => d.status === 'active' || d.status === 'open').length,
    appliedDrives: 0, // Will be calculated from ApplicationService
    bookmarkedDrives: 0 // Will be implemented later
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Placement Drives</h1>
          <p className="text-muted-foreground">Explore and apply to placement opportunities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drives</p>
                <p className="text-3xl font-bold">{stats.totalDrives}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Drives</p>
                <p className="text-3xl font-bold text-green-600">{stats.openDrives}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="text-3xl font-bold text-blue-600">{stats.appliedDrives}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bookmarked</p>
                <p className="text-3xl font-bold text-orange-600">{stats.bookmarkedDrives}</p>
              </div>
              <Bookmark className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies or roles..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drives List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Drives</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredDrives.map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-semibold">{drive.companyName}</h3>
                        <Badge className={`${getStatusColor(drive.status)} border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(drive.status)}
                            {drive.status === 'active' ? 'Open' : drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                          </div>
                        </Badge>
                        {drive.applied && (
                          <Badge variant="secondary">Applied</Badge>
                        )}
                      </div>
                      <p className="text-lg font-medium text-primary mb-2">{drive.roleName}</p>
                      <p className="text-sm text-muted-foreground mb-3">{drive.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {drive.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {drive.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(drive.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {drive.applicants} applied
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {drive.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {drive.skills.length > 4 && (
                          <Badge variant="outline">
                            +{drive.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmark(drive.id, drive.companyName, drive.bookmarked)}
                    >
                      {drive.bookmarked ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(drive.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {(drive.status === 'active' || drive.status === 'open') && !drive.applied && (
                      <Button onClick={() => handleApply(drive)}>
                        Apply Now
                      </Button>
                    )}
                    {drive.applied && (
                      <Button variant="secondary" disabled>
                        Applied
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">Eligibility:</p>
                      <p className="text-muted-foreground">{drive.eligibility}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Selection Process:</p>
                      <p className="text-muted-foreground">{drive.rounds.join(' → ')}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Drive Date:</p>
                      <p className="text-muted-foreground">{new Date(drive.driveDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          {filteredDrives.filter(drive => drive.applied).map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{drive.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{drive.roleName}</p>
                      <p className="text-xs text-muted-foreground">Applied on: {drive.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Applied</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{drive.salary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4">
          {filteredDrives.filter(drive => drive.bookmarked).map((drive) => (
            <Card key={drive.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{drive.companyName}</h3>
                      <p className="text-sm text-muted-foreground">{drive.roleName}</p>
                      <p className="text-xs text-muted-foreground">Deadline: {drive.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookmark(drive.id, drive.companyName, drive.bookmarked)}
                    >
                      <BookmarkCheck className="h-4 w-4" />
                    </Button>
                    {(drive.status === 'active' || drive.status === 'open') && !drive.applied && (
                      <Button onClick={() => handleApply(drive)}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Application Confirmation Modal */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply to {selectedDrive?.companyName} for the {selectedDrive?.roleName} position?
              Your profile details will be automatically submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {studentData && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>Email:</strong> {studentData.email}</p>
                <p><strong>CGPA:</strong> {studentData.cgpa}</p>
                <p><strong>Branch:</strong> {studentData.branch}</p>
                <p><strong>Year:</strong> {studentData.year}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApplicationModalOpen(false)}
              disabled={isApplying}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitApplication}
              disabled={isApplying}
            >
              {isApplying ? "Applying..." : "Confirm Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlacementDrives;