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
  collegeId?: string;
  department?: string;
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
    // Get college data
    const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
    const collegeData = collegeDoc.data() as CollegeData;
    
    // Create TPO user
    const tpoUserCredential = await createUserWithEmailAndPassword(auth, collegeData.tpoEmail, tpoPassword);
    const tpoUid = tpoUserCredential.user.uid;
    
    // Create HOD user
    const hodUserCredential = await createUserWithEmailAndPassword(auth, collegeData.hodEmail, hodPassword);
    const hodUid = hodUserCredential.user.uid;
    
    // Update college document
    await updateDoc(doc(db, 'colleges', collegeId), {
      isApproved: true,
      tpoUid,
      hodUid
    });
    
    // Create TPO user document
    await setDoc(doc(db, 'users', tpoUid), {
      uid: tpoUid,
      email: collegeData.tpoEmail,
      name: 'TPO', // Will be updated when they first login
      role: 'tpo',
      isApproved: true,
      collegeId,
      createdAt: new Date()
    });
    
    // Create HOD user document
    await setDoc(doc(db, 'users', hodUid), {
      uid: hodUid,
      email: collegeData.hodEmail,
      name: 'HOD', // Will be updated when they first login
      role: 'hod',
      isApproved: true,
      collegeId,
      createdAt: new Date()
    });
    
    // Sign out authority user
    await signOut(auth);
    
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