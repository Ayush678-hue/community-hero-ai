import { auth, db, googleProvider, isConfigured } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const firebaseLoginWithGoogle = async () => {
  if (isConfigured) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Fetch user profile from Firestore or initialize
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let profile;
      if (!userSnap.exists()) {
        profile = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          role: 'citizen', // Default role, user will be prompted to change if new
          heroPoints: 145,
          badges: [{ title: 'First Responder', description: 'Joined the network' }],
          reportsCount: 0
        };
        await setDoc(userRef, profile);
      } else {
        profile = userSnap.data();
      }
      return { user: profile, token: user.accessToken, isNewUser: !userSnap.exists() };
    } catch (error) {
      console.error("Firebase Google Sign-In failed:", error);
      throw error;
    }
  } else {
    // Mock Google Sign-In Fallback
    const mockUid = 'mock_google_' + Math.floor(Math.random() * 1000);
    const mockProfile = {
      uid: mockUid,
      name: 'Aria Chen',
      email: 'aria@hero-civic.org',
      role: 'citizen',
      heroPoints: 145,
      badges: [{ title: 'First Responder', description: 'Joined the network' }],
      reportsCount: 0,
      isDemo: true
    };
    return { user: mockProfile, token: 'mock_token_' + Date.now(), isNewUser: true };
  }
};

export const firebaseLoginWithEmail = async (email, password) => {
  if (isConfigured) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      let profile;
      if (userSnap.exists()) {
        profile = userSnap.data();
      } else {
        profile = {
          uid: user.uid,
          name: email.split('@')[0],
          email: user.email,
          role: 'citizen',
          heroPoints: 145,
          badges: [],
          reportsCount: 0
        };
        await setDoc(userRef, profile);
      }
      return { user: profile, token: user.accessToken };
    } catch (error) {
      console.error("Firebase Email Login failed:", error);
      throw error;
    }
  } else {
    // Mock Email Login Fallback
    const mockProfile = {
      uid: 'mock_user_' + email.split('@')[0],
      name: email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'admin' : email.includes('gov') ? 'authority' : 'citizen',
      heroPoints: 145,
      badges: [],
      reportsCount: 0,
      isDemo: true
    };
    return { user: mockProfile, token: 'mock_token_' + Date.now() };
  }
};

export const firebaseSignupWithEmail = async (name, email, password) => {
  if (isConfigured) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const profile = {
        uid: user.uid,
        name: name,
        email: email,
        role: 'citizen',
        heroPoints: 0,
        badges: [],
        reportsCount: 0
      };
      await setDoc(doc(db, 'users', user.uid), profile);
      return { user: profile, token: user.accessToken };
    } catch (error) {
      console.error("Firebase Email Signup failed:", error);
      throw error;
    }
  } else {
    // Mock Email Signup Fallback
    const mockProfile = {
      uid: 'mock_user_' + Date.now(),
      name: name,
      email: email,
      role: 'citizen',
      heroPoints: 0,
      badges: [],
      reportsCount: 0,
      isDemo: true
    };
    return { user: mockProfile, token: 'mock_token_' + Date.now() };
  }
};

export const firebaseUpdateUserRole = async (uid, role) => {
  if (isConfigured) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { role: role }, { merge: true });
    } catch (error) {
      console.error("Firebase update role failed:", error);
    }
  }
};

export const firebaseLogout = async () => {
  if (isConfigured) {
    await signOut(auth);
  }
};
