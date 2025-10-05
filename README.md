# Firebase Masterclass: Building a Waste Management Progressive Web App

**Duration:** 2-4 hours
**Level:** Beginner to Intermediate
**Focus:** Firebase Integration

## Workshop Overview

In this hands-on workshop, you'll learn Firebase by integrating it into a React application. We've prepared all the UI components so you can focus entirely on learning Firebase features:

- **Authentication** - Add Google Sign-In
- **Firestore Database** - Store and sync data in real-time
- **Cloud Hosting** - Deploy your app to production
- **PWA Features** - Make your app installable

## What You'll Build

Transform a static waste management app into a fully functional, cloud-powered application where users can:

- Sign in with Google
- Complete their profile with address, phone, and service provider
- Request waste pickups with photos and location
- Track requests in real-time
- Use the app offline

---

## Prerequisites

Before you start, make sure you have:

- Node.js installed (version 20 or higher) - [Download here](https://nodejs.org/)
- Git installed - [Download here](https://git-scm.com/)
- A code editor (VS Code recommended)
- A Google account for Firebase
- Basic understanding of JavaScript (React knowledge helpful but not required)

---

## Part 1: Get the Starter Code (10 minutes)

### Step 1.1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/auwalms/waste-management-starter.git
cd waste-management-starter
npm install
```

### Step 1.2: Explore the Starter Code

Let's understand what's already built:

```bash
npm run dev
```

Visit `http://localhost:5173` and explore the app:

- **Login Page**: Static UI with a Google Sign-In button (not functional yet)
- **Profile Setup**: Form with address, phone, and provider fields
- **Dashboard**: Two tabs - "New Request" and "My Requests"
- **Request Form**: Upload/camera, location, waste type fields
- **Request List**: Shows sample requests with mock data

### Step 1.3: Review the Mock Data

Open `src/data/mockData.js` to see the sample data structure:

```javascript
// Current mock user
export const mockUser = {
  uid: "mock-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
  photoURL: "https://via.placeholder.com/150",
};

// Current mock profile
export const mockProfile = {
  address: "123 Main Street, Lagos, Nigeria",
  phone: "+234 800 000 0000",
  serviceProvider: "GreenCycle Waste Services",
};

// Mock service providers
export const mockProviders = [
  { id: "1", name: "GreenCycle Waste Services", active: true },
  { id: "2", name: "EcoClean Solutions", active: true },
  { id: "3", name: "City Waste Management", active: true },
];

// Mock requests
export const mockRequests = [
  {
    id: "1",
    userId: "mock-user-123",
    userEmail: "demo@example.com",
    userName: "Demo User",
    address: "123 Main Street, Lagos",
    wasteType: "Recyclable",
    imageBase64: null,
    location: { latitude: 6.5244, longitude: 3.3792 },
    serviceProvider: "GreenCycle Waste Services",
    status: "pending",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    userId: "mock-user-123",
    userEmail: "demo@example.com",
    userName: "Demo User",
    address: "456 Oak Avenue, Abuja",
    wasteType: "Organic",
    imageBase64: null,
    location: null,
    serviceProvider: "EcoClean Solutions",
    status: "completed",
    createdAt: new Date("2025-01-10"),
  },
];
```

**Key Point**: Right now, the app uses these mock objects. Our job is to replace them with real Firebase data!

---

## Part 2: Firebase Project Setup (15 minutes)

### Step 2.1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "waste-management-app"
4. Click "Create project"

### Step 2.2: Register Your Web App

1. In your Firebase project, click the web icon (`</>`)
2. Register app nickname: "Waste Management PWA"
3. Check "Also set up Firebase Hosting"
4. Click "Register app"
5. **Copy the configuration object** - you'll need it next!

### Step 2.3: Add Firebase Config to Your App

Create a new file `.env.local` in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase config.

### Step 2.4: Enable Firebase Services

**Enable Google Authentication:**

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Select "Google" provider
4. Enable it and select your support email
5. Click "Save"

**Create Firestore Database:**

1. Go to "Firestore Database"
2. Click "Create database"
3. Start in **"Test mode"** (we'll secure it later)
4. Choose your nearest location
5. Click "Enable"

**Add Service Providers Collection:**

1. In Firestore, click "Start collection"
2. Collection ID: `serviceProviders`
3. Add three documents:

```
Document 1:
- name: "GreenCycle Waste Services"
- active: true

Document 2:
- name: "EcoClean Solutions"
- active: true

Document 3:
- name: "City Waste Management"
- active: true
```

---

## Part 3: Integrate Firebase Authentication (30 minutes)

### Step 3.1: Install Firebase

The starter code already has Firebase installed, but let's verify:

```bash
npm list firebase
```

You should see `firebase@^10.x.x` listed.

### Step 3.2: Initialize Firebase

Open `src/firebase/config.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
```

> [Important] : Ensure you rename your `.env.example` to `.env` and replace the Keys with your correct key before running your code.

**Checkpoint**: Run your app. If there are no console errors, Firebase is initialized!

### Step 3.3: Replace Mock Authentication

Open `src/contexts/AuthContext.jsx` and find the `loginWithGoogle` function:

**BEFORE (using mock data):**

```javascript
function loginWithGoogle() {
  // Mock login - replace with Firebase
  return new Promise((resolve) => {
    setTimeout(() => {
      setCurrentUser(mockUser);
      resolve({ user: mockUser });
    }, 500);
  });
}
```

**AFTER (using Firebase):**

```javascript
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
```

### Step 3.4: Replace Mock Auth State

Find the `useEffect` in `AuthContext.jsx`:

**BEFORE:**

```javascript
useEffect(() => {
  // Mock - always logged in
  setCurrentUser(mockUser);
  setUserProfile(mockProfile);
  setLoading(false);
}, []);
```

**AFTER:**

```javascript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);

    if (user) {
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  });

  return unsubscribe;
}, []);
```

### Step 3.5: Replace Mock Logout

**BEFORE:**

```javascript
function logout() {
  return new Promise((resolve) => {
    setCurrentUser(null);
    setUserProfile(null);
    resolve();
  });
}
```

**AFTER:**

```javascript
function logout() {
  return signOut(auth);
}
```

### Step 3.6: Test Authentication

1. Save your changes
2. Refresh the app
3. Click "Sign in with Google"
4. You should see the Google Sign-In popup
5. After signing in, you'll be redirected to profile setup

**🎉 Milestone**: You've replaced mock authentication with real Firebase Auth!

---

## Part 4: Integrate Firestore for Profiles (25 minutes)

### Step 4.1: Replace Mock Profile Creation

Open `src/components/ProfileSetup.jsx` and find the `handleSubmit` function:

**BEFORE:**

```javascript
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  // Mock - just store in memory
  console.log("MOCK: Saving profile to Firestore:", {
    displayName: currentUser.displayName,
    email: currentUser.email,
    photoURL: currentUser.photoURL,
    address,
    phone,
    serviceProvider: selectedProvider,
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  navigate("/dashboard");

  setLoading(false);
}
```

**AFTER:**

```javascript
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Save user profile to Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      address,
      phone,
      serviceProvider: selectedProvider,
      createdAt: new Date(),
    });

    await refreshProfile();
    navigate("/dashboard");
  } catch (err) {
    setError("Failed to save profile. Please try again.");
    console.error(err);
  }

  setLoading(false);
}
```

### Step 4.2: Replace Mock Providers Fetch

Find the `useEffect` that loads providers:

**BEFORE:**

```javascript
useEffect(() => {
  // Mock providers
  setProviders(mockProviders);
}, []);
```

**AFTER:**

```javascript
import { collection, getDocs, query, where } from "firebase/firestore";

useEffect(() => {
  // Check if profile already exists
  if (userProfile) {
    navigate("/dashboard");
  }

  // Fetch service providers from Firestore
  async function fetchProviders() {
    try {
      const q = query(
        collection(db, "serviceProviders"),
        where("active", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const providersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProviders(providersList);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }

  fetchProviders();
}, [userProfile, navigate]);
```

### Step 4.3: Test Profile Setup

1. Log in with Google
2. Fill out the profile form
3. Click "Complete Setup"
4. Open Firebase Console → Firestore
5. You should see a new document in the `users` collection!

**🎉 Milestone**: User profiles are now stored in Firestore!

---

## Part 5: Integrate Firestore for Requests (35 minutes)

### Step 5.1: Replace Mock Request Submission

Open `src/components/RequestForm.jsx` and find `handleSubmit`:

**BEFORE:**

```javascript
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  // Mock - just log and reset form
  const newRequest = {
    id: Date.now().toString(),
    userId: mockUser.uid,
    address,
    wasteType,
    imageBase64,
    location,
    serviceProvider: mockProfile.serviceProvider,
    status: "pending",
    createdAt: new Date(),
  };

  mockRequests.push(newRequest);
  console.log("Request submitted:", newRequest);

  // Reset form
  setWasteType("");
  setImageBase64("");
  setImagePreview(null);
  setLocation(null);
  setSuccess(true);

  setTimeout(() => setSuccess(false), 3000);
  setLoading(false);
}
```

**AFTER:**

```javascript
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);

  try {
    // Create request in Firestore
    await addDoc(collection(db, "requests"), {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      userPhone: userProfile.phone,
      address,
      wasteType,
      imageBase64: imageBase64 || null,
      location: location || null,
      serviceProvider: userProfile.serviceProvider,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    // Reset form (keep address prefilled)
    setWasteType("");
    setImageBase64("");
    setImagePreview(null);
    setLocation(null);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Failed to submit request. Please try again.");
  }

  setLoading(false);
}
```

### Step 5.2: Replace Mock Requests Display

Open `src/components/RequestList.jsx`:

**BEFORE:**

```javascript
useEffect(() => {
  // Mock - always show sample requests
  const sortedRequests = [...mockRequests].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
  setRequests(mockRequests);
  setLoading(false);
}, []);
```

**AFTER:**

```javascript
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

useEffect(() => {
  // Create query for user's requests
  const q = query(
    collection(db, "requests"),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  );

  // Set up real-time listener
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requestsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRequests(requestsData);
    setLoading(false);
  });

  // Cleanup listener on unmount
  return () => unsubscribe();
}, [currentUser.uid]);
```

### Step 5.3: Test Real-Time Updates

1. Submit a new waste pickup request
2. Watch it appear instantly in "My Requests" tab
3. Open your app in another browser tab
4. Submit a request in one tab
5. See it appear in the other tab automatically!

**🎉 Milestone**: Real-time data is working!

---

## Part 6: Secure Your Database (15 minutes)

### Step 6.1: Update Firestore Security Rules

In Firebase Console, go to Firestore Database → Rules:

**Replace the rules with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Service Providers - read-only for authenticated users
    match /serviceProviders/{providerId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can modify via console
    }

    // only authenticated users can submit a create, read and update their profile
    match /users/{userId}{
    	allow create, read, update: if request.auth != null && request.auth.uid == userId;
    }

   
    // Users can only update their own request
    // only authenticated users can submit a create.
    match /requests/{requestId}{
    	allow read, update, delete: if request.auth.uid != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth.uid != null;
    }
  }
}
```

Click **"Publish"**.

### Step 6.2: Test Security Rules

Try these tests:

1. **Test 1**: Log in as User A, try to view your requests ✅ Should work
2. **Test 2**: Open Firestore Console, try to read another user's data ❌ Should fail
3. **Test 3**: Try to submit a request without being logged in ❌ Should fail

**🎉 Milestone**: Your database is now secure!

---

## Part 7: Deploy to Firebase Hosting (15 minutes)

### Step 7.1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 7.2: Login to Firebase

```bash
firebase login
```

### Step 7.3: Initialize Firebase Hosting

```bash
firebase init hosting
```

**Configuration:**

- Select your existing Firebase project
- Public directory: `dist`
- Single-page app: `Yes`
- Automatic builds with GitHub: `No`
- Don't overwrite files if asked

### Step 7.4: Build Your App

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Step 7.5: Deploy to Firebase

```bash
firebase deploy --only hosting
```

After deployment completes, you'll get a URL like:

```
https://your-project-id.web.app
```

**🎉 Milestone**: Your app is live on the internet!

---

## Part 8: Make It a PWA (Optional - 20 minutes)

The PWA configuration is already set up in the starter code. Let's verify it works:

### Step 8.1: Test PWA Features

1. Open your deployed app on a mobile device
2. You should see an "Add to Home Screen" prompt
3. Install the app
4. Open it from your home screen - it works like a native app!

### Step 8.2: Test Offline Mode

1. Open your app
2. Turn on airplane mode
3. The app should still load (showing cached data)
4. Try to submit a request - it will fail (offline)
5. Turn off airplane mode and try again

---

## 🎉 Congratulations!

You've successfully integrated Firebase into a React application! Here's what you accomplished:

### What You Learned

✅ **Firebase Authentication**

- Integrated Google Sign-In
- Managed user sessions
- Protected routes

✅ **Firestore Database**

- Created and structured collections
- Wrote data with `addDoc` and `setDoc`
- Read data with `getDocs` and queries
- Secured data with security rules

✅ **Firebase Hosting**

- Built production app
- Deployed to Firebase CDN
- App accessible worldwide with HTTPS

✅ **Real-Time Features**

- Data updates instantly across devices
- No manual refresh needed

### Before & After Comparison

| Feature           | Before (Mock)     | After (Firebase)      |
| ----------------- | ----------------- | --------------------- |
| Authentication    | Fake user object  | Real Google Sign-In   |
| User Profile      | In-memory storage | Firestore persistence |
| Service Providers | Hardcoded array   | Firestore query       |
| Requests          | Local array       | Real-time Firestore   |
| Data Persistence  | Lost on refresh   | Synced across devices |
| Security          | None              | Protected by rules    |
| Deployment        | Local only        | Live on internet      |

---

## Next Steps & Challenges

Now that you understand Firebase basics, try these enhancements:

### Challenge 1: Add Request Cancellation (Easy)

Allow users to cancel pending requests.

**Hint**: Use `updateDoc` to change status

```javascript
import { doc, updateDoc } from "firebase/firestore";

async function cancelRequest(requestId) {
  await updateDoc(doc(db, "requests", requestId), {
    status: "cancelled",
  });
}
```

### Challenge 2: Add Profile Editing (Medium)

Let users update their address and phone number.

**Hint**: Create a Settings page with a form, use `updateDoc` to save changes

### Challenge 3: Add Admin Dashboard (Advanced)

Create a view where service providers can see all requests assigned to them.

**Hint**: Query requests by `serviceProvider` field

```javascript
const q = query(
  collection(db, "requests"),
  where("serviceProvider", "==", "GreenCycle Waste Services")
);
```

### Challenge 4: Add Status Updates (Advanced)

Allow admins to change request status (pending → in-progress → completed).

### Challenge 5: Add Notifications (Expert)

Use Firebase Cloud Functions to send emails when request status changes.

---

## Common Issues & Solutions

### Issue: "Firebase not defined"

**Cause**: Firebase not initialized or `.env` variables not loaded

**Solution**:

1. Check `.env` exists and has correct values
2. Restart dev server (`npm run dev`)
3. Variables must start with `VITE_`

### Issue: "Permission denied" in Firestore

**Cause**: Security rules are blocking your request

**Solution**:

1. Check you're logged in (`currentUser` exists)
2. Verify security rules in Firebase Console
3. Check if you're querying correct data (your userId)

### Issue: Real-time updates not working

**Cause**: Using `getDocs` instead of `onSnapshot`

**Solution**: Always use `onSnapshot` for real-time data

```javascript
// ❌ Bad - not real-time
const snapshot = await getDocs(q);

// ✅ Good - real-time
const unsubscribe = onSnapshot(q, (snapshot) => {
  // Update state here
});
```

### Issue: Image too large error

**Cause**: Base64 image exceeds 1MB Firestore limit

**Solution**:

1. Reduce JPEG quality in `capturePhoto` function
2. Resize image before converting to base64
3. For production, migrate to Firebase Storage

---

## Resources

### Starter Repository

- GitHub: `https://github.com/auwalms/waste-management-starter.git`
- Live Demo: `https://cleanlafia.web.app`

### Official Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guides](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/rules)

---
