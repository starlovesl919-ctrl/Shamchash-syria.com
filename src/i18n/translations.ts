export type Language = 'ar' | 'en';

export interface Translations {
  // Navigation & General
  syrianRepublic: string;
  savedAccounts: string;
  accountsCountSuffix: string;
  poweredBy: string;
  version: string;
  back: string;
  close: string;
  cancel: string;
  save: string;
  continue: string;
  copied: string;
  copy: string;
  delete: string;
  details: string;
  track: string;
  languageName: string;
  toggleLanguage: string;
  shareApp: string;
  shareAppSuccess: string;

  // HomeScreen
  portalBadge: string;
  homeTitle: string;
  homeSubtitle: string;
  btnVerify: string;
  btnSwap: string;
  btnCalculator: string;
  badgeLive: string;
  btnSavedAccounts: string;
  statSuccess: string;
  statSpeed: string;
  statUptime: string;
  statSuccessLabel: string;
  statSpeedLabel: string;
  statUptimeLabel: string;
  securitySectionTitle: string;
  privacyTitle: string;
  privacyDesc: string;
  bankingTitle: string;
  bankingDesc: string;
  fastProcessingTitle: string;
  fastProcessingDesc: string;
  swapSectionTitle: string;
  tryCalculator: string;
  swapDesc: string;
  swapFeature1: string;
  swapFeature2: string;
  swapFeature3: string;
  swapFeature4: string;
  swapFeature5: string;
  readyTitle: string;
  readyDesc: string;
  btnStartNow: string;

  // ContactInfoScreen
  contactTitle: string;
  contactSubtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHelp: string;
  governorateLabel: string;
  governorateSelect: string;
  contactNote: string;
  btnContinueAccount: string;
  errFullNameRequired: string;
  errFullNameMin: string;
  errPhoneRequired: string;
  errPhoneInvalid: string;

  // AuthScreen
  authTitle: string;
  authSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordHelp: string;
  securityNotice: string;
  securityNoticeDesc: string;
  btnSignInContinue: string;
  errEmailRequired: string;
  errEmailInvalid: string;
  errPasswordRequired: string;
  errPasswordMin: string;

  // VerifyScreen
  verifyTitle: string;
  verifySubtitle: string;
  stepData: string;
  stepDocs: string;
  stepReview: string;
  birthDateLabel: string;
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  btnNextToDocs: string;
  docsTitle: string;
  docsSubtitle: string;
  docIdFront: string;
  docIdBack: string;
  docSelfie: string;
  docResidence: string;
  docRequired: string;
  docOptional: string;
  uploadDragDrop: string;
  uploadBrowse: string;
  uploadedSuccess: string;
  btnBack: string;
  btnNextToReview: string;
  reviewTitle: string;
  reviewSubtitle: string;
  reviewConfirmText: string;
  btnSubmitVerification: string;
  submittingText: string;

  // WaitingScreen
  waitingTitle: string;
  waitingTitleUnderReview: string;
  waitingDescUnderReview: string;
  waitingTitleVerified: string;
  waitingDescVerified: string;
  waitingTitleNeedsInfo: string;
  waitingDescNeedsInfo: string;
  waitingTitleRejected: string;
  waitingDescRejected: string;
  reviewNumber: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  instruction4: string;
  btnRefreshStatus: string;
  btnReturnHome: string;
  btnViewSavedAccounts: string;
  requestIdLabel: string;
  elapsedTimeLabel: string;
  statusUnderReview: string;
  statusVerified: string;
  statusNeedsInfo: string;
  statusRejected: string;
  statusUnderReviewDesc: string;
  statusVerifiedDesc: string;
  statusNeedsInfoDesc: string;
  statusRejectedDesc: string;
  instr1: string;
  instr2: string;
  instr3: string;
  instr4: string;
  btnCheckStatus: string;
  checkingStatus: string;
  btnBackHome: string;
  btnViewInSaved: string;
  demoStatusSwitcher: string;

  // Currency Calculator Modal
  calcTitle: string;
  calcSubtitle: string;
  sendAmount: string;
  receiveAmount: string;
  rateInfo: string;
  feeInfo: string;
  btnRequestFeature: string;
  swapModalTitle: string;
  swapModalSubtitle: string;
  cityRateLabel: string;
  buyRate: string;
  sellRate: string;
  amountToConvert: string;
  estimatedResult: string;
  noFeeNote: string;
  btnSimulateSwap: string;
  btnRequestSwapAccount: string;

  // Saved Accounts Screen
  savedScreenTitle: string;
  savedScreenSubtitle: string;
  savedAccountsTitle: string;
  savedAccountsSubtitle: string;
  btnNewAccount: string;
  btnExportCsv: string;
  btnExportJson: string;
  exportCsv: string;
  exportJson: string;
  statTotalAccounts: string;
  statVerifiedAccounts: string;
  statUnderReviewAccounts: string;
  statNeedsInfoAccounts: string;
  statVerified: string;
  statUnderReview: string;
  statNeedsInfo: string;
  searchPlaceholder: string;
  filterAllStatuses: string;
  filterAllRequests: string;
  filterStatusAll: string;
  filterStatusUnderReview: string;
  filterStatusVerified: string;
  filterStatusNeedsInfo: string;
  filterStatusRejected: string;
  filterTypeAll: string;
  filterTypeVerify: string;
  filterTypeSwap: string;
  noAccountsFound: string;
  noAccountsDesc: string;
  noAccountsHint: string;
  auditNote: string;
  accountDetailsTitle: string;
  applicantFullName: string;
  applicantGovernorate: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantRequestType: string;
  applicantSubmittedAt: string;
  currentStatusLabel: string;
  attachedDocuments: string;
  reviewerNotes: string;
  noNotes: string;
  editNote: string;
  saveNote: string;
  deleteRecord: string;
  closeModal: string;
  deleteConfirm: string;

  // Admin Portal & Credentials Management
  adminPortal: string;
  adminPortalTitle: string;
  adminPortalSubtitle: string;
  adminBadge: string;
  adminCredentialsSection: string;
  adminCredentialsDesc: string;
  adminEmailLabel: string;
  adminPasswordLabel: string;
  adminRoleLabel: string;
  adminLastUpdatedLabel: string;
  adminNotesLabel: string;
  btnSaveAdminCreds: string;
  adminCredsSavedSuccess: string;
  btnResetAdminDefault: string;
  userVaultSection: string;
  userVaultDesc: string;
  thApplicant: string;
  thEmail: string;
  thPassword: string;
  thType: string;
  thStatus: string;
  thActions: string;
  showPassword: string;
  hidePassword: string;
  copyPassword: string;
  copyEmail: string;
  passwordCopied: string;
  emailCopied: string;
  exportAdminCsv: string;
  exportAdminJson: string;
  adminLockTitle: string;
  adminLockDesc: string;
  adminPassPrompt: string;
  btnUnlockAdmin: string;
  lockAdminPanel: string;
  errInvalidAdminPass: string;
  adminDefaultHint: string;
  statCapturedPasswords: string;
  btnGoToAdmin: string;
  adminMasterSettings: string;
  adminSecurityNotice: string;
  adminAccessUnlocked: string;
  adminDedicatedAreaBadge: string;

  // New Navigation
  navJobs: string;
  navComplaints: string;
  navLoans: string;
  navHome: string;
  navLogin: string;
  navLogout: string;
  navDownload: string;
  activeUserSession: string;
  logoutConfirm: string;

  // Jobs Screen
  jobsTitle: string;
  jobsSubtitle: string;
  openVacanciesTitle: string;
  jobApplyTitle: string;
  jobTypeLabel: string;
  experienceYearsLabel: string;
  experienceDetailsLabel: string;
  educationLabel: string;
  btnSubmitJobApp: string;
  jobSuccessTitle: string;
  jobSuccessDesc: string;

  // Complaints & Feedback Screen
  complaintsTitle: string;
  complaintsSubtitle: string;
  complaintCategoryLabel: string;
  complaintMessageLabel: string;
  complaintPlaceholder: string;
  priorityLabel: string;
  priorityNormal: string;
  priorityUrgent: string;
  btnSubmitComplaint: string;
  complaintSuccessTitle: string;
  complaintSuccessDesc: string;

  // Loans Screen
  loansTitle: string;
  loansSubtitle: string;
  loanCalculatorTitle: string;
  loanAmountLabel: string;
  loanDurationLabel: string;
  loanReasonLabel: string;
  monthlyIncomeLabel: string;
  guarantorLabel: string;
  estimatedInstallmentLabel: string;
  monthsSuffix: string;
  currencySyp: string;
  btnSubmitLoan: string;
  loanSuccessTitle: string;
  loanSuccessDesc: string;

  // Admin Additional Tabs
  adminTabCreds: string;
  adminTabAccounts: string;
  adminTabLoans: string;
  adminTabJobs: string;
  adminTabComplaints: string;
  adminTabLogs: string;

  // Governorates dictionary
  governorates: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  ar: {
    syrianRepublic: 'الجمهورية العربية السورية',
    savedAccounts: 'سجل الحسابات',
    accountsCountSuffix: 'حساب',
    poweredBy: 'POWERED BY',
    version: 'V 2.2.6 • شام كاش سوريا',
    back: 'رجوع',
    close: 'إغلاق',
    cancel: 'إلغاء',
    save: 'حفظ',
    continue: 'متابعة',
    copied: 'تم النسخ',
    copy: 'نسخ',
    delete: 'حذف',
    details: 'التفاصيل',
    track: 'متابعة',
    languageName: 'English',
    toggleLanguage: 'التحويل إلى اللغة الإنجليزية',
    shareApp: 'مشاركة الرابط',
    shareAppSuccess: 'تم نسخ الرابط بنجاح!',

    // HomeScreen
    portalBadge: 'المنظومة الرسمية المعتمدة • الجمهورية العربية السورية',
    homeTitle: 'بوابة توثيق الحسابات والخدمات المصرفية',
    homeSubtitle: 'وثّق حسابك إلكترونياً بخطوات يسيرة ومؤمّنة، وارفع مستنداتك الرسمية، وقدّم طلبات القروض والتسهيلات المالية، وتابع حالة طلبك مباشرةً دون الحاجة لزيارة أي فرع في سوريا.',
    btnVerify: 'تقديم طلب توثيق الحساب الرسمي',
    btnSwap: 'طلب خدمات التحويل والمدفوعات الإلكترونية',
    btnCalculator: 'حاسبة أسعار الصرف الرسمية والتحويل المالي',
    badgeLive: 'لحظي',
    btnSavedAccounts: 'سجل الحسابات والمعاملات المحفوظة',
    statSuccess: '+1,248',
    statSpeed: '24-48h',
    statUptime: '99.9%',
    statSuccessLabel: 'طلب ناجح',
    statSpeedLabel: 'سرعة التنفيذ',
    statUptimeLabel: 'جاهزية المنصة',
    securitySectionTitle: 'المزايا الأمنية',
    privacyTitle: 'خصوصية تامة',
    privacyDesc: 'تُشفَّر مستنداتك أثناء الرفع والتخزين، ولا يطّلع عليها سوى فريق التوثيق المختص في سوريا.',
    bankingTitle: 'أمان مصرفي',
    bankingDesc: 'بنية تحتية مطابقة لمعايير الأمان المالي مع تتبع كامل لكل عملية مراجعة وإشعار لحظي.',
    fastProcessingTitle: 'معالجة سريعة',
    fastProcessingDesc: 'مراجعة معظم الطلبات خلال 24 إلى 48 ساعة عمل مع إشعارات فورية بكافة التحديثات على هاتفك المحمول.',
    swapSectionTitle: 'خدمة التحويل والمدفوعات المالية الإلكترونية',
    tryCalculator: 'تجربة الحاسبة',
    swapDesc: 'خدمة التحويل المالي الإلكتروني على حساب شام كاش لإدارة رصيدك المالي بكل يسر وشفافية تامة.',
    swapFeature1: 'تحويل الرصيد المالي داخل الحساب مباشرةً وبلا أدنى تأخير.',
    swapFeature2: 'عرض أسعار الصرف الرسمية والعمولة والناتج النهائي بالليرة السورية.',
    swapFeature3: 'تنفيذ فوري في الحساب فور الموافقة والمطابقة.',
    swapFeature4: 'تحديد عملة العرض الافتراضية للرصيد.',
    swapFeature5: 'حفظ كشف حساب وسجل مستقل لكل عملية ومعاملة.',
    readyTitle: 'هل أنت مستعد لتوثيق حسابك؟',
    readyDesc: 'قم بتجهيز بطاقتك الشخصية السورية بصورة واضحة، ولا تستغرق العملية بأكملها أكثر من خمس دقائق.',
    btnStartNow: 'ابدأ التوثيق الآن',

    // ContactInfoScreen
    contactTitle: 'بيانات التواصل',
    contactSubtitle: 'يرجى إدخال اسمك ورقم هاتفك المحمول للتواصل معك وإرسال إشعار فوري فور الانتهاء من مراجعة طلبك.',
    fullNameLabel: 'الاسم الثلاثي الكامل (وفق البطاقة الشخصية)',
    fullNamePlaceholder: 'مثال: محمد أحمد الخالد',
    phoneLabel: 'رقم الهاتف المحمول السوري',
    phonePlaceholder: '09xx xxx xxx أو 9xx xxx xxx',
    phoneHelp: 'يقبل الأرقام السورية (MTN أو سرياتيل).',
    governorateLabel: 'المحافظة',
    governorateSelect: 'اختر المحافظة',
    contactNote: 'يُستخدم رقم الهاتف لإشعارك بنتيجة التوثيق عبر رسالة نصية قصيرة.',
    btnContinueAccount: 'متابعة وإدخال بيانات الحساب',
    errFullNameRequired: 'يرجى إدخال الاسم الثلاثي الكامل',
    errFullNameMin: 'الاسم قصير جداً، يرجى كتابة الاسم الثلاثي كاملاً',
    errPhoneRequired: 'يرجى إدخال رقم الهاتف المحمول',
    errPhoneInvalid: 'يرجى إدخال رقم هاتف سوري صحيح يبدأ بـ 09 أو 9',

    // AuthScreen
    authTitle: 'تسجيل الدخول إلى حسابك',
    authSubtitle: 'أدخل بريدك الإلكتروني المسجل في شام كاش للمتابعة',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    passwordHelp: 'كلمة المرور الخاصة بحسابك في تطبيق شام كاش.',
    securityNotice: 'تنبيه أمني',
    securityNoticeDesc: 'تُعالج البيانات عبر اتصال آمن ومشفر بأعلى معايير الحماية المصرفية.',
    btnSignInContinue: 'تسجيل الدخول والمتابعة',
    errEmailRequired: 'يرجى إدخال البريد الإلكتروني',
    errEmailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    errPasswordRequired: 'يرجى إدخال كلمة المرور',
    errPasswordMin: 'يجب أن لا تقل كلمة المرور عن 6 خانات',

    // VerifyScreen
    verifyTitle: 'توثيق الهوية السورية الرسمية',
    verifySubtitle: 'خطوات إلكترونية سريعة ومحمية لرفع مستنداتك وتأكيد هويتك',
    stepData: 'البيانات الشخصية',
    stepDocs: 'رفع المستندات',
    stepReview: 'المراجعة والتأكيد',
    birthDateLabel: 'تاريخ الميلاد',
    genderLabel: 'الجنس',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    btnNextToDocs: 'الانتقال لرفع المستندات والوثائق',
    docsTitle: 'رفع الوثائق الرسمية المطلوبة',
    docsSubtitle: 'يرجى رفع صور واضحة وملونة للبطاقة الشخصية السورية وسند الإقامة',
    docIdFront: 'البطاقة الشخصية (الوجه الأمامي)',
    docIdBack: 'البطاقة الشخصية (الوجه الخلفي)',
    docSelfie: 'صورة شخصية حديثة مع البطاقة الشخصية',
    docResidence: 'إثبات محل الإقامة (سند إقامة أو إيصال رسمي)',
    docRequired: 'مطلوب إلزامي',
    docOptional: 'اختياري',
    uploadDragDrop: 'اسحب الملف هنا أو',
    uploadBrowse: 'تصفح من جهازك',
    uploadedSuccess: 'تم تحميل المستند بنجاح',
    btnBack: 'السابق',
    btnNextToReview: 'متابعة إلى خطوة المراجعة النهائية',
    reviewTitle: 'مراجعة وتأكيد البيانات والمستندات',
    reviewSubtitle: 'يرجى التحقق من دقة وصحة كافة المعلومات قبل التثبيت النهائي',
    reviewConfirmText: 'أقر بصحة البيانات والوثائق المرفقة ومطابقتها للأصول القانونية السورية.',
    btnSubmitVerification: 'تثبيت وإرسال طلب التوثيق للمراجعة',
    submittingText: 'جارٍ إرسال البيانات وتشفير المستندات...',

    // WaitingScreen
    waitingTitle: 'طلبك قيد المراجعة والتدقيق',
    waitingTitleUnderReview: 'طلبك قيد المراجعة والتدقيق',
    waitingDescUnderReview: 'يقوم الفريق المختص حالياً بمطابقة بياناتك ووثائقك مع السجلات المعتمدة، ويُرجى عدم إغلاق هذه الصفحة لتلقي الإشعار فور اعتماده.',
    waitingTitleVerified: 'تهانينا! تم توثيق حسابك بنجاح',
    waitingDescVerified: 'تم تدقيق كافة مستنداتك والموافقة عليها رسمياً، وأصبح حسابك في شام كاش موثقاً بالكامل.',
    waitingTitleNeedsInfo: 'مطلوب إرفاق معلومات أو وثائق إضافية',
    waitingDescNeedsInfo: 'يرجى مراجعة الملاحظة أدناه وإعادة إرفاق صورة واضحة للبطاقة الشخصية السورية لمتابعة إجراءات التوثيق.',
    waitingTitleRejected: 'تعذر قبول طلب التوثيق حالياً',
    waitingDescRejected: 'لم نتمكن من اعتماد الطلب نظراً لعدم استيفاء الشروط والوثائق المحددة في النظام المالي السوري.',
    reviewNumber: 'رقم المراجعة',
    instruction1: 'يرجى البقاء في هذه الصفحة وعدم إغلاق المتصفح لضمان استمرار الجلسة.',
    instruction2: 'لا تقم بتحديث الصفحة يدوياً ولا تضغط على زر الرجوع.',
    instruction3: 'سيتم تحديث الحالة تلقائياً فور موافقة فريق التدقيق والمراجعة.',
    instruction4: 'إذا أردت التحقق فوراً، يمكنك الضغط على زر التحديث أدناه.',
    btnRefreshStatus: 'التحقق من حالة الطلب الآن',
    btnReturnHome: 'العودة إلى الصفحة الرئيسية',
    btnViewSavedAccounts: 'عرض الحساب في سجل الحسابات المحفوظة',
    requestIdLabel: 'رمز مراجعة الطلب',
    elapsedTimeLabel: 'الوقت المنقضي',
    statusUnderReview: 'قيد المراجعة',
    statusVerified: 'تم التوثيق والاعتماد بنجاح',
    statusNeedsInfo: 'يحتاج إلى معلومات إضافية',
    statusRejected: 'تم رفض الطلب',
    statusUnderReviewDesc: 'يقوم الفريق المختص حالياً بمطابقة بياناتك ووثائقك مع السجلات المعتمدة.',
    statusVerifiedDesc: 'تهانينا! تمت ترقية حسابك وتوثيقه بالكامل.',
    statusNeedsInfoDesc: 'يرجى إعادة رفع صورة واضحة للهوية السورية لعدم وضوح الأرقام.',
    statusRejectedDesc: 'تعذر قبول الطلب بسبب عدم مطابقة المستندات للشروط المصرفية.',
    instr1: 'يرجى البقاء في هذه الصفحة وعدم إغلاق المتصفح لضمان استمرار الجلسة.',
    instr2: 'لا تقم بتحديث الصفحة يدوياً ولا تضغط على زر الرجوع.',
    instr3: 'سيتم تحديث الحالة تلقائياً فور موافقة فريق التدقيق والمراجعة.',
    instr4: 'إذا أردت التحقق فوراً، يمكنك الضغط على زر التحديث أدناه.',
    btnCheckStatus: 'التحقق من حالة الطلب الآن',
    checkingStatus: 'جارٍ التحقق من الخادم…',
    btnBackHome: 'العودة إلى الصفحة الرئيسية',
    btnViewInSaved: 'عرض الحساب في سجل الحسابات المحفوظة',
    demoStatusSwitcher: 'محاكاة تغيير الحالة (للعرض والتدقيق):',

    // Currency Calculator Modal
    calcTitle: 'حاسبة أسعار الصرف السورية وتصريف شام كاش',
    calcSubtitle: 'أسعار لحظية مباشرة وفق نشرة التداول الرسمية المعتمدة',
    sendAmount: 'المبلغ المراد تبديله',
    receiveAmount: 'المبلغ التقديري المستلم',
    rateInfo: 'سعر الصرف اللحظي',
    feeInfo: 'العمولة المصرفية (0.5%)',
    btnRequestFeature: 'طلب تفعيل الخدمة في حسابي',
    swapModalTitle: 'حاسبة تصريف شام كاش (shamchas)',
    swapModalSubtitle: 'أسعار السوق الحية وتصريف المحفظة بالليرة السورية',
    cityRateLabel: 'سعر الصرف في:',
    buyRate: 'سعر الشراء الحالي',
    sellRate: 'سعر المبيع',
    amountToConvert: 'المبلغ المراد تحويله',
    estimatedResult: 'الناتج التقديري بالصرف',
    noFeeNote: 'عمولة 0% على التحويل الداخلي',
    btnSimulateSwap: 'تنفيذ تجربة تبديل',
    btnRequestSwapAccount: 'طلب تفعيل الخدمة في حسابي',

    // Saved Accounts Screen
    savedScreenTitle: 'سجل بيانات الحسابات والطلبات',
    savedScreenSubtitle: 'قاعدة البيانات المحلية الموثوقة لجميع حسابات وطلبات التوثيق وتصريف العملات',
    savedAccountsTitle: 'سجل بيانات الحسابات والطلبات',
    savedAccountsSubtitle: 'قاعدة البيانات المحلية الموثوقة لجميع حسابات وطلبات التوثيق وتصريف العملات',
    btnNewAccount: 'طلب حساب جديد',
    btnExportCsv: 'تصدير CSV',
    btnExportJson: 'نسخ احتياطي',
    exportCsv: 'تصدير CSV',
    exportJson: 'نسخ احتياطي JSON',
    statTotalAccounts: 'إجمالي الحسابات',
    statVerifiedAccounts: 'حسابات موثقة',
    statUnderReviewAccounts: 'قيد المراجعة',
    statNeedsInfoAccounts: 'تحتاج معلومات',
    statVerified: 'حسابات موثقة',
    statUnderReview: 'قيد المراجعة',
    statNeedsInfo: 'تحتاج معلومات',
    searchPlaceholder: 'ابحث بالاسم، البريد، الجوال، المحافظة أو رمز الطلب...',
    filterAllStatuses: 'كافة الحالات',
    filterAllRequests: 'كافة الطلبات',
    filterStatusAll: 'كافة الحالات',
    filterStatusUnderReview: 'قيد المراجعة',
    filterStatusVerified: 'موثق ومقبول',
    filterStatusNeedsInfo: 'يحتاج معلومات',
    filterStatusRejected: 'مرفوض',
    filterTypeAll: 'كافة الطلبات',
    filterTypeVerify: 'توثيق الحساب',
    filterTypeSwap: 'تبديل العملة',
    noAccountsFound: 'لم يتم العثور على أي حسابات',
    noAccountsDesc: 'جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية',
    noAccountsHint: 'جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية',
    auditNote: 'ملاحظة التدقيق',
    accountDetailsTitle: 'تفاصيل الحساب المسجل',
    applicantFullName: 'الاسم الكامل',
    applicantGovernorate: 'المحافظة',
    applicantEmail: 'البريد الإلكتروني',
    applicantPhone: 'رقم الجوال السوري',
    applicantRequestType: 'نوع الطلب',
    applicantSubmittedAt: 'تاريخ التقديم',
    currentStatusLabel: 'حالة الطلب الحالية:',
    attachedDocuments: 'المستندات المرفقة:',
    reviewerNotes: 'ملاحظات فريق التدقيق:',
    noNotes: 'لا توجد ملاحظات مسجلة بعد.',
    editNote: 'تعديل الملاحظة',
    saveNote: 'حفظ الملاحظة',
    deleteRecord: 'حذف السجل',
    closeModal: 'إغلاق',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف بيانات هذا الحساب نهائياً؟',

    // لوحة وإدارة الاعتمادات المخصصة
    adminPortal: 'بوابة الإدارة',
    adminPortalTitle: 'لوحة الإدارة المركزية وخزنة الاعتمادات',
    adminPortalSubtitle: 'قسم مخصص لإدارة المنصة لحفظ وتعديل بيانات البريد الإلكتروني وكلمة المرور وسجلات حسابات المستخدمين ومعاملاتهم',
    adminBadge: 'قسم مخصص للإدارة العامة • نظام مؤمن ومحمي',
    adminCredentialsSection: 'بيانات اعتماد الإدارة الرئيسية والمسؤولين',
    adminCredentialsDesc: 'حفظ وتعديل البريد الإلكتروني المعتمد وكلمة المرور الرسمية المخصصة للمسؤول وإدارة المنصة.',
    adminEmailLabel: 'البريد الإلكتروني المعتمد للإدارة',
    adminPasswordLabel: 'كلمة مرور الإدارة الرئيسية',
    adminRoleLabel: 'مستوى الصلاحية الإدارية',
    adminLastUpdatedLabel: 'تاريخ آخر تحديث للبيانات',
    adminNotesLabel: 'ملاحظات وتوجيهات أمنية للإدارة',
    btnSaveAdminCreds: 'حفظ بيانات اعتماد الإدارة',
    adminCredsSavedSuccess: 'تم حفظ بيانات البريد الإلكتروني وكلمة المرور بنجاح في سجلات الإدارة!',
    btnResetAdminDefault: 'استعادة القيم الافتراضية',
    userVaultSection: 'خزنة بيانات الدخول وكلمات المرور للمستخدمين',
    userVaultDesc: 'سجل شامل لكافة الحسابات والطلبات المقدمة متضمناً البريد الإلكتروني وكلمة المرور المحفوظة لكل مستخدم.',
    thApplicant: 'صاحب الطلب / الحساب',
    thEmail: 'البريد الإلكتروني للمستخدم',
    thPassword: 'كلمة المرور المحفوظة',
    thType: 'نوع الخدمة',
    thStatus: 'حالة الطلب',
    thActions: 'الإجراءات',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    copyPassword: 'نسخ كلمة المرور',
    copyEmail: 'نسخ البريد الإلكتروني',
    passwordCopied: 'تم نسخ كلمة المرور بنجاح!',
    emailCopied: 'تم نسخ البريد الإلكتروني بنجاح!',
    exportAdminCsv: 'تصدير جدول الاعتمادات وكلمات المرور (ملف إكسل)',
    exportAdminJson: 'تصدير النسخة الاحتياطية الشاملة للإدارة (ملف رقمي)',
    adminLockTitle: 'التحقق الأمني للدخول إلى لوحة الإدارة',
    adminLockDesc: 'هذا القسم مخصص لإدارة المنظومة فقط؛ يرجى إدخال كلمة مرور الإدارة للوصول إلى الخزنة والبيانات المحفوظة.',
    adminPassPrompt: 'كلمة مرور مسؤول الإدارة',
    btnUnlockAdmin: 'دخول لوحة الإدارة',
    lockAdminPanel: 'قفل لوحة الإدارة',
    errInvalidAdminPass: 'كلمة مرور الإدارة غير صحيحة، يرجى إعادة المحاولة.',
    adminDefaultHint: 'مفتاح المرور المعتمد للإدارة المركزية: ShamAdmin@2026',
    statCapturedPasswords: 'حسابات مسجلة بكلمة مرور',
    btnGoToAdmin: 'لوحة الإدارة وخزنة الاعتمادات',
    adminMasterSettings: 'إعدادات حساب الإدارة العامة',
    adminSecurityNotice: 'تنبيه أمني: يتم حفظ وتشفير كلمات المرور والبيانات محلياً لحماية الخصوصية وفق معايير شام كاش المصرفية.',
    adminAccessUnlocked: 'تم التحقق من صلاحيات الإدارة بنجاح',
    adminDedicatedAreaBadge: 'مكان مخصص للإدارة',

    // New Navigation
    navJobs: 'بوابة الوظائف',
    navComplaints: 'الشكاوى والملاحظات',
    navLoans: 'طلب القروض',
    navHome: 'الصفحة الرئيسية',
    navLogin: 'تسجيل الدخول',
    navLogout: 'تسجيل الخروج',
    navDownload: 'تحميل التطبيق هنا',
    activeUserSession: 'جلسة المستخدم الحالية',
    logoutConfirm: 'هل ترغب في تسجيل الخروج وإنهاء الجلسة الحالية؟',

    // Jobs Screen
    jobsTitle: 'بوابة التوظيف وفرص العمل الرسمية',
    jobsSubtitle: 'انضم إلى فريق عمل شام كاش الرائد في المحافظات السورية؛ استعرض الشواغر المهنية المتاحة وقدّم طلبك مباشرة.',
    openVacanciesTitle: 'الشواغر الوظيفية المتاحة حالياً',
    jobApplyTitle: 'استمارة التقديم على الوظيفة',
    jobTypeLabel: 'المسمى ونوع الوظيفة المطلوبة',
    experienceYearsLabel: 'عدد سنوات الخبرة المهنية',
    experienceDetailsLabel: 'تفاصيل الخبرات السابقة والمهارات العملية',
    educationLabel: 'المؤهل العلمي والتخصص الأكاديمي',
    btnSubmitJobApp: 'إرسال وتقديم طلب التوظيف',
    jobSuccessTitle: 'تم استلام طلب التوظيف بنجاح!',
    jobSuccessDesc: 'تم حفظ طلبك وسيرتك المهنية في سجلات الإدارة، وسيقوم فريق الموارد البشرية بالتدقيق والتواصل معك قريباً.',

    // Complaints & Feedback Screen
    complaintsTitle: 'صندوق الشكاوى والملاحظات والمقترحات',
    complaintsSubtitle: 'صوتكم أولويتنا؛ تفضلوا بتسجيل شكواكم أو ملاحظاتكم التطويرية لمتابعتها مباشرة من قبل الإدارة العليا.',
    complaintCategoryLabel: 'تصنيف موضوع الشكوى أو الملاحظة',
    complaintMessageLabel: 'نص الشكوى أو الملاحظة والمقترح بالتفصيل (المربع الكبير)',
    complaintPlaceholder: 'يرجى تدوين كافة تفاصيل الشكوى أو الملاحظة أو المقترح هنا بوضوح تام، مع ذكر أرقام المعاملات إن وجدت لمساعدتنا في المعالجة الفورية...',
    priorityLabel: 'درجة الأهمية والأولوية',
    priorityNormal: 'أولوية عادية',
    priorityUrgent: 'أولوية قصوى ومستعجلة',
    btnSubmitComplaint: 'إرسال الشكوى والملاحظة للإدارة',
    complaintSuccessTitle: 'تم استلام الشكوى أو الملاحظة بنجاح!',
    complaintSuccessDesc: 'تم تسجيل الشكوى برقم مرجعي رسمي في سجلات الإدارة وسيتم الرد والتدقيق خلال 24 ساعة.',

    // Loans Screen
    loansTitle: 'بوابة طلب القروض والتسهيلات التمويلية',
    loansSubtitle: 'حلول تمويلية مصرفية ميسرة للمشاريع والأنشطة والاحتياجات الشخصية بضمانات معتمدة وأقساط سداد مريحة.',
    loanCalculatorTitle: 'حاسبة القرض وجدول السداد الشهري التقديري',
    loanAmountLabel: 'قيمة مبلغ القرض المطلوب',
    loanDurationLabel: 'مدة سداد القرض (بالأشهر)',
    loanReasonLabel: 'السبب والغاية من طلب القرض',
    monthlyIncomeLabel: 'متوسط الدخل الشهري الصافي للمقترض',
    guarantorLabel: 'معلومات الضمانة أو الكفيل المعتمد',
    estimatedInstallmentLabel: 'قيمة القسط الشهري التقديري',
    monthsSuffix: 'شهر',
    currencySyp: 'ليرة سورية',
    btnSubmitLoan: 'تقديم طلب القرض المالي للتدقيق',
    loanSuccessTitle: 'تم تقديم طلب القرض بنجاح!',
    loanSuccessDesc: 'تم تسجيل طلب القرض وتفاصيل التمويل في سجلات الإدارة المالية، وسيتواصل معكم المستشار المختص لإتمام التوقيع والتحقق.',

    // Admin Additional Tabs
    adminTabCreds: 'بيانات اعتماد الإدارة العامة',
    adminTabAccounts: 'خزنة الحسابات وكلمات المرور',
    adminTabLoans: 'طلبات القروض والتسهيلات المالية',
    adminTabJobs: 'طلبات التوظيف وفرص العمل',
    adminTabComplaints: 'صندوق الشكاوى والملاحظات والمقترحات',
    adminTabLogs: 'سجل تدقيق النشاطات (من تسجيل الدخول حتى الخروج)',

    governorates: {
      'دمشق': 'دمشق',
      'ريف دمشق': 'ريف دمشق',
      'حلب': 'حلب',
      'حمص': 'حمص',
      'حماة': 'حماة',
      'اللاذقية': 'اللاذقية',
      'طرطوس': 'طرطوس',
      'إدلب': 'إدلب',
      'درعا': 'درعا',
      'السويداء': 'السويداء',
      'القنيطرة': 'القنيطرة',
      'دير الزور': 'دير الزور',
      'الحسكة': 'الحسكة',
      'الرقة': 'الرقة',
    },
  },
  en: {
    syrianRepublic: 'Syrian Arab Republic',
    savedAccounts: 'Accounts Log',
    accountsCountSuffix: 'accounts',
    poweredBy: 'POWERED BY',
    version: 'V 2.2.6 • Sham Cash Syria',
    back: 'Back',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    continue: 'Continue',
    copied: 'Copied',
    copy: 'Copy',
    delete: 'Delete',
    details: 'Details',
    track: 'Track',
    languageName: 'العربية',
    toggleLanguage: 'Switch to Arabic',
    shareApp: 'Share Link',
    shareAppSuccess: 'Link copied successfully!',

    // HomeScreen
    portalBadge: 'Official Verified Portal • shamchas',
    homeTitle: 'Sham Cash Account Verification Portal',
    homeSubtitle: 'Verify your account digitally in easy steps within 5 minutes, securely upload your documents, and track your request status directly without visiting any branch in Syria.',
    btnVerify: 'Submit Account Verification Request',
    btnSwap: 'Request Currency Exchange Feature',
    btnCalculator: 'Syrian Exchange Rates & Currency Calculator',
    badgeLive: 'Live',
    btnSavedAccounts: 'Saved Accounts & Records Log',
    statSuccess: '+1,248',
    statSpeed: '24-48h',
    statUptime: '99.9%',
    statSuccessLabel: 'Processed Requests',
    statSpeedLabel: 'Processing Speed',
    statUptimeLabel: 'Platform Uptime',
    securitySectionTitle: 'SECURITY HIGHLIGHTS',
    privacyTitle: 'Full Privacy',
    privacyDesc: 'Your documents are encrypted during transmission and storage, strictly accessible by the specialized verification team in Syria.',
    bankingTitle: 'Banking Security',
    bankingDesc: 'Infrastructure built to financial security standards with complete audit tracking and instant notifications for every review.',
    fastProcessingTitle: 'Fast Processing',
    fastProcessingDesc: 'Most requests are processed within 24 to 48 business hours with instant real-time SMS updates to your mobile phone.',
    swapSectionTitle: 'Currency Exchange System (Sham Cash Swap)',
    tryCalculator: 'Try Calculator',
    swapDesc: 'Enable currency exchange on your shamchas account to convert balance between currencies (SYP, USD, EUR, USDT) with full transparency.',
    swapFeature1: 'Instant in-account currency balance conversion with zero delay.',
    swapFeature2: 'Transparent display of exchange rates, fees, and final SYP output before order confirmation.',
    swapFeature3: 'Immediate account credit upon automated approval and matching.',
    swapFeature4: 'Customizable default display currency for your balance (USD / SYP / USDT).',
    swapFeature5: 'Dedicated transaction ledger and statement generated for every currency exchange.',
    readyTitle: 'Ready to verify your account?',
    readyDesc: 'Have your official Syrian ID card ready with a clear photo; the entire process takes less than five minutes.',
    btnStartNow: 'Start Verification Now',

    // ContactInfoScreen
    contactTitle: 'Contact Information',
    contactSubtitle: 'Please enter your full name and Syrian mobile number so we can reach you and notify you as soon as verification completes.',
    fullNameLabel: 'Full Triple Name (as shown on ID card)',
    fullNamePlaceholder: 'e.g. Mohammad Ahmad Al-Khaled',
    phoneLabel: 'Syrian Mobile Phone Number',
    phonePlaceholder: '09xx xxx xxx or 9xx xxx xxx',
    phoneHelp: 'Accepts Syrian mobile numbers (MTN or Syriatel).',
    governorateLabel: 'Governorate',
    governorateSelect: 'Select Governorate',
    contactNote: 'Your phone number is used to notify you of your verification outcome via SMS.',
    btnContinueAccount: 'Continue to Account Details',
    errFullNameRequired: 'Please enter your full name',
    errFullNameMin: 'Name is too short, please enter your full triple name',
    errPhoneRequired: 'Please enter your mobile phone number',
    errPhoneInvalid: 'Please enter a valid Syrian mobile number starting with 09 or 9',

    // AuthScreen
    authTitle: 'Sign In to Your Account',
    authSubtitle: 'Enter your registered Sham Cash email address to continue',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    passwordHelp: 'The password associated with your Sham Cash account.',
    securityNotice: 'Security Notice',
    securityNoticeDesc: 'Your data is processed over an encrypted connection adhering to banking security standards.',
    btnSignInContinue: 'Sign In & Continue',
    errEmailRequired: 'Please enter your email address',
    errEmailInvalid: 'Please enter a valid email address',
    errPasswordRequired: 'Please enter your password',
    errPasswordMin: 'Password must be at least 6 characters',

    // VerifyScreen
    verifyTitle: 'Official Syrian Identity Verification',
    verifySubtitle: 'Fast, secure digital steps to upload your documents and verify your identity',
    stepData: 'Personal Info',
    stepDocs: 'Upload Documents',
    stepReview: 'Review & Confirm',
    birthDateLabel: 'Date of Birth',
    genderLabel: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    btnNextToDocs: 'Proceed to Document Upload',
    docsTitle: 'Required Official Documents',
    docsSubtitle: 'Please upload clear, colored photos of your Syrian ID card and proof of residence',
    docIdFront: 'Syrian ID Card (Front Side)',
    docIdBack: 'Syrian ID Card (Back Side)',
    docSelfie: 'Personal Selfie (Holding ID Card)',
    docResidence: 'Proof of Residence (Document / Utility Bill)',
    docRequired: 'Required',
    docOptional: 'Optional',
    uploadDragDrop: 'Drag and drop file here or',
    uploadBrowse: 'Browse files',
    uploadedSuccess: 'Document uploaded successfully',
    btnBack: 'Previous',
    btnNextToReview: 'Proceed to Final Review',
    reviewTitle: 'Review & Verify Information',
    reviewSubtitle: 'Please verify the accuracy of all submitted details before final submission',
    reviewConfirmText: 'I hereby confirm that all submitted details and documents are authentic and compliant with Syrian official standards.',
    btnSubmitVerification: 'Submit Verification for Review',
    submittingText: 'Encrypting documents and submitting data...',

    // WaitingScreen
    waitingTitle: 'Your Request is Under Review',
    waitingTitleUnderReview: 'Your Request is Under Review',
    waitingDescUnderReview: 'Our specialized verification team is currently matching your submitted details and documents with verified registries. Please keep this window open.',
    waitingTitleVerified: 'Congratulations! Verification Approved',
    waitingDescVerified: 'All your documents have been officially authenticated and accepted. Your Sham Cash account is now fully verified.',
    waitingTitleNeedsInfo: 'Additional Information or Documents Required',
    waitingDescNeedsInfo: 'Please review the note below and upload a clearer image of your Syrian ID card to proceed with the verification process.',
    waitingTitleRejected: 'Unable to Accept Verification Request',
    waitingDescRejected: 'We were unable to approve the application due to document criteria non-compliance with the Syrian financial regulatory standards.',
    reviewNumber: 'Review ID',
    instruction1: 'Please remain on this page and do not close your browser to maintain session integrity.',
    instruction2: 'Do not manually reload the page or click the browser back button.',
    instruction3: 'Status updates automatically as soon as the verification team reviews your submission.',
    instruction4: 'To check immediately, you may click the refresh button below.',
    btnRefreshStatus: 'Check Request Status Now',
    btnReturnHome: 'Return to Home Page',
    btnViewSavedAccounts: 'View Account in Saved Records',
    requestIdLabel: 'Request Reference ID',
    elapsedTimeLabel: 'Elapsed Time',
    statusUnderReview: 'Under Review',
    statusVerified: 'Verified & Approved',
    statusNeedsInfo: 'Additional Information Required',
    statusRejected: 'Request Rejected',
    statusUnderReviewDesc: 'Our specialized verification team is currently matching your submitted documents with official registries.',
    statusVerifiedDesc: 'Congratulations! Your account has been officially verified and upgraded.',
    statusNeedsInfoDesc: 'Please re-upload a clearer image of your Syrian ID due to obscured digits.',
    statusRejectedDesc: 'Request could not be approved due to document incompatibility with banking criteria.',
    instr1: 'Please stay on this page and do not close your browser to maintain session integrity.',
    instr2: 'Do not manually reload the page or click the browser back button.',
    instr3: 'Status updates automatically as soon as the verification team reviews your submission.',
    instr4: 'To check immediately, you may click the refresh button below.',
    btnCheckStatus: 'Check Request Status Now',
    checkingStatus: 'Checking server status…',
    btnBackHome: 'Return to Home Page',
    btnViewInSaved: 'View Account in Saved Records',
    demoStatusSwitcher: 'Simulate Status Change (Demo & Review):',

    // Currency Calculator Modal
    calcTitle: 'Syrian Exchange Rates & Currency Calculator',
    calcSubtitle: 'Live official indicative rates updated continuously',
    sendAmount: 'Amount to Exchange',
    receiveAmount: 'Estimated Amount Received',
    rateInfo: 'Indicative Exchange Rate',
    feeInfo: 'Processing Fee (0.5%)',
    btnRequestFeature: 'Request Feature in My Account',
    swapModalTitle: 'Sham Cash Currency Swap Calculator (shamchas)',
    swapModalSubtitle: 'Live market indicative rates and Syrian Pound wallet exchange',
    cityRateLabel: 'Exchange rate in:',
    buyRate: 'Current Buy Rate',
    sellRate: 'Current Sell Rate',
    amountToConvert: 'Amount to Convert',
    estimatedResult: 'Estimated Swap Output',
    noFeeNote: '0% fee on internal wallet conversions',
    btnSimulateSwap: 'Simulate Swap Execution',
    btnRequestSwapAccount: 'Request Service Activation in My Account',

    // Saved Accounts Screen
    savedScreenTitle: 'Saved Accounts & Requests Log',
    savedScreenSubtitle: 'Local persistent database for all submitted accounts, verifications, and swap requests',
    savedAccountsTitle: 'Saved Accounts & Requests Log',
    savedAccountsSubtitle: 'Local persistent database for all submitted accounts, verifications, and swap requests',
    btnNewAccount: 'New Request',
    btnExportCsv: 'Export CSV',
    btnExportJson: 'Backup JSON',
    exportCsv: 'Export CSV',
    exportJson: 'Backup JSON',
    statTotalAccounts: 'Total Accounts',
    statVerifiedAccounts: 'Verified',
    statUnderReviewAccounts: 'Under Review',
    statNeedsInfoAccounts: 'Needs Info',
    statVerified: 'Verified',
    statUnderReview: 'Under Review',
    statNeedsInfo: 'Needs Info',
    searchPlaceholder: 'Search by name, email, phone, governorate or ID...',
    filterAllStatuses: 'All Statuses',
    filterAllRequests: 'All Requests',
    filterStatusAll: 'All Statuses',
    filterStatusUnderReview: 'Under Review',
    filterStatusVerified: 'Verified & Approved',
    filterStatusNeedsInfo: 'Needs Info',
    filterStatusRejected: 'Rejected',
    filterTypeAll: 'All Requests',
    filterTypeVerify: 'Account Verification',
    filterTypeSwap: 'Currency Exchange',
    noAccountsFound: 'No accounts found',
    noAccountsDesc: 'Try adjusting your search criteria or resetting filters',
    noAccountsHint: 'Try adjusting your search criteria or resetting filters',
    auditNote: 'Audit Note',
    accountDetailsTitle: 'Registered Account Details',
    applicantFullName: 'Full Name',
    applicantGovernorate: 'Governorate',
    applicantEmail: 'Email Address',
    applicantPhone: 'Syrian Mobile Phone',
    applicantRequestType: 'Request Type',
    applicantSubmittedAt: 'Submitted At',
    currentStatusLabel: 'Current Request Status:',
    attachedDocuments: 'Attached Documents:',
    reviewerNotes: 'Reviewer Notes:',
    noNotes: 'No notes recorded yet.',
    editNote: 'Edit Note',
    saveNote: 'Save Note',
    deleteRecord: 'Delete Record',
    closeModal: 'Close',
    deleteConfirm: 'Are you sure you want to permanently delete this account record?',

    // Admin Portal & Credentials Management
    adminPortal: 'Admin Portal',
    adminPortalTitle: 'Admin Central Portal & Credentials Vault',
    adminPortalSubtitle: 'Dedicated administration area to store and manage admin email, master password, and customer account credentials',
    adminBadge: 'Dedicated Admin Area • Encrypted',
    adminCredentialsSection: 'Administration Master Credentials',
    adminCredentialsDesc: 'Store, update, and manage official administrator email and master password.',
    adminEmailLabel: 'Official Admin Email',
    adminPasswordLabel: 'Admin Master Password',
    adminRoleLabel: 'Administrative Role & Clearance',
    adminLastUpdatedLabel: 'Credentials Last Updated',
    adminNotesLabel: 'Admin Security Directives & Notes',
    btnSaveAdminCreds: 'Save Admin Credentials',
    adminCredsSavedSuccess: 'Admin email and master password saved successfully in administration records!',
    btnResetAdminDefault: 'Reset to Default Values',
    userVaultSection: 'Customer Credentials & Passwords Vault',
    userVaultDesc: 'Comprehensive registry of all submitted user accounts including saved email and password credentials.',
    thApplicant: 'Applicant / Account',
    thEmail: 'Customer Email',
    thPassword: 'Saved Password',
    thType: 'Service Type',
    thStatus: 'Review Status',
    thActions: 'Actions',
    showPassword: 'Show Password',
    hidePassword: 'Hide Password',
    copyPassword: 'Copy Password',
    copyEmail: 'Copy Email',
    passwordCopied: 'Password copied!',
    emailCopied: 'Email copied!',
    exportAdminCsv: 'Export Credentials & Passwords (CSV)',
    exportAdminJson: 'Export Complete Admin Report (JSON)',
    adminLockTitle: 'Security Verification for Admin Access',
    adminLockDesc: 'This area is restricted to portal administrators. Please enter the admin master password to access the credentials vault.',
    adminPassPrompt: 'Admin Master Password',
    btnUnlockAdmin: 'Unlock Admin Portal',
    lockAdminPanel: 'Lock Admin Panel',
    errInvalidAdminPass: 'Invalid admin password. Please try again.',
    adminDefaultHint: 'Master Admin Passkey: ShamAdmin@2026',
    statCapturedPasswords: 'Saved Password Accounts',
    btnGoToAdmin: 'Admin Portal & Credentials Vault',
    adminMasterSettings: 'Admin Account Settings',
    adminSecurityNotice: 'Security Notice: Passwords and sensitive credentials are encrypted and stored locally in compliance with Sham Cash standards.',
    adminAccessUnlocked: 'Administrative access verified successfully',
    adminDedicatedAreaBadge: 'Dedicated Admin Place',

    // New Navigation
    navJobs: 'Jobs & Careers',
    navComplaints: 'Complaints & Feedback',
    navLoans: 'Apply for Loan',
    navHome: 'Home',
    navLogin: 'Sign In',
    navLogout: 'Sign Out',
    navDownload: 'Download App Here',
    activeUserSession: 'Active User Session',
    logoutConfirm: 'Do you want to sign out from the current session?',

    // Jobs Screen
    jobsTitle: 'Careers & Job Opportunities',
    jobsSubtitle: 'Join the leading Sham Cash team in Syria. Browse openings and apply directly',
    openVacanciesTitle: 'Currently Open Positions',
    jobApplyTitle: 'Job Application Form',
    jobTypeLabel: 'Position / Job Title',
    experienceYearsLabel: 'Years of Experience',
    experienceDetailsLabel: 'Experience Details & Past Roles',
    educationLabel: 'Education & Degree',
    btnSubmitJobApp: 'Submit Job Application',
    jobSuccessTitle: 'Job Application Submitted Successfully!',
    jobSuccessDesc: 'Your application has been received and our HR team will review your qualifications and contact you soon.',

    // Complaints & Feedback Screen
    complaintsTitle: 'Complaints & Feedback Box',
    complaintsSubtitle: 'Your voice matters. Send your inquiries, complaints, or improvement suggestions directly to management',
    complaintCategoryLabel: 'Category',
    complaintMessageLabel: 'Detailed Complaint / Feedback (Large Text Box)',
    complaintPlaceholder: 'Please type the full details of your complaint, feedback, or suggestion here clearly. Include any reference numbers if applicable to help us resolve it quickly...',
    priorityLabel: 'Priority Level',
    priorityNormal: 'Normal',
    priorityUrgent: 'Urgent & Critical',
    btnSubmitComplaint: 'Submit Complaint / Feedback',
    complaintSuccessTitle: 'Complaint / Feedback Received Successfully!',
    complaintSuccessDesc: 'Your submission has been logged with an official reference ID and management will review it within 24 hours.',

    // Loans Screen
    loansTitle: 'Loan Application & Financial Facilities',
    loansSubtitle: 'Fast and flexible financing for personal and business needs with easy installment plans',
    loanCalculatorTitle: 'Loan Calculator & Repayment Schedule',
    loanAmountLabel: 'Requested Loan Amount',
    loanDurationLabel: 'Repayment Duration (Months)',
    loanReasonLabel: 'Loan Purpose & Reason',
    monthlyIncomeLabel: 'Approximate Monthly Income',
    guarantorLabel: 'Guarantor or Collateral Information',
    estimatedInstallmentLabel: 'Estimated Monthly Installment',
    monthsSuffix: 'Months',
    currencySyp: 'SYP',
    btnSubmitLoan: 'Submit Loan Application',
    loanSuccessTitle: 'Loan Application Submitted Successfully!',
    loanSuccessDesc: 'Your loan request has been recorded in our financial management records. A loan officer will contact you shortly.',

    // Admin Additional Tabs
    adminTabCreds: 'Admin Credentials',
    adminTabAccounts: 'Accounts & Passwords',
    adminTabLoans: 'Loan Applications',
    adminTabJobs: 'Job Applications',
    adminTabComplaints: 'Complaints & Feedback',
    adminTabLogs: 'System Activity Logs',

    governorates: {
      'دمشق': 'Damascus',
      'ريف دمشق': 'Rif Dimashq',
      'حلب': 'Aleppo',
      'حمص': 'Homs',
      'حماة': 'Hama',
      'اللاذقية': 'Latakia',
      'طرطوس': 'Tartus',
      'إدلب': 'Idlib',
      'درعا': 'Daraa',
      'السويداء': 'As-Suwayda',
      'القنيطرة': 'Quneitra',
      'دير الزور': 'Deir ez-Zor',
      'الحسكة': 'Al-Hasakah',
      'الرقة': 'Raqqa',
    },
  },
};
