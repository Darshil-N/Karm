export interface College {
  id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
  verified: boolean;
  submittedDate: string;
  proofUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'hod' | 'tpo' | 'authority';
  collegeId: string;
  department?: string;
  approved: boolean;
}

export interface Drive {
  id: string;
  companyName: string;
  companyLogo: string;
  role: string;
  package: string;
  eligibility: string;
  description: string;
  status: 'active' | 'upcoming' | 'completed';
  applicants: number;
}

// Mock Colleges Data
export const mockColleges: College[] = [
  {
    id: '1',
    name: 'MIT College of Engineering',
    email: 'admin@mitcoe.edu',
    website: 'https://mitcoe.edu',
    licenseNumber: 'AICTE12345',
    verified: true,
    submittedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Stanford University',
    email: 'admin@stanford.edu',
    website: 'https://stanford.edu',
    licenseNumber: 'AICTE67890',
    verified: false,
    submittedDate: '2024-02-20',
  },
];

// Mock Drives Data
export const mockDrives: Drive[] = [
  {
    id: '1',
    companyName: 'Google',
    companyLogo: '🔍',
    role: 'Software Engineer',
    package: '₹18 LPA',
    eligibility: '7.0+ CGPA',
    description: 'Full-time software engineering role working on cutting-edge technologies.',
    status: 'active',
    applicants: 145,
  },
  {
    id: '2',
    companyName: 'Microsoft',
    companyLogo: '💻',
    role: 'Cloud Solutions Architect',
    package: '₹22 LPA',
    eligibility: '7.5+ CGPA',
    description: 'Design and implement cloud solutions for enterprise clients.',
    status: 'active',
    applicants: 98,
  },
  {
    id: '3',
    companyName: 'Amazon',
    companyLogo: '📦',
    role: 'SDE-1',
    package: '₹20 LPA',
    eligibility: '7.0+ CGPA',
    description: 'Work on large-scale distributed systems.',
    status: 'upcoming',
    applicants: 0,
  },
];

// Mock API Functions
export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo users for testing
      const demoUsers: Record<string, User> = {
        'student@test.com': {
          id: '1',
          name: 'John Doe',
          email: 'student@test.com',
          role: 'student',
          collegeId: '1',
          department: 'Computer Science',
          approved: true,
        },
        'tpo@test.com': {
          id: '2',
          name: 'Jane Smith',
          email: 'tpo@test.com',
          role: 'tpo',
          collegeId: '1',
          approved: true,
        },
        'hod@test.com': {
          id: '3',
          name: 'Dr. Robert Brown',
          email: 'hod@test.com',
          role: 'hod',
          collegeId: '1',
          department: 'Computer Science',
          approved: true,
        },
        'authority@test.com': {
          id: '4',
          name: 'Admin User',
          email: 'authority@test.com',
          role: 'authority',
          collegeId: '0',
          approved: true,
        },
      };
      
      resolve(demoUsers[email] || null);
    }, 1000);
  });
};

export const mockFetchDrives = async (): Promise<Drive[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDrives);
    }, 1000);
  });
};

export const mockFetchColleges = async (): Promise<College[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockColleges.filter(c => c.verified));
    }, 1000);
  });
};
