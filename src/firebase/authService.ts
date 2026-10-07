import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  deleteDoc 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './config';
import { User, UserRole, SavedAddress, NotificationPreferences } from '../types';

const defaultNotificationPreferences: NotificationPreferences = {
  emailOrderUpdates: true,
  emailCertificateMinted: true,
  emailCommissionQuotes: true,
  emailB2BMilestones: true,
  emailArtisanPayouts: true,
  smsUrgentAlerts: false,
  marketingDigest: false
};

export async function signInWithGoogle(desiredRole: UserRole = 'collector'): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    // Check if user profile already exists in Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        name: data.displayName || fbUser.displayName || 'Collector',
        email: fbUser.email || '',
        role: data.role || desiredRole,
        phone: data.phone || '',
        bio: data.bio || '',
        avatar: data.avatarUrl || fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        workshopName: data.workshopName,
        artisanTitle: data.artisanTitle,
        location: data.location || 'Kathmandu, Nepal',
        organizationName: data.organizationName,
        createdAt: data.createdAt || new Date().toISOString()
      };
    } else {
      // Create new profile in Firestore
      const newUser: User = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        name: fbUser.displayName || 'Himalayan Collector',
        email: fbUser.email || '',
        role: desiredRole,
        phone: '',
        bio: desiredRole === 'artisan' ? 'Master guildsman carrying forward ancestral traditions.' : 'Patron of sacred Nepalese iconography.',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        workshopName: desiredRole === 'artisan' ? 'Patan Heritage Foundry' : undefined,
        artisanTitle: desiredRole === 'artisan' ? 'Master Lost-Wax Metal Caster' : undefined,
        location: 'Kathmandu Valley, Nepal',
        organizationName: desiredRole === 'enterprise_buyer' ? 'Himalayan Heritage Trust' : undefined,
        createdAt: new Date().toISOString()
      };

      await setDoc(userDocRef, {
        uid: fbUser.uid,
        displayName: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        bio: newUser.bio,
        avatarUrl: newUser.avatar,
        workshopName: newUser.workshopName || null,
        artisanTitle: newUser.artisanTitle || null,
        location: newUser.location,
        organizationName: newUser.organizationName || null,
        createdAt: newUser.createdAt,
        updatedAt: new Date().toISOString()
      });

      // Initialize default notification preferences in subcollection
      await setDoc(doc(db, 'users', fbUser.uid, 'preferences', 'settings'), {
        userId: fbUser.uid,
        ...defaultNotificationPreferences
      });

      return newUser;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'users');
    throw error;
  }
}

export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        name: data.displayName || 'Collector',
        email: fbUser.email || '',
        role: data.role || 'collector',
        phone: data.phone || '',
        bio: data.bio || '',
        avatar: data.avatarUrl,
        workshopName: data.workshopName,
        artisanTitle: data.artisanTitle,
        location: data.location,
        organizationName: data.organizationName,
        createdAt: data.createdAt
      };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'users');
    throw err;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      displayName: updates.name,
      phone: updates.phone,
      bio: updates.bio,
      avatarUrl: updates.avatar,
      role: updates.role,
      workshopName: updates.workshopName || null,
      artisanTitle: updates.artisanTitle || null,
      location: updates.location || null,
      organizationName: updates.organizationName || null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    throw error;
  }
}

export async function saveAddress(userId: string, address: SavedAddress): Promise<void> {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', address.id);
    await setDoc(addressRef, {
      ...address,
      userId
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/addresses/${address.id}`);
    throw error;
  }
}

export async function removeAddress(userId: string, addressId: string): Promise<void> {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/addresses/${addressId}`);
    throw error;
  }
}

export async function updateNotificationPreferences(userId: string, prefs: NotificationPreferences): Promise<void> {
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'settings');
    await setDoc(prefRef, {
      userId,
      ...prefs
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/preferences/settings`);
    throw error;
  }
}

export async function signOutFirebase(): Promise<void> {
  await signOut(auth);
}
