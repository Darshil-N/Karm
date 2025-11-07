import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavLink } from '@/components/NavLink';
import { 
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const AdminSidebar = () => (
  <div className="p-6 space-y-6">
    <div className="mb-8">
      <h2 className="text-xl font-bold">Project Nexus</h2>
      <p className="text-sm text-muted-foreground">Authority Portal</p>
    </div>
    
    <nav className="space-y-2">
      <NavLink
        to="/admin/verify"
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
        activeClassName="bg-primary text-primary-foreground hover:bg-primary"
      >
        <Shield className="h-5 w-5" />
        Verify Colleges
      </NavLink>
    </nav>
  </div>
);

const AdminVerify = () => {
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const pendingColleges = [
    {
      id: '1',
      name: 'Stanford University',
      email: 'admin@stanford.edu',
      website: 'https://stanford.edu',
      licenseNumber: 'AICTE67890',
      submittedDate: '2024-02-20',
    },
    {
      id: '2',
      name: 'Oxford College of Engineering',
      email: 'admin@oxford.edu',
      website: 'https://oxford.edu',
      licenseNumber: 'UGC12345',
      submittedDate: '2024-02-18',
    },
  ];

  const verifiedColleges = [
    {
      id: '3',
      name: 'MIT College of Engineering',
      email: 'admin@mitcoe.edu',
      website: 'https://mitcoe.edu',
      licenseNumber: 'AICTE12345',
      verifiedDate: '2024-01-15',
    },
  ];

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
                  <p className="text-3xl font-bold">{pendingColleges.length + verifiedColleges.length}</p>
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
              <Badge variant="destructive" className="ml-2">{pendingColleges.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verified">Verified Colleges</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingColleges.map((college) => (
                    <div key={college.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{college.name}</h3>
                          <p className="text-sm text-muted-foreground">Submitted {college.submittedDate}</p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Email:</span> {college.email}
                        </div>
                        <div>
                          <span className="text-muted-foreground">License:</span> {college.licenseNumber}
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Website:</span> {college.website}
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
                        <Button variant="outline" size="sm" className="text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  {verifiedColleges.map((college) => (
                    <div key={college.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{college.name}</h3>
                          <p className="text-sm text-muted-foreground">Verified on {college.verifiedDate}</p>
                        </div>
                        <Badge className="bg-secondary">Verified</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Email:</span> {college.email}
                        </div>
                        <div>
                          <span className="text-muted-foreground">License:</span> {college.licenseNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Verification Modal */}
        <Dialog open={!!selectedCollege} onOpenChange={() => setSelectedCollege(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>College Verification Details</DialogTitle>
              <DialogDescription>Review all information before approval</DialogDescription>
            </DialogHeader>
            {selectedCollege && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">College Name</Label>
                  <p>{selectedCollege.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p>{selectedCollege.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p>{selectedCollege.licenseNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Attached Proof</Label>
                  <Button variant="outline" size="sm" className="mt-2">
                    <FileText className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
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

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default AdminVerify;
