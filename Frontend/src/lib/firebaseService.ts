import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  addDoc 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Types
export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'authority' | 'tpo' | 'hod' | 'student';
  isApproved: boolean;
  collegeId?: string; // Optional for authority, required for others
  department?: string; // Only for students and HODs
  graduationYear?: string; // Only for students
  phone?: string; // Optional contact information
  createdAt: Date;
}

export interface CollegeData {
  id?: string;
  name: string;
  website: string;
  licenseNumber: string;
  tpoEmail: string;
  hodEmail: string;
  isApproved: boolean;
  tpoUid?: string;
  hodUid?: string;
  createdAt: Date;
}

export interface PlacementDriveData {
  id?: string;
  companyName: string;
  roleName: string;
  jobDescription: string;
  salary: string;
  location: string;
  workMode: string;
  experience: string;
  skills: string[];
  eligibilityCriteria: {
    minCGPA: string;
    allowedBranches: string[];
    passingYear: string;
    backlogsAllowed: boolean;
  };
  applicationDeadline: Date;
  driveDate: Date;
  rounds: string[];
  benefits: string;
  bondPeriod: string;
  contactEmail: string;
  contactPhone: string;
  tpoUid: string;
  collegeId: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  applicants: number;
  createdAt: Date;
  updatedAt: Date;
}

// Auth Functions
export const loginWithEmail = async (email: string, password: string): Promise<UserData | null> => {
  try {
    console.log('Attempting login with email:', email);
    console.log('Firebase auth instance:', auth);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Login successful, user:', user);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      console.log('User data from Firestore:', userData);
      
      // Check if user is approved (except authority)
      if (userData.role !== 'authority' && !userData.isApproved) {
        throw new Error('Your account is pending approval');
      }
      
      return userData;
    } else {
      throw new Error('User data not found');
    }
  } catch (error: any) {
    console.error('Login error details:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email address.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later.');
    }
    
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// College Registration
export const registerCollege = async (collegeData: Omit<CollegeData, 'id' | 'isApproved' | 'createdAt' | 'tpoUid' | 'hodUid'>): Promise<string> => {
  try {
    // Create college document first
    const collegeDocRef = await addDoc(collection(db, 'colleges'), {
      name: collegeData.name,
      website: collegeData.website,
      licenseNumber: collegeData.licenseNumber,
      tpoEmail: collegeData.tpoEmail,
      hodEmail: collegeData.hodEmail,
      isApproved: false,
      createdAt: new Date()
    });
    
    const collegeId = collegeDocRef.id;
    
    // Note: TPO and HOD accounts will be created when the authority approves the college
    // This is to avoid creating Firebase Auth accounts with temporary passwords
    
    return collegeId;
  } catch (error) {
    console.error('College registration error:', error);
    throw error;
  }
};

// Student Registration
export const registerStudent = async (
  email: string, 
  password: string, 
  name: string, 
  collegeId: string, 
  department: string
): Promise<string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: 'student',
      isApproved: false,
      collegeId: collegeId,
      department: department,
      createdAt: new Date()
    });
    
    // Sign out after registration
    await signOut(auth);
    
    return user.uid;
  } catch (error) {
    console.error('Student registration error:', error);
    throw error;
  }
};

// Get pending colleges for authority approval
export const getPendingColleges = async (): Promise<CollegeData[]> => {
  try {
    const q = query(collection(db, 'colleges'), where('isApproved', '==', false));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CollegeData));
  } catch (error) {
    console.error('Error fetching pending colleges:', error);
    throw error;
  }
};

// Approve college
export const approveCollege = async (collegeId: string, tpoPassword: string, hodPassword: string): Promise<void> => {
  try {
    console.log('Starting college approval process for:', collegeId);
    
    // Get college data
    const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
    if (!collegeDoc.exists()) {
      throw new Error('College not found');
    }
    
    const collegeData = collegeDoc.data() as CollegeData;
    console.log('College data:', collegeData);
    
    let tpoUid: string;
    let hodUid: string;
    
    try {
      console.log('Creating TPO user for email:', collegeData.tpoEmail);
      const tpoUserCredential = await createUserWithEmailAndPassword(auth, collegeData.tpoEmail, tpoPassword);
      tpoUid = tpoUserCredential.user.uid;
      console.log('TPO user created with UID:', tpoUid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('TPO email already in use, finding existing user...');
        const tpoQuery = query(collection(db, 'users'), where('email', '==', collegeData.tpoEmail));
        const tpoSnapshot = await getDocs(tpoQuery);
        
        if (!tpoSnapshot.empty) {
          tpoUid = tpoSnapshot.docs[0].id;
          console.log('Found existing TPO user with UID:', tpoUid);
        } else {
          throw new Error('TPO email is in use but user document not found');
        }
      } else {
        throw error;
      }
    }
    
    try {
      console.log('Creating HOD user for email:', collegeData.hodEmail);
      const hodUserCredential = await createUserWithEmailAndPassword(auth, collegeData.hodEmail, hodPassword);
      hodUid = hodUserCredential.user.uid;
      console.log('HOD user created with UID:', hodUid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('HOD email already in use, finding existing user...');
        const hodQuery = query(collection(db, 'users'), where('email', '==', collegeData.hodEmail));
        const hodSnapshot = await getDocs(hodQuery);
        
        if (!hodSnapshot.empty) {
          hodUid = hodSnapshot.docs[0].id;
          console.log('Found existing HOD user with UID:', hodUid);
        } else {
          throw new Error('HOD email is in use but user document not found');
        }
      } else {
        throw error;
      }
    }
    
    console.log('Creating TPO user document...');
    // Create TPO user document
    await setDoc(doc(db, 'users', tpoUid), {
      uid: tpoUid,
      email: collegeData.tpoEmail,
      name: 'TPO',
      role: 'tpo',
      isApproved: true,
      collegeId,
      createdAt: new Date()
    });
    
    console.log('Creating HOD user document...');
    // Create HOD user document
    await setDoc(doc(db, 'users', hodUid), {
      uid: hodUid,
      email: collegeData.hodEmail,
      name: 'HOD',
      role: 'hod',
      isApproved: true,
      collegeId,
      createdAt: new Date()
    });
    
    console.log('Updating college document...');
    // Update college document
    await updateDoc(doc(db, 'colleges', collegeId), {
      isApproved: true,
      tpoUid,
      hodUid
    });
    
    console.log('College approval completed successfully');
    
    // TODO: Send email notifications to TPO and HOD with their login credentials
    console.log(`TPO Password: ${tpoPassword}, HOD Password: ${hodPassword}`);
  } catch (error) {
    console.error('Error approving college:', error);
    throw error;
  }
};

// Get pending students for HOD approval
export const getPendingStudents = async (collegeId: string, department: string): Promise<UserData[]> => {
  try {
    const q = query(
      collection(db, 'users'), 
      where('role', '==', 'student'),
      where('collegeId', '==', collegeId),
      where('department', '==', department),
      where('isApproved', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as UserData);
  } catch (error) {
    console.error('Error fetching pending students:', error);
    throw error;
  }
};

// Approve student
export const approveStudent = async (studentUid: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', studentUid), {
      isApproved: true
    });
    
    // TODO: Send email notification to student
  } catch (error) {
    console.error('Error approving student:', error);
    throw error;
  }
};

// Reject college
export const rejectCollege = async (collegeId: string): Promise<void> => {
  try {
    // Delete the college document
    await updateDoc(doc(db, 'colleges', collegeId), {
      isApproved: false,
      rejectedAt: new Date()
    });
    
    // TODO: Send email notification to college about rejection
  } catch (error) {
    console.error('Error rejecting college:', error);
    throw error;
  }
};

// Get approved colleges for student signup
export const getApprovedColleges = async (): Promise<CollegeData[]> => {
  try {
    const q = query(collection(db, 'colleges'), where('isApproved', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CollegeData));
  } catch (error) {
    console.error('Error fetching approved colleges:', error);
    throw error;
  }
};

// Placement Drive Functions
export const createPlacementDrive = async (driveData: Omit<PlacementDriveData, 'id' | 'applicants' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Creating placement drive with data:', driveData);
    
    const driveDocRef = await addDoc(collection(db, 'placement_drives'), {
      ...driveData,
      applicants: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Placement drive created with ID:', driveDocRef.id);
    return driveDocRef.id;
  } catch (error) {
    console.error('Error creating placement drive:', error);
    throw error;
  }
};

export const getPlacementDrives = async (collegeId: string): Promise<PlacementDriveData[]> => {
  try {
    console.log('Fetching placement drives for college:', collegeId);
    
    const q = query(
      collection(db, 'placement_drives'), 
      where('collegeId', '==', collegeId)
    );
    const querySnapshot = await getDocs(q);
    
    const drives = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PlacementDriveData));
    
    console.log('Found placement drives:', drives);
    return drives;
  } catch (error) {
    console.error('Error fetching placement drives:', error);
    throw error;
  }
};

export const updatePlacementDrive = async (driveId: string, updates: Partial<PlacementDriveData>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'placement_drives', driveId), {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating placement drive:', error);
    throw error;
  }
};

// Create demo college for testing
export const createDemoCollege = async (): Promise<string> => {
  try {
    const collegeId = 'college_demo_123';
    
    // Create college document
    await setDoc(doc(db, 'colleges', collegeId), {
      name: 'Demo College',
      website: 'https://democollege.edu',
      licenseNumber: 'LIC123456789',
      tpoEmail: 'tpo@a.com',
      hodEmail: 'hod@a.com',
      isApproved: true,
      tpoUid: '', // Will be updated later
      hodUid: '', // Will be updated later
      createdAt: new Date()
    });
    
    console.log('Created demo college with ID:', collegeId);
    return collegeId;
  } catch (error) {
    console.error('Error creating demo college:', error);
    throw error;
  }
};

// Fix existing user data (temporary utility function)
export const fixUserData = async (userEmail: string, collegeId: string): Promise<void> => {
  try {
    // Find user by email
    const usersQuery = query(collection(db, 'users'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(usersQuery);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;
      
      // Update user document with missing fields
      await updateDoc(doc(db, 'users', userId), {
        collegeId,
        name: 'TPO',
        uid: userId,
        createdAt: new Date()
      });
      
      console.log(`Updated user ${userEmail} with collegeId: ${collegeId}`);
    } else {
      throw new Error(`User with email ${userEmail} not found`);
    }
  } catch (error) {
    console.error('Error fixing user data:', error);
    throw error;
  }
};

export const deletePlacementDrive = async (driveId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'placement_drives', driveId), {
      status: 'cancelled',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error deleting placement drive:', error);
    throw error;
  }
};

// Student Management Functions
export const getStudentsByCollege = async (collegeId: string): Promise<UserData[]> => {
  try {
    console.log('Fetching students for college:', collegeId);
    
    const q = query(
      collection(db, 'users'),
      where('collegeId', '==', collegeId),
      where('role', '==', 'student'),
      where('isApproved', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as UserData));
    
    console.log('Found students:', students);
    return students;
  } catch (error) {
    console.error('Error fetching students by college:', error);
    throw error;
  }
};

export const getStudentsByDrive = async (driveId: string): Promise<UserData[]> => {
  try {
    console.log('Fetching students who applied for drive:', driveId);
    
    // This would require an applications collection to track who applied for which drive
    // For now, we'll return all students from the same college as a placeholder
    // In a real implementation, you'd need to:
    // 1. Query applications collection for this drive
    // 2. Get the student UIDs who applied
    // 3. Fetch the student details
    
    // Get the drive to find its college
    const driveDoc = await getDoc(doc(db, 'placement_drives', driveId));
    if (!driveDoc.exists()) {
      throw new Error('Drive not found');
    }
    
    const driveData = driveDoc.data();
    return await getStudentsByCollege(driveData.collegeId);
  } catch (error) {
    console.error('Error fetching students by drive:', error);
    throw error;
  }
};

// Email Interface
export interface BulkEmailData {
  to: string[];
  subject: string;
  htmlContent: string;
  from: string;
  senderName: string;
}

// Bulk Email Function using EmailJS (Free Alternative)
export const sendBulkEmail = async (emailData: BulkEmailData): Promise<void> => {
  try {
    console.log('Sending bulk email to:', emailData.to.length, 'recipients');
    
    // Import the EmailJS service
    const { sendBulkEmailFree } = await import('./emailService');
    
    // Store email request in Firestore for tracking
    const emailRequest = {
      ...emailData,
      status: 'sending',
      createdAt: new Date(),
      sentAt: null,
      recipients: emailData.to.length
    };
    
    const emailDoc = await addDoc(collection(db, 'email_requests'), emailRequest);
    console.log('Email request created with ID:', emailDoc.id);
    
    // Send emails using EmailJS
    const result = await sendBulkEmailFree({
      to: emailData.to,
      subject: emailData.subject,
      message: emailData.htmlContent, // Map htmlContent to message
      from: emailData.from,
      senderName: emailData.senderName
    });
    
    // Update status based on result
    const status = result.success ? 'sent' : 'failed';
    await updateDoc(emailDoc, {
      status,
      sentAt: new Date(),
      sentCount: result.sentCount,
      failedCount: result.failedCount,
      errors: result.errors
    });
    
    if (!result.success) {
      throw new Error(`Email sending failed. Sent: ${result.sentCount}, Failed: ${result.failedCount}`);
    }
    
    console.log(`Bulk email sent successfully. Sent: ${result.sentCount}, Failed: ${result.failedCount}`);
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw error;
  }
};