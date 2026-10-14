export type RequestType = 'verify' | 'swap' | 'login';

export type ScreenType =
  | 'home'
  | 'contact-info'
  | 'auth'
  | 'verify'
  | 'waiting'
  | 'admin'
  | 'jobs'
  | 'complaints'
  | 'loans'
  | 'download'
  | 'transfer'
  | 'deposit'
  | 'bills'
  | 'swap'
  | 'qr'
  | 'history'
  | 'branches'
  | 'settings';

export type ReviewStatus = 'under_review' | 'needs_info' | 'verified' | 'rejected';

export interface WalletBalances {
  SYP: number;
  USD: number;
  EUR: number;
  AED: number;
}

export type TransactionType =
  | 'deposit'
  | 'transfer_out'
  | 'transfer_in'
  | 'bill_payment'
  | 'currency_swap'
  | 'loan_disbursement'
  | 'loan_repayment'
  | 'merchant_pay';

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  currency: 'SYP' | 'USD' | 'EUR' | 'AED';
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  recipientName?: string;
  recipientAccount?: string;
  senderName?: string;
  senderAccount?: string;
  referenceNumber: string;
  category: 'transfer' | 'bill' | 'deposit' | 'exchange' | 'loan' | 'service';
  notes?: string;
  billInfo?: {
    provider: string;
    subscriberNo: string;
    billNumber: string;
    category: string;
  };
  swapInfo?: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
  };
}

export interface BillItem {
  id: string;
  category: 'electricity' | 'water' | 'syriatel' | 'mtn' | 'adsl' | 'fees';
  title: string;
  provider: string;
  subscriberNumber: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid';
  paidAt?: string;
  receiptNumber?: string;
}

export interface BranchLocation {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  workingHours: string;
  isMainBranch?: boolean;
  services: string[];
}

export interface SecuritySettings {
  pin: string;
  biometricEnabled: boolean;
  dailyLimitSYP: number;
  isCardFrozen: boolean;
  smsAlerts: boolean;
  accountTier: 'basic' | 'silver' | 'gold';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'transfer' | 'deposit' | 'bill' | 'security' | 'market';
  amount?: string;
}

export interface UploadedDocumentInfo {
  key: string;
  label: string;
  fileName: string;
  fileSize?: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface AccountRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  governorate: string;
  requestType: RequestType;
  status: ReviewStatus;
  submittedAt: string;
  loginAt?: string;
  logoutAt?: string;
  sessionDuration?: string;
  lastAction?: string;
  documentsCount?: number;
  documentNames?: string[];
  uploadedDocuments?: UploadedDocumentInfo[];
  note?: string;
  adminNotes?: string;
  deviceInfo?: string;
}

export interface AdminFullBackup {
  exportedAt: string;
  adminCredentials: AdminCredentials;
  accounts: AccountRecord[];
  loans: LoanApplication[];
  jobs: JobApplication[];
  complaints: ComplaintRecord[];
  activityLogs: ActivityLog[];
}

export interface JobVacancy {
  id: string;
  title: string;
  type: string; // دوام كامل، دوام جزئي، عن بعد
  department: string;
  location: string;
  experienceRequired: string;
  description: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  jobType: string;
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  experienceYears: string;
  experienceDetails: string;
  education: string;
  notes?: string;
  status: 'under_review' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface ComplaintRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  message: string; // نص المربع الكبير للشكاوى والملاحظات
  priority: 'normal' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  submittedAt: string;
  adminResponse?: string;
}

export interface LoanApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  loanAmount: number; // قيمة القرض بالليرة السورية
  loanDurationMonths: number; // مدة القرض بالأشهر
  loanReason: string; // سبب القرض
  monthlyIncome: string; // الدخل الشهري
  guarantorInfo: string; // معلومات الكفيل أو الضمانة
  estimatedMonthlyInstallment: number; // القسط الشهري
  status: 'under_review' | 'approved' | 'needs_documents' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userEmail?: string;
  userName?: string;
  details: string;
  timestamp: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  role: string;
  lastUpdated: string;
  adminNotes?: string;
}

export interface ContactData {
  fullName: string;
  phone: string;
  governorate: string;
}

export interface AuthData {
  email: string;
  password?: string;
}

export interface DocumentUploads {
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
  residenceProof: File | null;
}

export interface VerificationFormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  governorate: string;
  birthDate: string;
  gender: 'ذكر' | 'أنثى';
}

export interface CurrencyRate {
  id: string;
  name: string;
  symbol: string;
  flag: string;
  buyPrice: number;
  sellPrice: number;
  change: string;
}
