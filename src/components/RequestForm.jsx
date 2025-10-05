import { useState, useRef } from "react";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { mockUser, mockProfile, mockRequests } from "../data/mockData";

export default function RequestForm() {
  const { currentUser, userProfile } = useAuth();
  const [address, setAddress] = useState(userProfile?.address || "");
  const [wasteType, setWasteType] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const wasteTypes = [
    "General Waste",
    "Recyclable",
    "Organic",
    "Electronic",
    "Hazardous",
  ];

  // Convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB to stay within Firestore limits)
      if (file.size > 1024 * 1024) {
        alert(
          "Image size must be less than 1MB. Please choose a smaller image or compress it."
        );
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setImageBase64(base64);
        setImagePreview(base64);
      } catch (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Please try another one.");
      }
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Could not access camera. Please use file upload instead.");
      console.error(err);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    // Compress to JPEG with quality 0.7 to reduce size
    const base64 = canvas.toDataURL("image/jpeg", 0.7);

    // Check size (rough estimate: base64 is ~1.37x original)
    const sizeInBytes = (base64.length * 3) / 4;
    if (sizeInBytes > 1024 * 1024) {
      alert(
        "Captured image is too large. Please try again or use a lower resolution."
      );
      return;
    }

    setImageBase64(base64);
    setImagePreview(base64);
    stopCamera();
  }

  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Could not get your location. Please ensure location services are enabled."
        );
        setGettingLocation(false);
      }
    );
  }

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

    //TODO: Uncomment and implement Firestore submission during workshop
    /**try {
      // Create request in Firestore with base64 image
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

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    }
*/
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request Waste Pickup
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Images are stored as base64 in the database
            for this workshop. In production apps, use dedicated storage
            services like Firebase Storage or AWS S3 for better performance.
          </p>
        </div>

        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
            Request submitted successfully! We'll process it soon.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Address *
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

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {gettingLocation ? "Getting location..." : "Use My Location"}
              </button>
              {location && (
                <div className="flex-1 bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm flex items-center justify-center">
                  Location captured ✓
                </div>
              )}
            </div>
          </div>

          {/* Waste Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type *
            </label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select waste type</option>
              {wasteTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload or Camera */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Photo (Optional - Max 1MB)
            </label>

            {!imagePreview && !cameraActive && (
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition text-center">
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Upload from gallery
                    </span>
                  </div>
                </label>
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition"
                >
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Take photo</span>
                </button>
              </div>
            )}

            {cameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                  >
                    Capture Photo
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageBase64("");
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
