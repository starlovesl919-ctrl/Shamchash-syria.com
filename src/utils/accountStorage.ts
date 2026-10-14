import {
  AccountRecord,
  AdminCredentials,
  ReviewStatus,
  JobApplication,
  ComplaintRecord,
  LoanApplication,
  ActivityLog,
  JobVacancy,
  UploadedDocumentInfo,
  AdminFullBackup,
  WalletBalances,
  TransactionRecord,
  BillItem,
  BranchLocation,
  SecuritySettings,
  AppNotification
} from '../types';

const STORAGE_KEY = 'sc_all_accounts';
const ADMIN_STORAGE_KEY = 'sc_admin_credentials';
const JOBS_STORAGE_KEY = 'sc_job_applications';
const COMPLAINTS_STORAGE_KEY = 'sc_complaints';
const LOANS_STORAGE_KEY = 'sc_loan_applications';
const ACTIVITY_STORAGE_KEY = 'sc_activity_logs';

/**
 * Safe user validation helper
 */
export function isStarloveBlocked(_val?: string | null): boolean {
  return false;
}

/**
 * Storage cleanup helper (safe no-op)
 */
export function purgeStarloveFromStorage(): void {
  // Safe no-op: all accounts and users are accepted
}

export const AVAILABLE_JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'JOB-01',
    title: 'موظف خدمة عملاء وتوثيق إلكتروني',
    type: 'دوام كامل',
    department: 'قسم العمليات وخدمة العملاء',
    location: 'دمشق - المزة / ريف دمشق',
    experienceRequired: 'سنتان على الأقل',
    description: 'استقبال وفحص طلبات توثيق الحسابات، التدقيق بالهويات والمستندات السورية، وتقديم الدعم الفني المباشر لمستخدمي المحفظة.'
  },
  {
    id: 'JOB-02',
    title: 'محاسب ومدقق مالي ومصرفي',
    type: 'دوام كامل',
    department: 'الإدارة المالية والمحاسبة',
    location: 'حلب - العزيزية',
    experienceRequired: '3 سنوات في المحاسبة المصرفية',
    description: 'مطابقة قيود التحويلات النقدية، متابعة أرصدة تصريف العملات وأسعار الصرف، وإعداد التقارير المالية الدورية للإدارة.'
  },
  {
    id: 'JOB-03',
    title: 'مطور برمجيات وتطبيقات مالية (React / Node)',
    type: 'عن بعد / هجين',
    department: 'تكنولوجيا المعلومات والبرمجة',
    location: 'دمشق / جميع المحافظات السورية',
    experienceRequired: 'سنتان في تطوير منصات الويب والفنتك',
    description: 'تطوير وتحديث واجهات منصة شام كاش، تأمين المعاملات والاتصال الآمن بقواعد البيانات والأنظمة المصرفية.'
  },
  {
    id: 'JOB-04',
    title: 'مسؤول أمن سيبراني وحماية بيانات',
    type: 'دوام كامل',
    department: 'أمن المعلومات والامتثال',
    location: 'دمشق - أوتوستراد المزة',
    experienceRequired: '4 سنوات في الحماية والامتثال المالي',
    description: 'مراقبة العمليات المشبوهة، حماية بيانات العملاء وكلمات المرور، والتأكد من مطابقة معايير الحماية المصرفية السورية.'
  }
];

const INITIAL_JOBS: JobApplication[] = [
  {
    id: 'JOB-APP-101',
    jobTitle: 'موظف خدمة عملاء وتوثيق إلكتروني',
    jobType: 'دوام كامل',
    fullName: 'باسل محمود الحموي',
    phone: '+963 944 555 123',
    email: 'bassel.hamwi@gmail.com',
    governorate: 'دمشق',
    experienceYears: '3 سنوات',
    experienceDetails: 'خبرة سابقة سنتين في بنك سوري ومحفظة إلكترونية في خدمة العملاء ومراجعة وثائق الهوية.',
    education: 'إجازة في إدارة الأعمال - جامعة دمشق',
    notes: 'جاهز لبدء العمل فوراً ولديه إلمام بأنظمة شام كاش.',
    status: 'under_review',
    submittedAt: '2026-09-24 11:30'
  },
  {
    id: 'JOB-APP-102',
    jobTitle: 'محاسب ومدقق مالي ومصرفي',
    jobType: 'دوام كامل',
    fullName: 'سارة عبد القادر الشامي',
    phone: '+963 933 666 456',
    email: 'sara.shami@hotmail.com',
    governorate: 'حلب',
    experienceYears: '4 سنوات',
    experienceDetails: 'عملت كمدققة حسابات في شركة صرافة وشركة استشارات مالية بحلب.',
    education: 'إجازة في الاقتصاد والمحاسبة - جامعة حلب',
    notes: 'مرشحة قوية لمقابلة المقر الرئيسي بحلب.',
    status: 'shortlisted',
    submittedAt: '2026-09-23 15:45'
  }
];

const INITIAL_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'CMP-2026-01',
    fullName: 'طارق زياد المصري',
    phone: '+963 988 111 222',
    email: 'tarek.masri@yahoo.com',
    category: 'مشكلة في توثيق الحساب',
    message: 'قمت برفع صورة الهوية السورية وسند الإقامة منذ يومين ولم يتم تغيير حالة الطلب من قيد المراجعة حتى الآن، أرجو الإسراع نظراً لحاجتي الملحة لاستخدام المحفظة.',
    priority: 'urgent',
    status: 'in_progress',
    submittedAt: '2026-09-25 09:15',
    adminResponse: 'جاري مراجعة الصور وفحصها مع إدارة التوثيق وسيتم إشعاركم خلال ساعتين.'
  },
  {
    id: 'CMP-2026-02',
    fullName: 'ميساء فؤاد العلي',
    phone: '+963 955 777 888',
    email: 'maysa.ali@gmail.com',
    category: 'ملاحظة واقتراح لتطوير التطبيق',
    message: 'التطبيق ممتاز وسريع جداً، نقترح إضافة إشعارات عبر تطبيق الواتساب أو الرسائل القصيرة SMS فور اعتماد التوثيق لتسهيل متابعة الحالة لكبار السن.',
    priority: 'normal',
    status: 'resolved',
    submittedAt: '2026-09-22 17:00',
    adminResponse: 'شكراً لملاحظتك القيمة، تم رفع المقترح للفريق التقني وسيتم تضمينها في التحديث القادم.'
  }
];

const INITIAL_LOANS: LoanApplication[] = [
  {
    id: 'LOAN-7001',
    fullName: 'وسيم حسام الدين النجار',
    phone: '+963 991 333 444',
    email: 'waseem.najjar@gmail.com',
    governorate: 'حمص',
    loanAmount: 15000000,
    loanDurationMonths: 24,
    loanReason: 'تمويل افتتاح ورشة تصنيع ومعدات كهربائية جديدة',
    monthlyIncome: '2,800,000 ل.س',
    guarantorInfo: 'سند ملكية عقار تجاري + كفيل موظف حكومي معتمد',
    estimatedMonthlyInstallment: 725000,
    status: 'under_review',
    submittedAt: '2026-09-25 14:20',
    adminNotes: 'الملف كامل وتجري مراجعة الضمانة والرهن.'
  },
  {
    id: 'LOAN-7002',
    fullName: 'جمانة كمال البيطار',
    phone: '+963 944 888 999',
    email: 'joumana.bitar@outlook.com',
    governorate: 'اللاذقية',
    loanAmount: 8000000,
    loanDurationMonths: 12,
    loanReason: 'شراء بضاعة ومواد أولية لمحل تجاري قائم',
    monthlyIncome: '1,900,000 ل.س',
    guarantorInfo: 'سجل تجاري نظامي وكشف حساب مصرفي 6 أشهر',
    estimatedMonthlyInstallment: 730000,
    status: 'approved',
    submittedAt: '2026-09-24 10:10',
    adminNotes: 'تمت الموافقة المبدئية والتحويل إلى فرع اللاذقية للتوقيع.'
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-01',
    action: 'تسجيل دخول إلى النظام',
    userEmail: 'ahmad.kareem@gmail.com',
    userName: 'أحمد محمد عبد الكريم',
    details: 'تسجيل دخول ناجح وبدء جلسة توثيق الهوية عبر شام كاش',
    timestamp: '2026-09-26 13:40:22'
  },
  {
    id: 'LOG-02',
    action: 'تقديم طلب توثيق حساب رسمي',
    userEmail: 'ahmad.kareem@gmail.com',
    userName: 'أحمد محمد عبد الكريم',
    details: 'تم رفع 4 مستندات وتأكيد بيانات المحافظة (دمشق)',
    timestamp: '2026-09-26 13:41:10'
  }
];

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'ayhabkhzalh017@gmail.com',
  password: 'ShamAdmin@2026',
  role: 'المسؤول العام للتوثيق والعمليات (Super Admin)',
  lastUpdated: '2026-09-26 14:00',
  adminNotes: 'حساب الإدارة المعتمد لإدارة وتوثيق طلبات shamchas',
};

const INITIAL_ACCOUNTS: AccountRecord[] = [
  {
    id: 'SC-104288',
    fullName: 'أحمد محمد عبد الكريم',
    phone: '+963 944 123 456',
    email: 'ahmad.kareem@gmail.com',
    password: 'Ahmad@2026Pass',
    governorate: 'دمشق',
    requestType: 'verify',
    status: 'under_review',
    submittedAt: '2026-09-21 14:30',
    documentsCount: 4,
    documentNames: ['البطاقة الشخصية (الوجه الأمامي)', 'البطاقة الشخصية (الوجه الخلفي)', 'صورة شخصية (سيلفي مع الهوية)', 'سند إقامة حديث'],
    uploadedDocuments: [
      { key: 'idFront', label: 'البطاقة الشخصية (الوجه الأمامي)', fileName: 'id_front_ahmad.jpg', fileSize: '1.8 MB', uploadedAt: '2026-09-21 14:28' },
      { key: 'idBack', label: 'البطاقة الشخصية (الوجه الخلفي)', fileName: 'id_back_ahmad.jpg', fileSize: '1.6 MB', uploadedAt: '2026-09-21 14:29' },
      { key: 'selfie', label: 'صورة شخصية (سيلفي مع الهوية)', fileName: 'selfie_ahmad.jpg', fileSize: '2.4 MB', uploadedAt: '2026-09-21 14:29' },
      { key: 'residenceProof', label: 'سند إقامة حديث', fileName: 'residence_ahmad.pdf', fileSize: '850 KB', uploadedAt: '2026-09-21 14:30' }
    ],
    note: 'المستندات مكتملة وقيد الفحص الأمني والمصرفي.',
    adminNotes: 'تمت مراجعة بيانات الهوية السورية وهي متطابقة مع السجل المدني بدمشق.',
    deviceInfo: 'Android 14 / Chrome Mobile'
  },
  {
    id: 'SC-104287',
    fullName: 'ليان خالد الحسن',
    phone: '+963 933 789 012',
    email: 'layan.alhasan@hotmail.com',
    password: 'Layan#Syria2026',
    governorate: 'حلب',
    requestType: 'verify',
    status: 'verified',
    submittedAt: '2026-09-20 11:15',
    documentsCount: 4,
    documentNames: ['البطاقة الشخصية (الوجه الأمامي)', 'البطاقة الشخصية (الوجه الخلفي)', 'صورة شخصية', 'فاتورة كهرباء'],
    uploadedDocuments: [
      { key: 'idFront', label: 'البطاقة الشخصية (الوجه الأمامي)', fileName: 'layan_id_front.jpg', fileSize: '2.1 MB', uploadedAt: '2026-09-20 11:10' },
      { key: 'idBack', label: 'البطاقة الشخصية (الوجه الخلفي)', fileName: 'layan_id_back.jpg', fileSize: '1.9 MB', uploadedAt: '2026-09-20 11:12' },
      { key: 'selfie', label: 'صورة شخصية', fileName: 'layan_selfie.jpg', fileSize: '3.1 MB', uploadedAt: '2026-09-20 11:13' },
      { key: 'residenceProof', label: 'فاتورة كهرباء حديثة', fileName: 'layan_electricity_bill.pdf', fileSize: '1.2 MB', uploadedAt: '2026-09-20 11:14' }
    ],
    note: 'تم التوثيق بنجاح واعتماد الحساب.',
    adminNotes: 'تم تدقيق كافة الوثائق بنجاح وإرسال إشعار التفعيل للمستخدمة.',
    deviceInfo: 'iOS 17.5 / iPhone 15 Pro'
  },
  {
    id: 'SC-104286',
    fullName: 'عمر سامي الديري',
    phone: '+963 988 456 789',
    email: 'omar.samideir@yahoo.com',
    password: 'Omar!Deir988',
    governorate: 'دير الزور',
    requestType: 'swap',
    status: 'needs_info',
    submittedAt: '2026-09-19 16:45',
    documentsCount: 0,
    note: 'يرجى تأكيد الحساب البنكي المرتبط لإتمام تفعيل ميزة تصريف العملات.',
    adminNotes: 'تم التواصل هاتفياً لطلب إرفاق صورة عن رقم الحساب المصرفي.',
    deviceInfo: 'Android 13 / Xiaomi Redmi'
  },
  {
    id: 'SC-104285',
    fullName: 'رهف ياسر النعيمي',
    phone: '+963 955 234 567',
    email: 'rahaf.alnuaimi@outlook.com',
    password: 'Rahaf$Pass955',
    governorate: 'حمص',
    requestType: 'verify',
    status: 'verified',
    submittedAt: '2026-09-18 09:20',
    documentsCount: 4,
    documentNames: ['البطاقة الشخصية (الوجه الأمامي)', 'البطاقة الشخصية (الوجه الخلفي)', 'صورة شخصية', 'سند إقامة'],
    uploadedDocuments: [
      { key: 'idFront', label: 'البطاقة الشخصية (الوجه الأمامي)', fileName: 'rahaf_front.jpg', fileSize: '1.5 MB', uploadedAt: '2026-09-18 09:15' },
      { key: 'idBack', label: 'البطاقة الشخصية (الوجه الخلفي)', fileName: 'rahaf_back.jpg', fileSize: '1.4 MB', uploadedAt: '2026-09-18 09:16' },
      { key: 'selfie', label: 'صورة شخصية', fileName: 'rahaf_selfie.jpg', fileSize: '2.0 MB', uploadedAt: '2026-09-18 09:17' },
      { key: 'residenceProof', label: 'سند إقامة مختوم', fileName: 'rahaf_residence.pdf', fileSize: '650 KB', uploadedAt: '2026-09-18 09:19' }
    ],
    note: 'تم التحقق من الوثائق السورية الرسمية.',
    adminNotes: 'حساب مفعل وموثق بشكل نظامي.',
    deviceInfo: 'Windows 11 / Edge'
  },
  {
    id: 'SC-104284',
    fullName: 'سامر وليد القاسم',
    phone: '+963 991 876 543',
    email: 'samer.kassem@gmail.com',
    password: 'Samer#Kassem99',
    governorate: 'اللاذقية',
    requestType: 'swap',
    status: 'under_review',
    submittedAt: '2026-09-17 13:50',
    documentsCount: 0,
    note: 'طلب تفعيل خيار تبديل العملات بالحساب قيد المراجعة.',
    adminNotes: 'طلب جديد قيد التدقيق لدى قسم العمليات.',
    deviceInfo: 'iOS 16.4 / iPhone 13'
  },
  {
    id: 'SC-104283',
    fullName: 'نور الهدى صالح',
    phone: '+963 966 345 678',
    email: 'noor.saleh@gmail.com',
    password: 'Noor*Saleh966',
    governorate: 'حماة',
    requestType: 'verify',
    status: 'verified',
    submittedAt: '2026-09-16 10:05',
    documentsCount: 4,
    documentNames: ['البطاقة الشخصية (الوجه الأمامي)', 'البطاقة الشخصية (الوجه الخلفي)', 'سيلفي مع البطاقة', 'سند إقامة مختوم'],
    uploadedDocuments: [
      { key: 'idFront', label: 'البطاقة الشخصية (الوجه الأمامي)', fileName: 'noor_front.jpg', fileSize: '1.7 MB', uploadedAt: '2026-09-16 10:01' },
      { key: 'idBack', label: 'البطاقة الشخصية (الوجه الخلفي)', fileName: 'noor_back.jpg', fileSize: '1.8 MB', uploadedAt: '2026-09-16 10:02' },
      { key: 'selfie', label: 'سيلفي مع البطاقة', fileName: 'noor_selfie.jpg', fileSize: '2.5 MB', uploadedAt: '2026-09-16 10:03' },
      { key: 'residenceProof', label: 'سند إقامة مختوم', fileName: 'noor_residence.pdf', fileSize: '700 KB', uploadedAt: '2026-09-16 10:04' }
    ],
    note: 'الحساب موثق ومفعل بالكامل.',
    adminNotes: 'تم الانتهاء من التوثيق وتسليم الحساب للمستخدم.',
    deviceInfo: 'Android 12 / Huawei P40'
  }
];

// Admin Credentials Management
export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
      return DEFAULT_ADMIN_CREDENTIALS;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && typeof parsed.password === 'string') {
      return {
        ...DEFAULT_ADMIN_CREDENTIALS,
        ...parsed,
      };
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  } catch (err) {
    console.error('Error reading admin credentials from storage:', err);
    return DEFAULT_ADMIN_CREDENTIALS;
  }
}

export function saveAdminCredentials(creds: Partial<AdminCredentials>): AdminCredentials {
  try {
    const current = getAdminCredentials();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const updated: AdminCredentials = {
      ...current,
      ...creds,
      lastUpdated: formattedDate,
    };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_admin_credentials_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error saving admin credentials:', err);
    return getAdminCredentials();
  }
}

export function resetAdminCredentials(): AdminCredentials {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
    window.dispatchEvent(new CustomEvent('sc_admin_credentials_updated', { detail: DEFAULT_ADMIN_CREDENTIALS }));
    return DEFAULT_ADMIN_CREDENTIALS;
  } catch (err) {
    return DEFAULT_ADMIN_CREDENTIALS;
  }
}

export function getSavedAccounts(): AccountRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_ACCOUNTS;
    return list.filter(
      (a: AccountRecord) =>
        !isStarloveBlocked(a.email) &&
        !isStarloveBlocked(a.fullName) &&
        !isStarloveBlocked(a.id)
    );
  } catch (err) {
    console.error('Error reading saved accounts from storage:', err);
    return INITIAL_ACCOUNTS;
  }
}

export function saveAccountRecord(newAccount: AccountRecord): AccountRecord[] {
  try {
    const cleanAccount: AccountRecord = {
      ...newAccount,
      fullName: newAccount.fullName || 'مستخدم شام كاش',
      email: newAccount.email,
    };

    const current = getSavedAccounts();
    // Match by ID, or if same email matches an existing record
    const existingIndex = current.findIndex(
      a => a.id === cleanAccount.id || (Boolean(cleanAccount.email) && a.email.toLowerCase() === cleanAccount.email.toLowerCase())
    );
    let updated: AccountRecord[];

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      updated = [...current];
      updated[existingIndex] = {
        ...existing,
        ...cleanAccount,
        // Preserve password if cleanAccount doesn't specify one
        password: cleanAccount.password || existing.password,
        // Preserve or merge uploaded documents
        uploadedDocuments: cleanAccount.uploadedDocuments && cleanAccount.uploadedDocuments.length > 0 
          ? cleanAccount.uploadedDocuments 
          : existing.uploadedDocuments,
        documentsCount: cleanAccount.documentsCount !== undefined 
          ? cleanAccount.documentsCount 
          : existing.documentsCount,
        documentNames: cleanAccount.documentNames && cleanAccount.documentNames.length > 0 
          ? cleanAccount.documentNames 
          : existing.documentNames,
        adminNotes: cleanAccount.adminNotes || existing.adminNotes,
        deviceInfo: cleanAccount.deviceInfo || existing.deviceInfo,
      };
    } else {
      updated = [cleanAccount, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger custom event for cross-component sync
    window.dispatchEvent(new CustomEvent('sc_accounts_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error saving account record:', err);
    return getSavedAccounts();
  }
}

export function updateAccountAdminNotes(id: string, adminNotes: string): AccountRecord[] {
  try {
    const current = getSavedAccounts();
    const updated = current.map(item => {
      if (item.id === id) {
        return {
          ...item,
          adminNotes,
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_accounts_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error updating account admin notes:', err);
    return getSavedAccounts();
  }
}

export function updateAccountStatus(id: string, status: ReviewStatus, note?: string): AccountRecord[] {
  try {
    const current = getSavedAccounts();
    const updated = current.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          ...(note !== undefined ? { note } : {}),
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_accounts_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error updating account status:', err);
    return getSavedAccounts();
  }
}

export function deleteAccountRecord(id: string): AccountRecord[] {
  try {
    const current = getSavedAccounts();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_accounts_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error deleting account record:', err);
    return getSavedAccounts();
  }
}

export function exportAccountsAsJSON(accountsList?: AccountRecord[]): void {
  const accounts = accountsList || getSavedAccounts();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(accounts, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `shamcash_accounts_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportAccountsAsCSV(accountsList?: AccountRecord[]): void {
  const accounts = accountsList || getSavedAccounts();
  const headers = [
    'رقم الطلب',
    'الاسم الكامل',
    'البريد الإلكتروني',
    'كلمة السر المحفوظة',
    'رقم الهاتف',
    'المحافظة',
    'نوع الطلب',
    'الحالة',
    'عدد الوثائق المرفوعة',
    'أسماء الوثائق',
    'تاريخ التقديم',
    'وقت تسجيل الدخول',
    'وقت تسجيل الخروج',
    'مدة الجلسة',
    'ملاحظات المستخدم',
    'ملاحظات الإدارة الداخلية',
    'معلومات الجهاز والنظام'
  ];
  
  const statusLabels: Record<ReviewStatus, string> = {
    under_review: 'قيد المراجعة',
    verified: 'موثق',
    needs_info: 'يحتاج معلومات',
    rejected: 'مرفوض'
  };

  const rows = accounts.map(a => [
    `"${a.id}"`,
    `"${a.fullName}"`,
    `"${a.email}"`,
    `"${(a.password || '').replace(/"/g, '""')}"`,
    `"${a.phone}"`,
    `"${a.governorate}"`,
    `"${a.requestType === 'verify' ? 'توثيق الحساب' : 'تبديل العملة'}"`,
    `"${statusLabels[a.status] || a.status}"`,
    `"${a.documentsCount ?? 0}"`,
    `"${((a.documentNames || []).join(' | ')).replace(/"/g, '""')}"`,
    `"${a.submittedAt}"`,
    `"${a.loginAt || a.submittedAt}"`,
    `"${a.logoutAt || 'جلسة نشطة'}"`,
    `"${a.sessionDuration || '—'}"`,
    `"${(a.note || '').replace(/"/g, '""')}"`,
    `"${(a.adminNotes || '').replace(/"/g, '""')}"`,
    `"${(a.deviceInfo || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shamcash_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportAdminCredentialsAsCSV(): void {
  const accounts = getSavedAccounts();
  const adminCreds = getAdminCredentials();
  const headers = [
    'رقم الطلب',
    'الاسم الكامل',
    'البريد الإلكتروني للعميل',
    'كلمة السر المحفوظة',
    'رقم الهاتف',
    'المحافظة',
    'نوع الطلب',
    'الحالة',
    'عدد الوثائق',
    'تاريخ التسجيل',
    'ملاحظات المستخدم',
    'ملاحظات الإدارة'
  ];
  
  const statusLabels: Record<ReviewStatus, string> = {
    under_review: 'قيد المراجعة',
    verified: 'موثق',
    needs_info: 'يحتاج معلومات',
    rejected: 'مرفوض'
  };

  const rows = accounts.map(a => [
    `"${a.id}"`,
    `"${a.fullName}"`,
    `"${a.email}"`,
    `"${(a.password || '').replace(/"/g, '""')}"`,
    `"${a.phone}"`,
    `"${a.governorate}"`,
    `"${a.requestType === 'verify' ? 'توثيق الحساب' : 'تبديل العملة'}"`,
    `"${statusLabels[a.status] || a.status}"`,
    `"${a.documentsCount ?? 0}"`,
    `"${a.submittedAt}"`,
    `"${(a.note || '').replace(/"/g, '""')}"`,
    `"${(a.adminNotes || '').replace(/"/g, '""')}"`
  ]);

  const metaHeader = `# تقرير بيانات اعتماد الإدارة المركزية - شام كاش\n# بريد الإدارة: ${adminCreds.email}\n# تاريخ التصدير: ${new Date().toISOString()}\n`;
  const csvContent = '\uFEFF' + metaHeader + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shamcash_admin_vault_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportAllDataBackup(): void {
  const accounts = getSavedAccounts();
  const adminCreds = getAdminCredentials();
  const loans = getLoanApplications();
  const jobs = getJobApplications();
  const complaints = getComplaints();
  const logs = getActivityLogs();

  const backupPayload = {
    exportedAt: new Date().toISOString(),
    system: 'منظومة شام كاش المركزية - النسخة الاحتياطية الشاملة لكافة بيانات المستخدمين والإدارة',
    adminCredentials: {
      email: adminCreds.email,
      role: adminCreds.role,
      lastUpdated: adminCreds.lastUpdated,
      adminNotes: adminCreds.adminNotes || ''
    },
    summaryMetrics: {
      totalAccountsCount: accounts.length,
      totalLoanApplicationsCount: loans.length,
      totalJobApplicationsCount: jobs.length,
      totalComplaintsCount: complaints.length,
      totalActivityLogsCount: logs.length
    },
    accounts,
    loans,
    jobs,
    complaints,
    activityLogs: logs
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `shamcash_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportLoansAsCSV(): void {
  const loans = getLoanApplications();
  const headers = ['رقم الطلب', 'اسم المقترض', 'رقم الهاتف', 'البريد الإلكتروني', 'المحافظة', 'قيمة القرض (ل.س)', 'مدة القرض (أشهر)', 'القسط الشهري التقديري', 'الدخل الشهري', 'الضمانة والكفيل', 'سبب القرض', 'الحالة', 'تاريخ التقديم'];
  const rows = loans.map(l => [
    `"${l.id}"`,
    `"${l.fullName}"`,
    `"${l.phone}"`,
    `"${l.email}"`,
    `"${l.governorate}"`,
    `"${l.loanAmount}"`,
    `"${l.loanDurationMonths}"`,
    `"${l.estimatedMonthlyInstallment}"`,
    `"${l.monthlyIncome}"`,
    `"${(l.guarantorInfo || '').replace(/"/g, '""')}"`,
    `"${(l.loanReason || '').replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${l.submittedAt}"`
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shamcash_loans_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportJobsAsCSV(): void {
  const jobs = getJobApplications();
  const headers = ['رقم الطلب', 'اسم المتقدم', 'المسمى الوظيفي', 'نوع الدوام', 'رقم الهاتف', 'البريد الإلكتروني', 'المحافظة', 'المؤهل العلمي', 'سنوات الخبرة', 'الخبرات والمهارات', 'ملاحظات إضافية', 'الحالة', 'تاريخ التقديم'];
  const rows = jobs.map(j => [
    `"${j.id}"`,
    `"${j.fullName}"`,
    `"${j.jobTitle}"`,
    `"${j.jobType}"`,
    `"${j.phone}"`,
    `"${j.email}"`,
    `"${j.governorate}"`,
    `"${j.education}"`,
    `"${j.experienceYears}"`,
    `"${(j.experienceDetails || '').replace(/"/g, '""')}"`,
    `"${(j.notes || '').replace(/"/g, '""')}"`,
    `"${j.status}"`,
    `"${j.submittedAt}"`
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shamcash_jobs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportComplaintsAsCSV(): void {
  const complaints = getComplaints();
  const headers = ['رقم الشكوى', 'اسم صاحب الملاحظة', 'رقم الهاتف', 'البريد الإلكتروني', 'التصنيف', 'درجة الأولوية', 'نص الشكوى / الملاحظة', 'رد الإدارة', 'الحالة', 'تاريخ التقديم'];
  const rows = complaints.map(c => [
    `"${c.id}"`,
    `"${c.fullName}"`,
    `"${c.phone}"`,
    `"${c.email}"`,
    `"${c.category}"`,
    `"${c.priority === 'urgent' ? 'عاجلة' : 'عادية'}"`,
    `"${(c.message || '').replace(/"/g, '""')}"`,
    `"${(c.adminResponse || '').replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${c.submittedAt}"`
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `shamcash_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function exportAdminCredentialsAsJSON(): void {
  const accounts = getSavedAccounts();
  const adminCreds = getAdminCredentials();
  const payload = {
    exportedAt: new Date().toISOString(),
    adminCredentials: {
      email: adminCreds.email,
      role: adminCreds.role,
      lastUpdated: adminCreds.lastUpdated,
    },
    accountsTotal: accounts.length,
    accounts: accounts.map(a => ({
      id: a.id,
      fullName: a.fullName,
      email: a.email,
      password: a.password || '',
      phone: a.phone,
      governorate: a.governorate,
      requestType: a.requestType,
      status: a.status,
      submittedAt: a.submittedAt,
      note: a.note || ''
    }))
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `shamcash_admin_vault_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// ------------------- Jobs Storage -------------------
export function getJobApplications(): JobApplication[] {
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_JOBS;
    return list.filter(
      (j: JobApplication) => !isStarloveBlocked(j.email) && !isStarloveBlocked(j.fullName)
    );
  } catch {
    return INITIAL_JOBS;
  }
}

export function saveJobApplication(newJob: JobApplication): JobApplication[] {
  try {
    const current = getJobApplications();
    const updated = [newJob, ...current];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_jobs_updated', { detail: updated }));
    logUserActivity(
      'تقديم طلب توظيف جديد',
      `تقديم طلب لوظيفة (${newJob.jobTitle}) باسم ${newJob.fullName}`,
      newJob.email,
      newJob.fullName
    );
    return updated;
  } catch {
    return getJobApplications();
  }
}

export function updateJobStatus(id: string, status: JobApplication['status']): JobApplication[] {
  try {
    const current = getJobApplications();
    const updated = current.map(j => (j.id === id ? { ...j, status } : j));
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_jobs_updated', { detail: updated }));
    return updated;
  } catch {
    return getJobApplications();
  }
}

export function deleteJobApplication(id: string): JobApplication[] {
  try {
    const current = getJobApplications();
    const updated = current.filter(j => j.id !== id);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_jobs_updated', { detail: updated }));
    return updated;
  } catch {
    return getJobApplications();
  }
}

// ------------------- Complaints Storage -------------------
export function getComplaints(): ComplaintRecord[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_COMPLAINTS;
    return list.filter(
      (c: ComplaintRecord) => !isStarloveBlocked(c.email) && !isStarloveBlocked(c.fullName)
    );
  } catch {
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaint(complaint: ComplaintRecord): ComplaintRecord[] {
  try {
    const current = getComplaints();
    const updated = [complaint, ...current];
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_complaints_updated', { detail: updated }));
    logUserActivity(
      'تسجيل شكوى / ملاحظة جديدة',
      `تصنيف (${complaint.category}): ${complaint.message.slice(0, 60)}...`,
      complaint.email,
      complaint.fullName
    );
    return updated;
  } catch {
    return getComplaints();
  }
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintRecord['status'],
  adminResponse?: string
): ComplaintRecord[] {
  try {
    const current = getComplaints();
    const updated = current.map(c =>
      c.id === id ? { ...c, status, ...(adminResponse !== undefined ? { adminResponse } : {}) } : c
    );
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_complaints_updated', { detail: updated }));
    return updated;
  } catch {
    return getComplaints();
  }
}

export function deleteComplaint(id: string): ComplaintRecord[] {
  try {
    const current = getComplaints();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_complaints_updated', { detail: updated }));
    return updated;
  } catch {
    return getComplaints();
  }
}

// ------------------- Loans Storage -------------------
export function getLoanApplications(): LoanApplication[] {
  try {
    const raw = localStorage.getItem(LOANS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(INITIAL_LOANS));
      return INITIAL_LOANS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_LOANS;
    return list.filter(
      (l: LoanApplication) => !isStarloveBlocked(l.email) && !isStarloveBlocked(l.fullName)
    );
  } catch {
    return INITIAL_LOANS;
  }
}

export function saveLoanApplication(loan: LoanApplication): LoanApplication[] {
  try {
    const current = getLoanApplications();
    const updated = [loan, ...current];
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_loans_updated', { detail: updated }));
    logUserActivity(
      'تقديم طلب قرض مالي',
      `قيمة القرض: ${loan.loanAmount.toLocaleString()} ل.س لمدة ${loan.loanDurationMonths} شهر (${loan.loanReason})`,
      loan.email,
      loan.fullName
    );
    return updated;
  } catch {
    return getLoanApplications();
  }
}

export function updateLoanStatus(
  id: string,
  status: LoanApplication['status'],
  adminNotes?: string
): LoanApplication[] {
  try {
    const current = getLoanApplications();
    const updated = current.map(l =>
      l.id === id ? { ...l, status, ...(adminNotes !== undefined ? { adminNotes } : {}) } : l
    );
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_loans_updated', { detail: updated }));
    return updated;
  } catch {
    return getLoanApplications();
  }
}

export function deleteLoanApplication(id: string): LoanApplication[] {
  try {
    const current = getLoanApplications();
    const updated = current.filter(l => l.id !== id);
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_loans_updated', { detail: updated }));
    return updated;
  } catch {
    return getLoanApplications();
  }
}

// ------------------- Activity Logs Storage -------------------
export function getActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : INITIAL_LOGS;
    return list.filter(
      (l: ActivityLog) =>
        !isStarloveBlocked(l.userEmail) &&
        !isStarloveBlocked(l.userName) &&
        !isStarloveBlocked(l.details)
    );
  } catch {
    return INITIAL_LOGS;
  }
}

export function logUserActivity(
  action: string,
  details: string,
  userEmail?: string,
  userName?: string
): ActivityLog[] {
  try {
    const current = getActivityLogs();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const effectiveEmail = userEmail || localStorage.getItem('sc_waiting_email') || 'زائر / غير محدد';
    const effectiveName = userName || localStorage.getItem('sc_contact_name') || 'مستخدم شام كاش';

    const newLog: ActivityLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      action,
      details,
      userEmail: effectiveEmail,
      userName: effectiveName,
      timestamp
    };

    const updated = [newLog, ...current].slice(0, 100); // keep last 100 entries
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_activity_updated', { detail: updated }));
    return updated;
  } catch {
    return getActivityLogs();
  }
}

export function clearActivityLogs(): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('sc_activity_updated', { detail: [] }));
  } catch {}
}

// ------------------- Real Wallet & Banking System -------------------
const WALLET_BALANCES_KEY = 'sc_wallet_balances_v2';
const TRANSACTIONS_KEY = 'sc_wallet_transactions_v2';
const BILLS_KEY = 'sc_wallet_bills_v2';
const NOTIFICATIONS_KEY = 'sc_wallet_notifications_v2';
const SECURITY_KEY = 'sc_wallet_security_v2';

const DEFAULT_BALANCES: WalletBalances = {
  SYP: 18750000,
  USD: 650,
  EUR: 280,
  AED: 1200,
};

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TX-984210',
    type: 'transfer_in',
    title: 'حوالة واردة من مكتب الفؤاد للصرافة',
    subtitle: 'حلب - العزيزية',
    amount: 2500000,
    currency: 'SYP',
    fee: 0,
    status: 'completed',
    timestamp: '2026-09-27 18:24',
    senderName: 'شركة الفؤاد للحوالات المالية',
    senderAccount: 'SY-ALFOUAD-8821',
    recipientName: 'حساب شام كاش المعتمد',
    referenceNumber: 'REF-ALF-994201',
    category: 'transfer',
    notes: 'استلام حوالة تجارية فورية'
  },
  {
    id: 'TX-984209',
    type: 'bill_payment',
    title: 'سداد فاتورة كهرباء دمشق',
    subtitle: 'المؤسسة العامة لنقل وتوزيع الكهرباء',
    amount: 145000,
    currency: 'SYP',
    fee: 1000,
    status: 'completed',
    timestamp: '2026-09-26 14:10',
    recipientName: 'المؤسسة العامة للكهرباء',
    referenceNumber: 'BILL-ELEC-442109',
    category: 'bill',
    billInfo: {
      provider: 'كهرباء دمشق وريفها',
      subscriberNo: '88410294',
      billNumber: 'EB-2026-09',
      category: 'كهرباء'
    }
  },
  {
    id: 'TX-984208',
    type: 'transfer_out',
    title: 'تحويل فوري إلى محمد الشامي',
    subtitle: 'تحويل بين محافظ شام كاش',
    amount: 500000,
    currency: 'SYP',
    fee: 0,
    status: 'completed',
    timestamp: '2026-09-25 11:35',
    recipientName: 'محمد هيثم الشامي',
    recipientAccount: 'SC-881920',
    referenceNumber: 'TRF-SC-77124',
    category: 'transfer',
    notes: 'دفعة مشتريات تجهيزات'
  },
  {
    id: 'TX-984207',
    type: 'currency_swap',
    title: 'تصريف عملة فورية: 100 USD إلى SYP',
    subtitle: 'سعر الصرف 14,950 ل.س / $',
    amount: 1495000,
    currency: 'SYP',
    fee: 0,
    status: 'completed',
    timestamp: '2026-09-24 16:50',
    referenceNumber: 'SWAP-FX-33910',
    category: 'exchange',
    swapInfo: {
      fromCurrency: 'USD',
      toCurrency: 'SYP',
      fromAmount: 100,
      toAmount: 1495000,
      exchangeRate: 14950
    }
  },
  {
    id: 'TX-984206',
    type: 'bill_payment',
    title: 'شحن رصيد وباقة سيريتل كاش',
    subtitle: 'Syriatel Mobile Telecom',
    amount: 65000,
    currency: 'SYP',
    fee: 500,
    status: 'completed',
    timestamp: '2026-09-23 09:12',
    recipientName: 'سيريتل سورية',
    referenceNumber: 'SYR-TOPUP-9921',
    category: 'bill',
    billInfo: {
      provider: 'سيريتل Syriatel',
      subscriberNo: '+963 944 881 294',
      billNumber: 'TOPUP-9921',
      category: 'اتصالات'
    }
  },
  {
    id: 'TX-984205',
    type: 'deposit',
    title: 'إيداع نقدي عبر مركز شام كاش - دمشق',
    subtitle: 'فرع المزة فيلات غربية',
    amount: 5000000,
    currency: 'SYP',
    fee: 0,
    status: 'completed',
    timestamp: '2026-09-21 12:00',
    recipientName: 'حساب شام كاش الشخصي',
    referenceNumber: 'DEP-BR-01-44391',
    category: 'deposit',
    notes: 'إيداع نقدي كاش شباك الصندوق'
  }
];

const INITIAL_BILLS: BillItem[] = [
  {
    id: 'BILL-01',
    category: 'electricity',
    title: 'فاتورة الكهرباء - دمشق المركزية',
    provider: 'الشركة العامة لكهرباء محافظة دمشق',
    subscriberNumber: '22849104',
    amount: 125000,
    dueDate: '2026-10-15',
    status: 'unpaid'
  },
  {
    id: 'BILL-02',
    category: 'water',
    title: 'فاتورة مياه الشرب - دمشق وريفها',
    provider: 'المؤسسة العامة لمياه الشرب والصرف الصحي',
    subscriberNumber: '994102',
    amount: 32000,
    dueDate: '2026-10-20',
    status: 'unpaid'
  },
  {
    id: 'BILL-03',
    category: 'syriatel',
    title: 'فاتورة خط لاحق الدفع سيريتل',
    provider: 'شركة سيريتل موبايل تيليكوم',
    subscriberNumber: '0944123456',
    amount: 78000,
    dueDate: '2026-10-10',
    status: 'unpaid'
  },
  {
    id: 'BILL-04',
    category: 'adsl',
    title: 'اشتراك الإنترنت المنزلي ADSL تراسل',
    provider: 'الشركة السورية للاتصالات - تراسل',
    subscriberNumber: '0112134567',
    amount: 45000,
    dueDate: '2026-10-05',
    status: 'unpaid'
  },
  {
    id: 'BILL-05',
    category: 'mtn',
    title: 'فاتورة خط MTN سورية',
    provider: 'شركة MTN سورية',
    subscriberNumber: '0933456789',
    amount: 52000,
    dueDate: '2026-10-12',
    status: 'unpaid'
  }
];

export const SYRIAN_BRANCHES: BranchLocation[] = [
  {
    id: 'BR-DAM-01',
    name: 'المقر الرئيسي والإدارة العامة - دمشق',
    city: 'دمشق',
    district: 'المزة - أوتوستراد المزة',
    address: 'مقابل حديقة الجلاء، برج شام كاش المالي',
    phone: '+963 11 611 0000',
    workingHours: 'يومياً من 8:30 ص حتى 5:00 م (ما عدا الجمعة)',
    isMainBranch: true,
    services: ['توثيق فوري للهويات', 'إيداع وسحب مالي فوري', 'تصريف وتداول العملات', 'حوالات مصرفية فورية', 'قسم التمويل والقروض']
  },
  {
    id: 'BR-DAM-02',
    name: 'فرع دمشق القديمة والحريقة',
    city: 'دمشق',
    district: 'ساحة المرجة - الحريقة',
    address: 'سوق الصاغة والتجار، بناء النصر الطابق الأول',
    phone: '+963 11 224 8899',
    workingHours: 'من 9:00 ص حتى 6:00 م',
    services: ['حوالات تجارية فورية', 'سحب وإيداع نقدي', 'صرافة وتداول', 'خدمة التجار والـ QR']
  },
  {
    id: 'BR-DAM-03',
    name: 'فرع ريف دمشق - جرمانا',
    city: 'ريف دمشق',
    district: 'جرمانا',
    address: 'ساحة السيوف، جانب بنك بيمو',
    phone: '+963 11 562 3344',
    workingHours: 'من 9:00 ص حتى 5:00 م',
    services: ['شحن محافظ', 'تحويلات وصرافة', 'توثيق حسابات']
  },
  {
    id: 'BR-ALP-01',
    name: 'فرع حلب الرئيسي - العزيزية',
    city: 'حلب',
    district: 'حي العزيزية',
    address: 'شارع القوتلي، قرب ساحة سعد الله الجابري',
    phone: '+963 21 212 9900',
    workingHours: 'من 8:30 ص حتى 5:00 م',
    isMainBranch: true,
    services: ['حوالات نقدية وصرافة', 'قروض الأعمال والمشاريع', 'توثيق الحسابات', 'سحب وإيداع']
  },
  {
    id: 'BR-HMS-01',
    name: 'فرع حمص - الدبلان',
    city: 'حمص',
    district: 'شارع الدبلان التجاري',
    address: 'مقابل مجمع النور الطبي',
    phone: '+963 31 245 6677',
    workingHours: 'من 9:00 ص حتى 4:30 م',
    services: ['إيداع وسحب كاش', 'حوالات سريعة', 'توثيق هويات']
  },
  {
    id: 'BR-LTK-01',
    name: 'فرع اللاذقية - الشيخ ضاهر',
    city: 'اللاذقية',
    district: 'ساحة الشيخ ضاهر',
    address: 'شارع 8 آذار، بناء بنك البركة',
    phone: '+963 41 478 1122',
    workingHours: 'من 9:00 ص حتى 5:00 م',
    services: ['سحب وإيداع', 'حوالات بحرية وتجارية', 'توثيق حسابات']
  },
  {
    id: 'BR-TAR-01',
    name: 'فرع طرطوس - الكورنيش البحري',
    city: 'طرطوس',
    district: 'شارع الثورة',
    address: 'قرب المصرف التجاري السوري فرع 1',
    phone: '+963 43 321 7788',
    workingHours: 'من 9:00 ص حتى 4:30 م',
    services: ['سحب وإيداع', 'حوالات تجارية', 'خدمة العملاء']
  },
  {
    id: 'BR-HMA-01',
    name: 'فرع حماة - ساحة العاصي',
    city: 'حماة',
    district: 'ساحة العاصي',
    address: 'بناء النواعير، مقابل المركز الثقافي',
    phone: '+963 33 512 4455',
    workingHours: 'من 9:00 ص حتى 4:30 م',
    services: ['شحن المحافظ الإلكترونية', 'تصريف عملات', 'توثيق الهوية']
  },
  {
    id: 'BR-SWD-01',
    name: 'فرع السويداء - ساحة تشرين',
    city: 'السويداء',
    district: 'ساحة تشرين',
    address: 'شارع المحطة، جانب المجمع الحكومي',
    phone: '+963 16 223 9911',
    workingHours: 'من 9:00 ص حتى 4:00 م',
    services: ['إيداع وسحب', 'حوالات فورية', 'توثيق حسابات']
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'حوالة واردة جديدة إلى محفظتك',
    message: 'تم إيداع مبلغ 2,500,000 ل.س من مكتب الفؤاد للصرافة بنجاح.',
    timestamp: 'منذ ساعتين',
    read: false,
    type: 'transfer',
    amount: '+2,500,000 ل.س'
  },
  {
    id: 'NOTIF-02',
    title: 'تأكيد سداد فاتورة الكهرباء',
    message: 'تم سداد فاتورة كهرباء دمشق بقيمة 145,000 ل.س واقتطاع المبلغ فوراً.',
    timestamp: 'أمس 14:10',
    read: true,
    type: 'bill',
    amount: '-145,000 ل.س'
  },
  {
    id: 'NOTIF-03',
    title: 'تحديث أسعار صرف العملات بالسوق',
    message: 'سجل سعر صرف الدولار اليوم 14,950 ل.س مع استقرار أسعار اليورو والذهب.',
    timestamp: 'قبل يومين',
    read: true,
    type: 'market'
  },
  {
    id: 'NOTIF-04',
    title: 'أمان الحساب وتفعيل البصمة',
    message: 'تم تفعيل التحقق الثنائي ورمز الأمان السري PIN للعمليات المالية.',
    timestamp: 'قبل 3 أيام',
    read: true,
    type: 'security'
  }
];

const DEFAULT_SECURITY: SecuritySettings = {
  pin: '1234',
  biometricEnabled: true,
  dailyLimitSYP: 35000000,
  isCardFrozen: false,
  smsAlerts: true,
  accountTier: 'gold'
};

// Wallet balances getters & setters
export function getWalletBalances(): WalletBalances {
  try {
    const raw = localStorage.getItem(WALLET_BALANCES_KEY);
    if (!raw) {
      localStorage.setItem(WALLET_BALANCES_KEY, JSON.stringify(DEFAULT_BALANCES));
      return DEFAULT_BALANCES;
    }
    const parsed = JSON.parse(raw);
    return {
      SYP: typeof parsed.SYP === 'number' ? parsed.SYP : DEFAULT_BALANCES.SYP,
      USD: typeof parsed.USD === 'number' ? parsed.USD : DEFAULT_BALANCES.USD,
      EUR: typeof parsed.EUR === 'number' ? parsed.EUR : DEFAULT_BALANCES.EUR,
      AED: typeof parsed.AED === 'number' ? parsed.AED : DEFAULT_BALANCES.AED,
    };
  } catch {
    return DEFAULT_BALANCES;
  }
}

export function saveWalletBalances(balances: WalletBalances): void {
  try {
    localStorage.setItem(WALLET_BALANCES_KEY, JSON.stringify(balances));
    // Also sync the legacy single balance key
    localStorage.setItem('sc_wallet_balance', String(balances.SYP));
    window.dispatchEvent(new CustomEvent('sc_wallet_updated', { detail: balances }));
  } catch {}
}

export function updateWalletBalance(currency: keyof WalletBalances, delta: number): WalletBalances {
  const current = getWalletBalances();
  const updated: WalletBalances = {
    ...current,
    [currency]: Math.max(0, current[currency] + delta),
  };
  saveWalletBalances(updated);
  return updated;
}

// Transaction getters & adders
export function getTransactions(): TransactionRecord[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function addTransaction(tx: Omit<TransactionRecord, 'id' | 'timestamp'>): TransactionRecord {
  try {
    const current = getTransactions();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newRecord: TransactionRecord = {
      ...tx,
      id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: formattedDate
    };

    const updated = [newRecord, ...current];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_transactions_updated', { detail: updated }));

    // Add corresponding notification
    addNotification({
      title: newRecord.title,
      message: `${newRecord.subtitle || 'تمت العملية بنجاح'}. الرمز المرجعي: ${newRecord.referenceNumber}`,
      type: newRecord.type === 'deposit' ? 'deposit' : newRecord.type === 'bill_payment' ? 'bill' : 'transfer',
      amount: `${newRecord.type === 'transfer_out' || newRecord.type === 'bill_payment' ? '-' : '+'}${newRecord.amount.toLocaleString()} ${newRecord.currency}`
    });

    return newRecord;
  } catch {
    const fallback: TransactionRecord = {
      ...tx,
      id: 'TX-TEMP',
      timestamp: new Date().toISOString()
    };
    return fallback;
  }
}

// Bills getters & payers
export function getBillsList(): BillItem[] {
  try {
    const raw = localStorage.getItem(BILLS_KEY);
    if (!raw) {
      localStorage.setItem(BILLS_KEY, JSON.stringify(INITIAL_BILLS));
      return INITIAL_BILLS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_BILLS;
  } catch {
    return INITIAL_BILLS;
  }
}

export function payBill(billId: string): { success: boolean; message: string; bill?: BillItem } {
  try {
    const bills = getBillsList();
    const idx = bills.findIndex((b) => b.id === billId);
    if (idx === -1) return { success: false, message: 'الفاتورة غير موجودة' };

    const targetBill = bills[idx];
    if (targetBill.status === 'paid') {
      return { success: false, message: 'تم سداد هذه الفاتورة مسبقاً' };
    }

    const balances = getWalletBalances();
    if (balances.SYP < targetBill.amount) {
      return { success: false, message: 'رصيد الليرة السورية في محفظتك غير كافٍ لسداد الفاتورة' };
    }

    // Deduct balance
    updateWalletBalance('SYP', -targetBill.amount);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const receiptNum = 'REC-SY-' + Math.floor(100000 + Math.random() * 900000);

    const updatedBill: BillItem = {
      ...targetBill,
      status: 'paid',
      paidAt: dateStr,
      receiptNumber: receiptNum
    };

    bills[idx] = updatedBill;
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));

    // Record in transactions
    addTransaction({
      type: 'bill_payment',
      title: `سداد ${updatedBill.title}`,
      subtitle: `${updatedBill.provider} - رقم الاشتراك: ${updatedBill.subscriberNumber}`,
      amount: updatedBill.amount,
      currency: 'SYP',
      fee: 0,
      status: 'completed',
      recipientName: updatedBill.provider,
      referenceNumber: receiptNum,
      category: 'bill',
      billInfo: {
        provider: updatedBill.provider,
        subscriberNo: updatedBill.subscriberNumber,
        billNumber: updatedBill.id,
        category: updatedBill.category
      }
    });

    logUserActivity(
      'سداد فاتورة إلكترونية',
      `تم سداد ${updatedBill.title} بقيمة ${updatedBill.amount.toLocaleString()} ل.س برقم إشعار (${receiptNum})`
    );

    return { success: true, message: 'تم تسديد الفاتورة بنجاح وحسم القيمة من رصيد المحفظة', bill: updatedBill };
  } catch (e: any) {
    return { success: false, message: e.message || 'فشلت عملية السداد' };
  }
}

// Notifications getters & setters
export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addNotification(n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  try {
    const current = getNotifications();
    const newN: AppNotification = {
      ...n,
      id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: 'الآن',
      read: false
    };
    const updated = [newN, ...current].slice(0, 50);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('sc_notifications_updated', { detail: updated }));
    return newN;
  } catch {
    return {
      ...n,
      id: 'NOTIF-0',
      timestamp: 'الآن',
      read: false
    };
  }
}

export function markNotificationAsRead(id: string): void {
  try {
    const list = getNotifications().map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('sc_notifications_updated', { detail: list }));
  } catch {}
}

export function markAllNotificationsRead(): void {
  try {
    const list = getNotifications().map((item) => ({ ...item, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('sc_notifications_updated', { detail: list }));
  } catch {}
}

// Security settings
export function getSecuritySettings(): SecuritySettings {
  try {
    const raw = localStorage.getItem(SECURITY_KEY);
    if (!raw) {
      localStorage.setItem(SECURITY_KEY, JSON.stringify(DEFAULT_SECURITY));
      return DEFAULT_SECURITY;
    }
    return { ...DEFAULT_SECURITY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SECURITY;
  }
}

export function updateSecuritySettings(settings: Partial<SecuritySettings>): SecuritySettings {
  try {
    const current = getSecuritySettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(SECURITY_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('sc_security_updated', { detail: merged }));
    return merged;
  } catch {
    return DEFAULT_SECURITY;
  }
}

export function getBranchesList(): BranchLocation[] {
  return SYRIAN_BRANCHES;
}

