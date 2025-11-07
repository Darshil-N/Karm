import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  sendBulkEmail, 
  getStudentsByCollege, 
  getStudentsByDrive,
  UserData 
} from '@/lib/firebaseService';
import { testEmailService } from '@/lib/emailTestUtils';
import { checkEmailConfiguration } from '@/lib/emailService';
import { 
  Mail,
  Users,
  Send,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BulkEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDriveId?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const BulkEmailModal = ({ open, onOpenChange, selectedDriveId }: BulkEmailModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Email composition state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [students, setStudents] = useState<UserData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<UserData[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState(user?.email || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [activeTab, setActiveTab] = useState('compose');

  // Test email functionality
  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address for testing.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      console.log('🧪 Starting test email to:', testEmail);
      await testEmailService(testEmail);
      
      toast({
        title: "✅ Test Email Sent Successfully!",
        description: `Test email sent to ${testEmail}. Check your inbox (including spam folder).`,
      });
      
      // Show additional helpful info
      setTimeout(() => {
        toast({
          title: "📬 Email Delivery Tips",
          description: "If you don't see the email: 1) Check spam/junk folder 2) Wait 2-5 minutes 3) Check console for detailed logs",
        });
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Test email failed:', error);
      
      const errorMessage = error?.message || 'Unknown error occurred';
      
      toast({
        title: "❌ Test Email Failed",
        description: `Error: ${errorMessage}. Check browser console for detailed logs.`,
        variant: "destructive"
      });
      
      // Log detailed error info for debugging
      console.group('🔍 Email Test Debugging Info');
      console.log('Email address:', testEmail);
      console.log('Error details:', error);
      console.log('Check the following:');
      console.log('1. Internet connection');
      console.log('2. Email service configuration');
      console.log('3. Email address validity');
      console.groupEnd();
      
    } finally {
      setTesting(false);
    }
  };

  // Email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: 'placement-announcement',
      name: 'Placement Drive Announcement',
      subject: 'New Placement Opportunity - {companyName}',
      content: `Dear Students,

We are excited to announce a new placement opportunity with {companyName} for the position of {roleName}.

Key Details:
- Position: {roleName}
- Company: {companyName}
- Application Deadline: {deadline}
- Location: {location}

Please log in to your placement portal to apply and view complete details.

Best regards,
Placement Office`
    },
    {
      id: 'application-reminder',
      name: 'Application Deadline Reminder',
      subject: 'Reminder: Application Deadline Approaching',
      content: `Dear Students,

This is a friendly reminder that the application deadline for the following placement drives is approaching:

Please ensure you submit your applications before the deadline.

Best regards,
Placement Office`
    },
    {
      id: 'interview-schedule',
      name: 'Interview Schedule Notification',
      subject: 'Interview Schedule - {companyName}',
      content: `Dear Student,

Your interview has been scheduled for {companyName}.

Details:
- Date: {date}
- Time: {time}
- Mode: {mode}
- Round: {round}

Please be prepared and join on time.

Best regards,
Placement Office`
    }
  ];

  // Fetch students when modal opens
  useEffect(() => {
    if (open && user?.collegeId) {
      fetchStudents();
    }
  }, [open, user?.collegeId, selectedDriveId]);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Branch filter
    if (filterBranch) {
      filtered = filtered.filter(student => student.department === filterBranch);
    }

    // Year filter
    if (filterYear) {
      filtered = filtered.filter(student => student.graduationYear === filterYear);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterBranch, filterYear]);

  // Set default test email when user data is available
  useEffect(() => {
    if (user?.email && !testEmail) {
      setTestEmail(user.email);
    }
  }, [user?.email, testEmail]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let fetchedStudents: UserData[] = [];

      if (selectedDriveId) {
        // Fetch students who applied for specific drive
        fetchedStudents = await getStudentsByDrive(selectedDriveId);
      } else {
        // Fetch all students from college
        fetchedStudents = await getStudentsByCollege(user!.collegeId!);
      }

      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(student => student.uid));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setMessage(template.content);
    setActiveTab('compose');
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      });
      return;
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one student to send email to.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      
      // Get email addresses of selected students
      const recipientEmails = filteredStudents
        .filter(student => selectedStudents.includes(student.uid))
        .map(student => student.email);

      await sendBulkEmail({
        to: recipientEmails,
        subject: subject,
        htmlContent: message.replace(/\n/g, '<br>'),
        from: user?.email || 'placement@college.edu',
        senderName: `${user?.name || 'Placement Office'} - TPO`
      });

      toast({
        title: "Email Sent Successfully!",
        description: `Email sent to ${selectedStudents.length} students.`,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedStudents([]);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Error sending bulk email:', error);
      toast({
        title: "Failed to Send Email",
        description: error.message || "There was an error sending the email.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getUniqueBranches = () => {
    return Array.from(new Set(students.map(s => s.department).filter(Boolean)));
  };

  const getUniqueYears = () => {
    return Array.from(new Set(students.map(s => s.graduationYear).filter(Boolean)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Bulk Email
          </DialogTitle>
          <DialogDescription>
            Send emails to students in your college
            {selectedDriveId ? ' who applied for the selected drive' : ''}
          </DialogDescription>
          
          {/* Email Configuration Status */}
          <div className="mt-2">
            {(() => {
              const config = checkEmailConfiguration();
              return (
                <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded-md ${
                  config.configured 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {config.configured ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {config.configured 
                    ? `Email service ready (${config.service})`
                    : 'Email service not configured - See EMAIL_SETUP.md'
                  }
                </div>
              );
            })()}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="recipients">Recipients ({filteredStudents.length})</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Compose your email message..."
                  className="min-h-[200px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Test Email Section */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div>
                  <p className="text-sm font-medium">Test Email Service</p>
                  <p className="text-xs text-muted-foreground">
                    Send a test email to verify configuration and email delivery
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="testEmail" className="sr-only">Test Email Address</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      placeholder="Enter email address for testing"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleTestEmail}
                    disabled={testing || !testEmail.trim()}
                    className="gap-2 shrink-0"
                  >
                    {testing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {testing ? 'Testing...' : 'Send Test'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedStudents.length} recipients selected
                </div>
                <Button 
                  onClick={handleSendEmail} 
                  disabled={sending || selectedStudents.length === 0}
                  className="gap-2"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {sending ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select 
                value={filterBranch} 
                onChange={(e) => setFilterBranch(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All Branches</option>
                {getUniqueBranches().map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Select All */}
            <div className="flex items-center space-x-2 border-b pb-2">
              <Checkbox
                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label className="text-sm font-medium">
                Select All ({filteredStudents.length} students)
              </label>
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <div>Loading students...</div>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.uid} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={selectedStudents.includes(student.uid)}
                      onCheckedChange={(checked) => handleSelectStudent(student.uid, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.email} • {student.department} • {student.graduationYear}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Subject:</strong> {template.subject}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-3">
                        {template.content.substring(0, 150)}...
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleUseTemplate(template)}
                        className="mt-2"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEmailModal;