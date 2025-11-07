import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import CreateDriveModal from '@/components/modals/CreateDriveModal';
import DriveDetailsModal from '@/components/modals/DriveDetailsModal';
import BulkEmailModal from '@/components/modals/BulkEmailModal';
import { getPlacementDrives, PlacementDriveData } from '@/lib/firebaseService';
import { 
  Briefcase, 
  Building2,
  TrendingUp,
  Users,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [createDriveOpen, setCreateDriveOpen] = useState(false);
  const [driveDetailsOpen, setDriveDetailsOpen] = useState(false);
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [drives, setDrives] = useState<PlacementDriveData[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Get only active drives for dashboard
  const getActiveDrives = () => {
    return drives.filter(drive => getDriveStatus(drive) === 'active').slice(0, 3); // Show only first 3 for dashboard
  };

  // Calculate dashboard statistics
  const getStats = () => {
    const activeDrives = drives.filter(drive => getDriveStatus(drive) === 'active');
    const uniqueCompanies = new Set(drives.map(drive => drive.companyName)).size;
    const totalApplications = drives.reduce((sum, drive) => sum + (drive.applicants || 0), 0);
    const placedStudents = Math.floor(totalApplications * 0.15); // Assuming 15% placement rate
    
    return {
      active: activeDrives.length,
      companies: uniqueCompanies,
      applications: totalApplications,
      placed: placedStudents
    };
  };

  // Fetch placement drives from Firebase
  const fetchDrives = async () => {
    console.log('Dashboard fetchDrives called with user:', user);
    
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
      console.log('Dashboard fetched drives:', fetchedDrives);
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

  const stats = getStats();

  const handleCreateNewDrive = () => {
    setCreateDriveOpen(true);
  };

  const handleDriveCreated = () => {
    // Refresh drives list when a new drive is created
    fetchDrives();
  };

  const handleManageDrive = (drive: any) => {
    setSelectedDrive(drive);
    setDriveDetailsOpen(true);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-drive':
        handleCreateNewDrive();
        break;
      case 'resume-parser':
        toast({
          title: "AI Resume Parser",
          description: "Opening resume parser tool...",
        });
        break;
      case 'bulk-email':
        setBulkEmailOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Placement Dashboard</h1>
          <p className="text-muted-foreground">Manage recruitment drives and student placements</p>
        </div>
        <Button className="gap-2" onClick={handleCreateNewDrive}>
          <Plus className="h-4 w-4" />
          Create New Drive
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-3xl font-bold">{loading ? '-' : stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-2">Currently accepting applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-3xl font-bold">{loading ? '-' : stats.companies}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Registered for placement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Students Placed</p>
                <p className="text-3xl font-bold">{loading ? '-' : stats.placed}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-secondary mt-2">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{loading ? '-' : stats.applications}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all drives</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Drives */}
      <Card>
        <CardHeader>
          <CardTitle>Active Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-lg">Loading active drives...</div>
                  <div className="text-sm text-muted-foreground">Please wait while we fetch the placement drives</div>
                </div>
              </div>
            ) : getActiveDrives().length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-lg">No active placement drives</div>
                  <div className="text-sm text-muted-foreground">Create your first placement drive to get started</div>
                </div>
              </div>
            ) : (
              getActiveDrives().map((drive) => (
                <div key={drive.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                      {drive.companyName[0]}
                    </div>
                    <div>
                      <p className="font-medium">{drive.companyName} - {drive.roleName}</p>
                      <p className="text-sm text-muted-foreground">
                        {drive.applicants || 0} applicants • {drive.salary} • Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-green-600">Active</span>
                    <Button size="sm" onClick={() => handleManageDrive(drive)}>Manage</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('create-drive')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Create New Drive</h3>
            <p className="text-sm text-muted-foreground">Add a new placement drive</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('resume-parser')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-bold mb-2">AI Resume Parser</h3>
            <p className="text-sm text-muted-foreground">Upload and parse resumes</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('bulk-email')}>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold mb-2">Send Bulk Email</h3>
            <p className="text-sm text-muted-foreground">Communicate with students</p>
          </CardContent>
        </Card>
      </div>

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
      />
    </div>
  );
};

export default Dashboard;