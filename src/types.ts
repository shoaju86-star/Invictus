export type Category = 
  | 'All'
  | 'Electronics'
  | 'Phones & Tablets'
  | 'Fashion & Apparel'
  | 'Sneakers & Shoes'
  | 'Gaming & Consoles'
  | 'Cameras & Photo'
  | 'Home & Living'
  | 'Collectibles & Art'
  | 'Vehicles & Parts';

export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type DeliveryMethod = 'local_pickup' | 'shipping' | 'both';

export type EscrowStatus = 
  | 'NONE'
  | 'HELD_IN_ESCROW'
  | 'SELLER_DISPATCHED'
  | 'DELIVERED_PENDING_BUYER'
  | 'RELEASED_TO_SELLER'
  | 'DISPUTED'
  | 'REFUNDED_TO_BUYER';

export type PaymentMethod = 'mpesa' | 'apple_pay' | 'google_pay' | 'card' | 'paypal';

export interface UserReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  isIdVerified: boolean;
  isTopRated: boolean;
  fastShipper: boolean;
  location: string;
  city: string;
  country: string;
  salesCompleted: number;
  reviews?: UserReview[];
}

export interface ListingItem {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  priceKES: number;
  originalRetailUSD?: number;
  category: Category;
  subcategory?: string;
  condition: ItemCondition;
  images: string[];
  seller: SellerProfile;
  deliveryMethod: DeliveryMethod;
  shippingFeeUSD: number;
  shippingFeeKES: number;
  pickupLocation?: {
    name: string;
    safeSpotDescription: string;
    address: string;
    distanceMiles?: number;
  };
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  status: 'active' | 'sold' | 'reserved';
  isPromoted?: boolean;
  promotionBadge?: string;
  escrowStatus?: EscrowStatus;
  escrowHoldDetails?: {
    transactionId: string;
    paymentMethod: PaymentMethod;
    paidAmountUSD: number;
    paidAmountKES: number;
    commissionFeeUSD: number;
    commissionFeeKES: number;
    heldAt: string;
    buyerId: string;
    buyerName: string;
    buyerPhone?: string;
    trackingNumber?: string;
    carrierName?: string;
    mpesaReceipt?: string;
    commissionDispatchedToMpesa?: string; // e.g. +254705436332
    commissionDarajaReceipt?: string;
  };
  aiAppraisal?: {
    confidence: number;
    suggestedPriceRangeUSD: { min: number; avg: number; max: number };
    suggestedPriceRangeKES: { min: number; avg: number; max: number };
    detectedBrand?: string;
    sellingTip?: string;
    tags?: string[];
  };
}

export type DisputeReason = 
  | 'NOT_AS_DESCRIBED'
  | 'DAMAGED_IN_TRANSIT'
  | 'ITEM_NOT_RECEIVED'
  | 'COUNTERFEIT_CONCERN'
  | 'OTHER';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp?: string;
  createdAt?: string;
  isRead?: boolean;
  isOffer?: boolean;
  offerAmountUSD?: number;
  offerAmountKES?: number;
  offerStatus?: 'pending' | 'accepted' | 'declined' | 'countered';
  attachmentUrl?: string;
  isSystemMessage?: boolean;
  offerDetails?: {
    amountUSD: number;
    amountKES: number;
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface ChatConversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemPriceUSD: number;
  itemPriceKES: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface PushNotification {
  id: string;
  title: string;
  body?: string;
  message?: string;
  timestamp?: string;
  createdAt?: string;
  type: 'offer_received' | 'escrow_hold' | 'price_drop' | 'delivery_confirmed' | 'escrow_released' | 'offer' | 'escrow' | 'chat' | 'system';
  isRead?: boolean;
  read?: boolean;
  itemId?: string;
  actionUrl?: string;
}

export type AppNotification = PushNotification;

export interface DisputeCase {
  id: string;
  itemId: string;
  itemTitle: string;
  buyerId?: string;
  buyerName: string;
  sellerId?: string;
  sellerName: string;
  amountUSD: number;
  reason: DisputeReason | string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_REFUNDED' | 'RESOLVED_RELEASED' | 'open' | 'under_review' | 'resolved_refund' | 'resolved_release';
  openedAt?: string;
  evidenceNotes?: string;
  buyerNotes?: string;
}

export type DisputeRecord = DisputeCase;

export interface MpesaRevenueRecord {
  id: string;
  source: 'commission' | 'ad_payment' | 'boost_promotion' | 'subscription' | 'loyalty_fee';
  title: string;
  description: string;
  amountUSD: number;
  amountKES: number;
  destinationMpesaNumber: string; // Hard-configured: +254705436332
  status: 'CONFIRMED' | 'DEPOSITED' | 'PENDING_DARAJA_CONFIRMATION';
  darajaReceiptCode: string;
  timestamp: string;
  referenceItemId?: string;
  payerPhone?: string;
}

export interface AdPackage {
  id: string;
  title: string;
  category: 'boost_feed' | 'category_banner' | 'urgent_badge' | 'pro_subscription';
  tag: string;
  priceKES: number;
  priceUSD: number;
  duration: string;
  impressionsEstimate: string;
  benefits: string[];
}

export interface AdminStats {
  totalGrossVolumeUSD: number;
  totalGrossVolumeKES: number;
  activeEscrowHeldUSD: number;
  totalTransactions: number;
  activeListingsCount: number;
  disputeRatePercent: number;
  mpesaVolumeSharePercent: number;
  totalSellersVerified: number;
  // Financial Routing to +254705436332
  masterMpesaRecipient: string; // +254705436332
  totalDepositedToMasterMpesaKES: number;
  totalDepositedToMasterMpesaUSD: number;
  totalCommissionsKES: number;
  totalCommissionsUSD: number;
  totalAdRevenueKES: number;
  totalAdRevenueUSD: number;
  totalSubscriptionsKES: number;
  totalSubscriptionsUSD: number;
}

export type ActivityType = 
  | 'LISTING_CREATED'
  | 'MESSAGE_SENT'
  | 'PAYMENT_PROCESSED'
  | 'ESCROW_RELEASE'
  | 'REVIEW_POSTED'
  | 'AD_PURCHASED'
  | 'SELLER_REGISTERED'
  | 'SELLER_KYC_SUBMITTED'
  | 'ADMIN_LOGIN'
  | 'TEAM_ACCOUNT_APPROVED'
  | 'TEAM_ACCOUNT_INVITED'
  | 'DISPUTE_RESOLVED'
  | 'PDF_REPORT_DISPATCHED';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: ActivityType;
  title: string;
  description: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  transactionId?: string;
  amountKES?: number;
  amountUSD?: number;
  darajaReceipt?: string;
  ipAddress?: string;
  devicePlatform?: string;
  securityHash?: string;
}

export interface ReportScheduleConfig {
  recipientEmail: string; // shoaju86@gmail.com
  frequency: 'daily' | 'weekly' | 'on_transaction';
  scheduledTime: string; // e.g. "08:00 EAT"
  isActive: boolean;
  lastSentTimestamp?: string;
  nextScheduledTimestamp?: string;
  autoUploadToCloudBackup: boolean;
  totalReportsSent: number;
}

export interface PdfBackupRecord {
  id: string;
  fileName: string;
  generatedAt: string;
  recipientEmail: string; // shoaju86@gmail.com
  sizeKb: number;
  totalActivitiesCount: number;
  storageProvider: 'Cloud Storage Encrypted Bucket' | 'Firebase Storage' | 'S3';
  storagePath: string;
  sha256Hash: string;
  status: 'STORED_AND_DELIVERED' | 'STORED_PENDING_DISPATCH' | 'ARCHIVED';
  downloadUrl?: string;
}

export type TeamRole = 'super_admin' | 'admin' | 'developer' | 'auditor';
export type TeamAccountStatus = 'active' | 'pending_approval' | 'suspended';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: TeamRole;
  status: TeamAccountStatus;
  createdAt: string;
  lastActive?: string;
  approvedBy?: string; // e.g. "shoaju86@gmail.com"
  permissions: {
    canApproveAccounts: boolean;
    canExportFinancials: boolean;
    canResolveDisputes: boolean;
    canViewAuditLogs: boolean;
    canManageAds: boolean;
    canEditSystemConfig: boolean;
  };
}

export interface SellerKycSubmission {
  id: string;
  sellerId: string;
  legalName: string;
  idOrPassportNumber: string;
  documentType: 'National ID' | 'Passport' | 'Alien ID';
  phone: string;
  email: string;
  city: string;
  documentScanUrl?: string;
  selfieUrl?: string;
  submittedAt: string;
  status: 'verified' | 'pending_review' | 'rejected';
  verifiedAt?: string;
  reviewedBy?: string;
}
