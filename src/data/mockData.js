// Current mock user
export const mockUser = {
  uid: "mock-user-123",
  email: "ciroma_ca@example.com",
  displayName: "Chiroma Chukwuma Adekunle",
  photoURL:
    "https://firebase.google.com/static/images/brand-guidelines/logo-monochrome.png",
};

// Current mock profile
export const mockProfile = {
  address: "AJ Ahmadu plaze Custom Line, plot 160 Makurdi Rd, Lafia",
  phone: "+234 903 902 2216",
  serviceProvider: "GreenCycle Waste Services",
};

// Mock service providers
export const mockProviders = [
  { id: "1", name: "GreenCycle Waste Services", active: true },
  { id: "2", name: "EcoClean Solutions", active: true },
  { id: "3", name: "City Waste Management", active: true },
  { id: "4", name: "Urban Waste Solutions", active: false },
];

// Mock requests
export const mockRequests = [
  {
    id: "1",
    userId: "mock-user-123",
    userEmail: "ciroma_ca@example.com",
    userName: "Chiroma Chukwuma Adekunle",
    address: "AJ Ahmadu plaze Custom Line, plot 160 Makurdi Rd, Lafia",
    wasteType: "Recyclable",
    imageBase64: null,
    location: { latitude: 7.539487, longitude: 8.514175 },
    serviceProvider: "GreenCycle Waste Services",
    status: "completed",
    createdAt: new Date("2025-10-01"),
  },
  {
    id: "2",
    userId: "mock-user-123",
    userEmail: "ciroma_ca@example.com",
    userName: "Chiroma Chukwuma Adekunle",
    address: "AJ Ahmadu plaze Custom Line, plot 160 Makurdi Rd, Lafia",
    wasteType: "Organic",
    imageBase64: null,
    location: null,
    serviceProvider: "EcoClean Solutions",
    status: "pending",
    createdAt: new Date("2025-10-08"),
  },
];
