import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NavLink } from '@/components/NavLink';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  Key,
  Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  getPendingColleges, 
  getApprovedColleges,
  approveCollege, 
  rejectCollege, 
  CollegeData 
} from '@/lib/firebaseService';
import { auth } from '@/lib/firebase';

const AdminSidebar = () => (
  <div className="p-6 space-y-6">
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground">Project Nexus</h2>
      <p className="text-sm text-muted-foreground">Authority Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/admin/verify"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
        activeClassName="bg-accent text-accent-foreground hover:bg-accent"
      >
        <Shield className="h-5 w-5" />
        Verify Colleges
      </NavLink>
    </nav>
  </div>
);

const AdminVerify = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Move useAuth to top level
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);
  const [pendingColleges, setPendingColleges] = useState<CollegeData[]>([]);
  const [verifiedColleges, setVerifiedColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalModal, setApprovalModal] = useState(false);
  const [passwords, setPasswords] = useState({
    tpoPassword: '',
    hodPassword: ''
  });
  const [approving, setApproving] = useState(false);

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Fetch pending colleges from Firebase
  const fetchPendingColleges = async () => {
    try {
      setLoading(true);
      const colleges = await getPendingColleges();
      setPendingColleges(colleges);
    } catch (error) {
      console.error('Error fetching pending colleges:', error);
      toast({
        title: "Error",
        description: "Failed to load pending colleges.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch verified colleges from Firebase
  const fetchVerifiedColleges = async () => {
    try {
      const colleges = await getApprovedColleges();
      console.log('Fetched verified colleges:', colleges);
      setVerifiedColleges(colleges);
    } catch (error) {
      console.error('Error fetching verified colleges:', error);
      toast({
        title: "Error",
        description: "Failed to load verified colleges.",
        variant: "destructive",
      });
    }
  };

  // Fetch both pending and verified colleges
  const fetchAllColleges = async () => {
    setLoading(true);
    await Promise.all([
      fetchPendingColleges(),
      fetchVerifiedColleges()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllColleges();
  }, []);

  // Handle college approval
  const handleApproval = (college: CollegeData) => {
    setSelectedCollege(college);
    setPasswords({
      tpoPassword: generatePassword(),
      hodPassword: generatePassword()
    });
    setApprovalModal(true);
  };

  // Approve college
  const approveCollegeHandler = async () => {
    if (!selectedCollege?.id) return;
    
    setApproving(true);
    try {
      // Store current user before approval process
      const authContextUser = user;
      
      await approveCollege(selectedCollege.id, passwords.tpoPassword, passwords.hodPassword);
      
      toast({
        title: "College Approved!",
        description: `${selectedCollege.name} has been approved. TPO and HOD accounts created.`,
      });

      // Show credentials to authority
      toast({
        title: "Login Credentials Created",
        description: `TPO: ${selectedCollege.tpoEmail} | Password: ${passwords.tpoPassword}\nHOD: ${selectedCollege.hodEmail} | Password: ${passwords.hodPassword}`,
        duration: 15000, // Show for 15 seconds
      });

      // The authority user might have been signed out during account creation
      // If so, we need to re-authenticate them
      if (!auth.currentUser && authContextUser) {
        toast({
          title: "Session Notice", 
          description: "Please refresh the page to continue as authority user.",
          duration: 5000,
        });
      }

      // Refresh both lists
      await fetchAllColleges();
      setApprovalModal(false);
      setSelectedCollege(null);
    } catch (error: any) {
      console.error('Approval error:', error);
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  // Handle college rejection
  const handleRejection = async (college: CollegeData) => {
    if (!college.id) return;
    
    try {
      await rejectCollege(college.id);
      
      toast({
        title: "College Rejected",
        description: `${college.name} has been rejected.`,
      });

      // Refresh the list
      fetchPendingColleges();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const pendingCount = pendingColleges.length;
  const verifiedCount = verifiedColleges.length;

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">College Verification</h1>
            <p className="text-muted-foreground">Review and approve college registrations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">{pendingColleges.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-3xl font-bold">{verifiedColleges.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold">{pendingCount + verifiedCount}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Colleges
              <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">Verified Colleges</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-lg">Loading colleges...</div>
                      <div className="text-sm text-muted-foreground">Please wait while we fetch pending colleges</div>
                    </div>
                  </div>
                ) : pendingColleges.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-lg">No pending colleges</div>
                      <div className="text-sm text-muted-foreground">All colleges have been processed</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingColleges.map((college) => (
                      <div key={college.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{college.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Submitted {new Date(college.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">TPO Email:</span> {college.tpoEmail}
                          </div>
                          <div>
                            <span className="text-muted-foreground">HOD Email:</span> {college.hodEmail}
                          </div>
                          <div>
                            <span className="text-muted-foreground">License:</span> {college.licenseNumber}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Website:</span> 
                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                              {college.website}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCollege(college)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleRejection(college)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApproval(college)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <CardTitle>Verified Colleges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading verified colleges...</p>
                    </div>
                  ) : verifiedColleges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No verified colleges yet</p>
                    </div>
                  ) : (
                    verifiedColleges.map((college) => (
                      <div key={college.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{college.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Verified on {new Date(college.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">TPO Email:</span> {college.tpoEmail}
                          </div>
                          <div>
                            <span className="text-muted-foreground">HOD Email:</span> {college.hodEmail}
                          </div>
                          <div>
                            <span className="text-muted-foreground">License:</span> {college.licenseNumber}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Details Modal */}
        <Dialog open={!!selectedCollege && !approvalModal} onOpenChange={() => setSelectedCollege(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>College Details</DialogTitle>
              <DialogDescription>Review all college information</DialogDescription>
            </DialogHeader>
            {selectedCollege && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">College Name</Label>
                  <p>{selectedCollege.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">TPO Email</Label>
                  <p>{selectedCollege.tpoEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">HOD Email</Label>
                  <p>{selectedCollege.hodEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p>{selectedCollege.licenseNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {selectedCollege.website}
                  </a>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted Date</Label>
                  <p>{new Date(selectedCollege.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleRejection(selectedCollege)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleApproval(selectedCollege)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Modal with Password Generation */}
        <Dialog open={approvalModal} onOpenChange={(open) => {
          setApprovalModal(open);
          if (!open) {
            setSelectedCollege(null);
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve College & Generate Credentials</DialogTitle>
              <DialogDescription>
                This will create TPO and HOD accounts with auto-generated passwords
              </DialogDescription>
            </DialogHeader>
            {selectedCollege && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">College: {selectedCollege.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>TPO Email: {selectedCollege.tpoEmail}</div>
                    <div>HOD Email: {selectedCollege.hodEmail}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tpoPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      TPO Password
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="tpoPassword"
                        type="text"
                        value={passwords.tpoPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, tpoPassword: e.target.value }))}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPasswords(prev => ({ ...prev, tpoPassword: generatePassword() }))}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="hodPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      HOD Password
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="hodPassword"
                        type="text"
                        value={passwords.hodPassword}
                        onChange={(e) => setPasswords(prev => ({ ...prev, hodPassword: e.target.value }))}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPasswords(prev => ({ ...prev, hodPassword: generatePassword() }))}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                      <strong>Note:</strong> Make sure to securely share these credentials with the TPO and HOD.
                      Consider sending them via a secure channel.
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setApprovalModal(false)}
                    disabled={approving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={approveCollegeHandler}
                    disabled={approving || !passwords.tpoPassword || !passwords.hodPassword}
                  >
                    {approving ? 'Creating Accounts...' : 'Approve & Create Accounts'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminVerify;
