export type AppScreen =
  | 'customer-home'
  | 'medication-detail'
  | 'order-tracking'
  | 'login-register'
  | 'partner-portal'
  | 'trustops-fulfillment'
  | 'trustops-audit'
  | 'architecture-prd';

export type UserRole = 'PATIENT' | 'PHARMACIST' | 'TRUST_OFFICER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  licenseNumber?: string;
  pharmacyName?: string;
  dob?: string;
  deliveryAddress?: string;
  fido2Verified?: boolean;
  hipaaConsented?: boolean;
  token?: string;
}

export type CustomerTab = 'home' | 'compare' | 'safety' | 'orders' | 'trust';

export interface MedicineItem {
  id: string;
  genericName: string;
  brandNameEquivalent: string;
  dosageForm: string;
  strength: string;
  category: string;
  genericPrice: number;
  brandPrice: number;
  savingsPercentage: number;
  unitPriceString: string;
  fdaBioequivalentRating: string;
  otcRegulated: boolean;
  image: string;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  shelfStabilityMonths: number;
  indications: string;
  dosageAdult: string;
  dosageSenior: string;
  activeIngredient: string;
  inactiveIngredients: string;
}

export interface PharmacySeller {
  id: string;
  name: string;
  licenseNumber: string;
  trustScore: number;
  picName: string;
  distanceMiles: number;
  deliveryEta: string;
  price: number;
  inStock: boolean;
  coldChainCertified: boolean;
  rating: number;
  image?: string;
}

export interface OrderTrackingInfo {
  orderId: string;
  placedTime: string;
  totalAmount: number;
  status: 'PLACED' | 'DISPENSED' | 'DISPATCHED' | 'EN_ROUTE' | 'DELIVERED' | 'PIN_EXCEPTION';
  etaMinutes: number;
  distanceMiles: number;
  medicalReleasePin: string;
  pharmacyName: string;
  destinationAddress: string;
  courierName: string;
  courierBadge: string;
  courierVerified: boolean;
  courierAvatar: string;
  temperatureFahrenheit: number;
  sealNumber: string;
  items: Array<{
    name: string;
    form: string;
    lotNumber: string;
    expDate: string;
    price: number;
  }>;
}

export interface AuditEventRecord {
  timestamp: string;
  eventId: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  action: string;
  target: string;
  classification: 'HIGH PRIORITY' | 'WARNING' | 'HIPAA / PHI' | 'CRITICAL / BLOCKED' | 'MEDIUM AUDIT';
  merkleSeal: string;
  tenantContext: string;
  payloadJson: Record<string, unknown>;
  signatureHash: string;
}

export interface InventoryItem {
  genericName: string;
  subtitle: string;
  ndcOrLot: string;
  location: string;
  currentCount: number;
  velocity: string;
  status: 'Adequate' | 'Optimal' | 'Reorder Soon' | 'Quarantine';
}
