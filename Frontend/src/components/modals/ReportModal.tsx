import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Download, Filter, BarChart3, FileText } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ReportConfig {
  reportType: string;
  title: string;
  description: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  filters: {
    branches: string[];
    companies: string[];
    placementStatus: string[];
    salaryRange: {
      min: string;
      max: string;
    };
  };
  includeCharts: boolean;
  includeStudentDetails: boolean;
  includeCompanyDetails: boolean;
  format: string;
  emailRecipients: string[];
  scheduledGeneration: {
    enabled: boolean;
    frequency: string;
    nextRun: Date | undefined;
  };
}

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'generate' | 'schedule' | 'filter';
}

const ReportModal = ({ open, onOpenChange, type }: ReportModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'placement-summary',
    title: '',
    description: '',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    filters: {
      branches: [],
      companies: [],
      placementStatus: [],
      salaryRange: {
        min: '',
        max: '',
      },
    },
    includeCharts: true,
    includeStudentDetails: false,
    includeCompanyDetails: false,
    format: 'pdf',
    emailRecipients: [],
    scheduledGeneration: {
      enabled: false,
      frequency: 'weekly',
      nextRun: undefined,
    },
  });

  const reportTypes = [
    { value: 'placement-summary', label: 'Placement Summary Report' },
    { value: 'company-wise', label: 'Company-wise Analysis' },
    { value: 'branch-wise', label: 'Branch-wise Performance' },
    { value: 'student-list', label: 'Student Details Report' },
    { value: 'drive-analysis', label: 'Drive Performance Analysis' },
    { value: 'salary-analysis', label: 'Salary Analysis Report' },
    { value: 'trend-analysis', label: 'Placement Trends' },
    { value: 'custom', label: 'Custom Report' },
  ];

  const branches = [
    'Computer Science', 'Information Technology', 'Electronics', 
    'Mechanical', 'Civil', 'Electrical', 'Chemical'
  ];

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 
    'Accenture', 'Cognizant', 'IBM', 'Oracle'
  ];

  const placementStatusOptions = [
    'Placed', 'In Process', 'Applying', 'Not Placed'
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'html', label: 'HTML Report' },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  const addEmailRecipient = () => {
    if (currentEmail.trim() && !config.emailRecipients.includes(currentEmail.trim())) {
      setConfig(prev => ({
        ...prev,
        emailRecipients: [...prev.emailRecipients, currentEmail.trim()]
      }));
      setCurrentEmail('');
    }
  };

  const removeEmailRecipient = (email: string) => {
    setConfig(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter(e => e !== email)
    }));
  };

  const handleBranchToggle = (branch: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        branches: prev.filters.branches.includes(branch)
          ? prev.filters.branches.filter(b => b !== branch)
          : [...prev.filters.branches, branch]
      }
    }));
  };

  const handleCompanyToggle = (company: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        companies: prev.filters.companies.includes(company)
          ? prev.filters.companies.filter(c => c !== company)
          : [...prev.filters.companies, company]
      }
    }));
  };

  const handleStatusToggle = (status: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        placementStatus: prev.filters.placementStatus.includes(status)
          ? prev.filters.placementStatus.filter(s => s !== status)
          : [...prev.filters.placementStatus, status]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call - replace with Firebase integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would integrate with Firebase and report generation service
      // const reportRef = await addDoc(collection(db, 'reports'), {
      //   ...config,
      //   createdAt: new Date(),
      //   createdBy: currentUser.uid,
      //   status: config.scheduledGeneration.enabled ? 'scheduled' : 'generated'
      // });

      if (type === 'generate') {
        toast({
          title: "Report Generated Successfully",
          description: `${config.title || 'Report'} has been generated and is ready for download.`,
        });
      } else if (type === 'schedule') {
        toast({
          title: "Report Scheduled",
          description: `Report generation has been scheduled for ${config.scheduledGeneration.frequency} frequency.`,
        });
      } else {
        toast({
          title: "Filters Applied",
          description: "Report filters have been applied successfully.",
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process report request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'generate': return 'Generate Report';
      case 'schedule': return 'Schedule Report';
      case 'filter': return 'Apply Filters';
      default: return 'Report Configuration';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'generate' && <FileText className="h-5 w-5" />}
            {type === 'schedule' && <CalendarIcon className="h-5 w-5" />}
            {type === 'filter' && <Filter className="h-5 w-5" />}
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type & Basic Info */}
          {(type === 'generate' || type === 'schedule') && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Report Type *</Label>
                  <Select 
                    value={config.reportType} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, reportType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select 
                    value={config.format} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map(format => (
                        <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter report title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the report"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Date Range</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {config.dateRange.from ? format(config.dateRange.from, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={config.dateRange.from}
                      onSelect={(date) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {config.dateRange.to ? format(config.dateRange.to, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={config.dateRange.to}
                      onSelect={(date) => setConfig(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            
            {/* Branches */}
            <div className="space-y-2">
              <Label>Branches</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {branches.map(branch => (
                  <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={config.filters.branches.includes(branch)}
                      onCheckedChange={() => handleBranchToggle(branch)}
                    />
                    <span className="text-sm">{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Companies */}
            <div className="space-y-2">
              <Label>Companies</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {companies.map(company => (
                  <label key={company} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={config.filters.companies.includes(company)}
                      onCheckedChange={() => handleCompanyToggle(company)}
                    />
                    <span className="text-sm">{company}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Placement Status */}
            <div className="space-y-2">
              <Label>Placement Status</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {placementStatusOptions.map(status => (
                  <label key={status} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={config.filters.placementStatus.includes(status)}
                      onCheckedChange={() => handleStatusToggle(status)}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <Label>Salary Range (LPA)</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Minimum salary"
                  value={config.filters.salaryRange.min}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      salaryRange: { ...prev.filters.salaryRange, min: e.target.value }
                    }
                  }))}
                />
                <Input
                  placeholder="Maximum salary"
                  value={config.filters.salaryRange.max}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      salaryRange: { ...prev.filters.salaryRange, max: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Report Options */}
          {(type === 'generate' || type === 'schedule') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Report Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={config.includeCharts}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCharts: !!checked }))}
                  />
                  <span>Include Charts and Graphs</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={config.includeStudentDetails}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeStudentDetails: !!checked }))}
                  />
                  <span>Include Student Details</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={config.includeCompanyDetails}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCompanyDetails: !!checked }))}
                  />
                  <span>Include Company Details</span>
                </label>
              </div>
            </div>
          )}

          {/* Scheduling Options */}
          {type === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scheduling Options</h3>
              
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select 
                  value={config.scheduledGeneration.frequency} 
                  onValueChange={(value) => setConfig(prev => ({
                    ...prev,
                    scheduledGeneration: { ...prev.scheduledGeneration, frequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    placeholder="Add email address"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmailRecipient())}
                  />
                  <Button type="button" onClick={addEmailRecipient}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.emailRecipients.map(email => (
                    <span key={email} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      {email}
                      <button type="button" onClick={() => removeEmailRecipient(email)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                type === 'generate' ? "Generating..." : 
                type === 'schedule' ? "Scheduling..." : "Applying..."
              ) : (
                type === 'generate' ? "Generate Report" : 
                type === 'schedule' ? "Schedule Report" : "Apply Filters"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;