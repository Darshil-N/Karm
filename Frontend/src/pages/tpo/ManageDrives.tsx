import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getPlacementDrives, PlacementDriveData } from '@/lib/firebaseService';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Building2,
  MapPin,
  Edit,
  Eye,
  Trash2,
  Mail
} from 'lucide-react';
import CreateDriveModal from '@/components/modals/CreateDriveModal';
import DriveDetailsModal from '@/components/modals/DriveDetailsModal';
import BulkEmailModal from '@/components/modals/BulkEmailModal';

const ManageDrives = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [driveDetailsOpen, setDriveDetailsOpen] = useState(false);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [selectedDriveForEmail, setSelectedDriveForEmail] = useState<string | undefined>(undefined);
  const [drives, setDrives] = useState<PlacementDriveData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch placement drives from Firebase
  const fetchDrives = async () => {
    console.log('fetchDrives called with user:', user);
    
    if (!user || !user.collegeId) {
      console.error('User or collegeId missing:', { user, collegeId: user?.collegeId });
      toast({
        title: "Error",
        description: "Unable to find your college information. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const fetchedDrives = await getPlacementDrives(user.collegeId);
      console.log('Fetched drives:', fetchedDrives);
      setDrives(fetchedDrives);
    } catch (error) {
      console.error('Error fetching drives:', error);
      toast({
        title: "Error",
        description: "Failed to load placement drives.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [user, toast]);

  const handleCreateNewDrive = () => {
    setCreateDriveOpen(true);
  };

  const handleDriveCreated = () => {
    // Refresh drives list when a new drive is created
    fetchDrives();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    toast({
      title: "Search Updated",
      description: `Searching for: ${value}`,
    });
  };

  const handleFilter = (filterType: string) => {
    setSelectedFilter(filterType);
    toast({
      title: "Filter Applied",
      description: `Filtering by: ${filterType}`,
    });
  };

  const handleViewDrive = (drive: any) => {
    setSelectedDrive(drive);
    setDriveDetailsOpen(true);
  };

  const handleEditDrive = (driveId: string, company: string) => {
    toast({
      title: "Edit Drive",
      description: `Opening ${company} drive editor...`,
    });
  };

    const handleEmailApplicants = (driveId: string, companyName: string) => {
    setSelectedDriveForEmail(driveId);
    setBulkEmailOpen(true);
    toast({
      title: "Email Applicants",
      description: `Opening email composer for ${companyName} applicants`,
    });
  };

  const handleDeleteDrive = (driveId: string, companyName: string) => {
    toast({
      title: "Delete Drive",
      description: `Are you sure you want to delete ${companyName} drive?`,
      variant: "destructive",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to determine drive status based on dates
  const getDriveStatus = (drive: PlacementDriveData): string => {
    const now = new Date();
    const driveDate = new Date(drive.driveDate);
    const deadline = new Date(drive.applicationDeadline);
    
    // If manually set status is cancelled, keep it
    if (drive.status === 'cancelled') return 'cancelled';
    
    // If drive date has passed, it's completed
    if (driveDate < now) return 'completed';
    
    // If deadline has passed but drive hasn't happened yet, still active
    // If deadline hasn't passed, it's active
    if (deadline >= now || driveDate >= now) return 'active';
    
    return 'active';
  };

  // Filter drives to show only active ones by default
  const getFilteredDrives = () => {
    return drives.filter(drive => {
      const currentStatus = getDriveStatus(drive);
      
      // Apply search filter
      const matchesSearch = searchTerm === '' || 
        drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.roleName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // For now, show only active drives in the main view
      return matchesSearch && currentStatus === 'active';
    });
  };

  // Calculate stats
  const getStats = () => {
    const activeDrives = drives.filter(drive => getDriveStatus(drive) === 'active');
    const totalApplications = drives.reduce((sum, drive) => sum + (drive.applicants || 0), 0);
    const upcomingDrives = drives.filter(drive => getDriveStatus(drive) === 'upcoming');
    const totalDrives = drives.length;
    
    return {
      active: activeDrives.length,
      applications: totalApplications,
      upcoming: upcomingDrives.length,
      total: totalDrives
    };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Drives</h1>
          <p className="text-muted-foreground">Create, monitor and manage all placement drives</p>
        </div>
        <Button className="gap-2" onClick={handleCreateNewDrive}>
          <Plus className="h-4 w-4" />
          Create New Drive
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{stats.applications}</p>
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
                <p className="text-sm text-muted-foreground">Upcoming Drives</p>
                <p className="text-3xl font-bold">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drives</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
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
                placeholder="Search drives by company, role, or location..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Status')}>
                <Filter className="h-4 w-4" />
                Status
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Date Range')}>
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleFilter('Company')}>
                <Building2 className="h-4 w-4" />
                Company
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drives Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-lg">Loading drives...</div>
                  <div className="text-sm text-muted-foreground">Please wait while we fetch the placement drives</div>
                </div>
              </div>
            ) : getFilteredDrives().length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-lg">No active placement drives found</div>
                  <div className="text-sm text-muted-foreground">Create your first placement drive to get started</div>
                </div>
              </div>
            ) : (
              getFilteredDrives().map((drive) => {
                const currentStatus = getDriveStatus(drive);
                return (
                  <div key={drive.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                        {drive.companyName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{drive.companyName}</h3>
                          <Badge className={getStatusColor(currentStatus)}>
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                          </Badge>
                          <Badge variant="outline">{drive.workMode}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{drive.roleName}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {drive.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {drive.applicants} applicants
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{drive.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleViewDrive(drive)}>
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => drive.id && handleEmailApplicants(drive.id, drive.companyName)}>
                      <Mail className="h-3 w-3" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => drive.id && handleEditDrive(drive.id, drive.companyName)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive" onClick={() => drive.id && handleDeleteDrive(drive.id, drive.companyName)}>
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateDriveModal 
        open={createDriveOpen} 
        onOpenChange={setCreateDriveOpen}
        onDriveCreated={handleDriveCreated}
      />
      <DriveDetailsModal 
        open={driveDetailsOpen} 
        onOpenChange={setDriveDetailsOpen}
        drive={selectedDrive}
      />
      <BulkEmailModal
        open={bulkEmailOpen}
        onOpenChange={setBulkEmailOpen}
        selectedDriveId={selectedDriveForEmail}
      />
    </div>
  );
};

export default ManageDrives;