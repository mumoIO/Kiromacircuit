export interface MealNutrition {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fiber: number; // in grams
  fat: number; // in grams
  isHealthyChoice?: boolean;
  healthTags?: string[];
}

export interface MealItem {
  id: string;
  name: string;
  shengName?: string;
  price: number; // in KSh (always <= 100)
  tagline: string;
  description: string;
  category: 'chapo' | 'ugali' | 'smocha' | 'traditional' | 'rice' | 'breakfast';
  cardColor: 'green' | 'yellow' | 'red';
  calories?: string;
  prepTime: string;
  rating: number;
  reviewsCount: number;
  popularIn: string[];
  imageUrl: string;
  highlights: string[];
  pairingExtras?: { name: string; price: number }[];
  nutrition?: MealNutrition;
}

export interface HotelLocation {
  id: string;
  name: string;
  city: 'Nairobi' | 'Mombasa' | 'Kisumu' | 'Nakuru' | 'Eldoret';
  neighborhood: string;
  address: string;
  landmark: string;
  hours: {
    monFri: string;
    sat: string;
    sun: string;
  };
  phone: string;
  email: string;
  mpesaTill?: string;
  status: 'OPEN NOW' | 'COMING SOON';
  signatureMeal: string;
  signaturePrice: number;
  lat: number;
  lng: number;
  mapEmbedQuery: string;
  hygieneCertified: boolean;
  seatingCapacity: number;
  googleMapsUrl: string;
  imageUrl?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time';
  location: string;
  department: string;
  description: string;
  requirements: string[];
}

export interface DriveSavedSpot {
  spotId: string;
  spotName: string;
  city: string;
  neighborhood: string;
  meal: string;
  price: number;
  notes?: string;
  savedAt: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface EateryReview {
  id: string;
  locationId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  favoriteDish?: string;
  tags?: string[];
  photoUrl?: string;
  date: string;
}

export interface DailyBudgetExpense {
  id: string;
  mealName: string;
  cost: number;
  time: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
  spotName?: string;
}

export interface DailyBudgetGoal {
  dailyTarget: number; // e.g. 100 KSh
  date: string; // YYYY-MM-DD
  expenses: DailyBudgetExpense[];
}
