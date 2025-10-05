import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockProfile, mockProviders } from "../data/mockData";

// TODO: Import Firestore functions during workshop
// import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../firebase/config';

export default function ProfileSetup() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if profile already exists
    if (userProfile) {
      navigate("/dashboard");
    }

    // TODO: Replace with Firestore query during workshop
    // Load mock providers for now
    console.log("MOCK: Loading service providers from mock data");
    setProviders(mockProviders);

    // Real Firebase implementation:
    /*
    async function fetchProviders() {
      try {
        const q = query(
          collection(db, 'serviceProviders'),
          where('active', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const providersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProviders(providersList);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    }
    fetchProviders();
    */
  }, [userProfile, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // TODO: Replace with Firestore setDoc during workshop
    // Mock - just log the data
    console.log("MOCK: Saving profile to Firestore:", {
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      address,
      phone,
      serviceProvider: selectedProvider,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/dashboard");

    /*
      setError("");
      try {
      // Real Firebase implementation:

      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        address,
        phone,
        serviceProvider: selectedProvider,
        createdAt: new Date()
      });


      await refreshProfile();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    }
*/
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          {currentUser?.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-green-100"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            We need a few details to get you started
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>📝 Workshop Note:</strong> Service providers are loaded from
            mock data. You'll connect to Firestore during the workshop!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your complete address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+234 800 000 0000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Provider *
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select your service provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 mt-6"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
