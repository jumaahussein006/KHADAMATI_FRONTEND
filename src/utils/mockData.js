// Mock Data Storage and API utilities

// Initialize mock data in localStorage
export const initializeMockData = () => {
  const categories = [
    { category_id: 1, name_ar: 'سباكة', name_en: 'Plumbing', description_ar: 'خدمات السباكة والصيانة', description_en: 'Plumbing and maintenance services' },
    { category_id: 2, name_ar: 'كهرباء', name_en: 'Electricity', description_ar: 'خدمات الكهرباء والتركيبات', description_en: 'Electrical services and installations' },
    { category_id: 3, name_ar: 'نجارة', name_en: 'Carpentry', description_ar: 'خدمات النجارة والأثاث', description_en: 'Carpentry and furniture services' },
    { category_id: 4, name_ar: 'دهان', name_en: 'Painting', description_ar: 'خدمات الدهان والديكور', description_en: 'Painting and decoration services' },
    { category_id: 5, name_ar: 'نظافة', name_en: 'Cleaning', description_ar: 'خدمات التنظيف والصيانة', description_en: 'Cleaning and maintenance services' },
    { category_id: 6, name_ar: 'بستنة', name_en: 'Gardening', description_ar: 'خدمات البستنة والحدائق', description_en: 'Gardening and landscaping services' },
    { category_id: 7, name_ar: 'تكييف', name_en: 'Air Conditioning', description_ar: 'تركيب وصيانة أجهزة التكييف', description_en: 'AC installation and maintenance' },
    { category_id: 8, name_ar: 'نقل', name_en: 'Moving', description_ar: 'خدمات النقل والتغليف', description_en: 'Moving and packaging services' }
  ];
  // Always update categories to ensure bilingual support
  localStorage.setItem('khadamati_categories', JSON.stringify(categories));

  if (!localStorage.getItem('khadamati_initialized_v6')) {
    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();


    // Users
    const users = [
      {
        user_id: 1,
        first_name: 'Admin',
        middle_name: '',
        last_name: 'User',
        email: 'admin@khadamati.com',
        password: 'admin123',
        role: 'admin',
        phone: '12345678'
      },
      {
        user_id: 2,
        first_name: 'Sami',
        middle_name: 'Ahmed',
        last_name: 'Plumber',
        email: 'provider1@khadamati.com',
        password: 'password123',
        role: 'provider',
        phone: '70123456'
      },
      {
        user_id: 3,
        first_name: 'Fadi',
        middle_name: '',
        last_name: 'Electrician',
        email: 'provider2@khadamati.com',
        password: 'password123',
        role: 'provider',
        phone: '71654321'
      },
      {
        user_id: 4,
        first_name: 'Rami',
        middle_name: '',
        last_name: 'Customer',
        email: 'customer@khadamati.com',
        password: 'password123',
        role: 'customer',
        phone: '03987654'
      }
    ];
    localStorage.setItem('khadamati_users', JSON.stringify(users));

    // Services
    const services = [
      {
        service_id: 1,
        name_ar: 'إصلاح تسرب المياه',
        name_en: 'Water Leak Repair',
        description_ar: 'إصلاح جميع أنواع تسربات المياه في المطابخ والحمامات باستخدام أحدث الأجهزة.',
        description_en: 'Repair all types of water leaks in kitchens and bathrooms using the latest leak detection devices.',
        provider_id: 2,
        category_id: 1,
        create_at: daysAgo(45)
      },
      {
        service_id: 2,
        name_ar: 'تركيب مكيفات',
        name_en: 'AC Installation',
        description_ar: 'تركيب وصيانة شاملة لجميع أنواع أجهزة التكييف المنزلية والمكتبية مع كفالة.',
        description_en: 'Complete installation and maintenance for all types of home and office air conditioning units with warranty.',
        provider_id: 3,
        category_id: 7,
        create_at: daysAgo(30)
      },
      {
        service_id: 3,
        name_ar: 'تركيب إضاءة',
        name_en: 'Light Installation',
        description_ar: 'تركيب الثريات والإضاءة المخفية وصيانة اللوحات الكهربائية باحترافية تامة.',
        description_en: 'Professional installation of chandeliers, hidden lighting, and maintenance of electrical panels.',
        provider_id: 3,
        category_id: 2,
        create_at: daysAgo(25)
      },
      {
        service_id: 4,
        name_ar: 'صنع أثاث مخصص',
        name_en: 'Custom Furniture',
        description_ar: 'تصميم وتصنيع غرف النوم وخزائن الملابس حسب المساحة وبأجود أنواع الخشب.',
        description_en: 'Design and manufacture of bedrooms and closets tailored to your space using the finest types of wood.',
        provider_id: 2,
        category_id: 3,
        create_at: daysAgo(20)
      },
      {
        service_id: 5,
        name_ar: 'دهان شقق',
        name_en: 'Apartment Painting',
        description_ar: 'خدمات دهان داخلي وخارجي وديكورات جبس بورد بلمسة فنية عصرية.',
        description_en: 'Interior and exterior painting services and gypsum board decorations with a modern artistic touch.',
        provider_id: 2,
        category_id: 4,
        create_at: daysAgo(15)
      },
      {
        service_id: 6,
        name_ar: 'تنظيف منازل',
        name_en: 'House Cleaning',
        description_ar: 'خدمات تنظيف شاملة للمنازل والفلل والمكاتب مع التعقيم والتلميع.',
        description_en: 'Comprehensive cleaning services for houses, villas, and offices including sterilization and polishing.',
        provider_id: 3,
        category_id: 5,
        create_at: daysAgo(10)
      },
      {
        service_id: 7,
        name_ar: 'تصميم حدائق',
        name_en: 'Garden Design',
        description_ar: 'تصميم وتنسيق الحدائق المنزلية وتركيب العشب الصناعي وأنظمة الري.',
        description_en: 'Design and landscaping of home gardens, installation of artificial grass, and irrigation systems.',
        provider_id: 2,
        category_id: 6,
        create_at: daysAgo(8)
      },
      {
        service_id: 8,
        name_ar: 'نقل عفش',
        name_en: 'Furniture Moving',
        description_ar: 'فك وتركيب ونقل الأثاث بأمان تام مع التغليف الحراري والكرتون.',
        description_en: 'Dismantling, installation, and moving of furniture with complete safety using thermal wrapping and boxes.',
        provider_id: 3,
        category_id: 8,
        create_at: daysAgo(5)
      },
      {
        service_id: 9,
        name_ar: 'صيانة سباكة',
        name_en: 'Plumbing Maintenance',
        description_ar: 'صيانة دورية لشبكات المياه والصرف الصحي وتركيب الخزانات والمضخات.',
        description_en: 'Routine maintenance of water and sewage networks and installation of tanks and pumps.',
        provider_id: 2,
        category_id: 1,
        create_at: daysAgo(3)
      },
      {
        service_id: 10,
        name_ar: 'تنظيف مكيفات',
        name_en: 'AC Cleaning',
        description_ar: 'تنظيف عميق للفلاتر والوحدات الداخلية والخارجية لزيادة كفاءة التبريد.',
        description_en: 'Deep cleaning of filters and indoor/outdoor units to increase cooling efficiency.',
        provider_id: 3,
        category_id: 7,
        create_at: daysAgo(2)
      }
    ];
    localStorage.setItem('khadamati_services', JSON.stringify(services));

    // Providers
    const providers = [
      {
        provider_id: 1,
        user_id: 2,
        specialization: 'سباكة',
        approved: true
      },
      {
        provider_id: 2,
        user_id: 3,
        specialization: 'كهرباء',
        approved: true
      }
    ];
    localStorage.setItem('khadamati_providers', JSON.stringify(providers));

    // Service Requests
    const requests = [
      {
        request_id: 1,
        customer_id: 4,
        provider_id: 1,
        service_id: 1,
        status_id: 1,
        price: 150.00,
        details: 'تسرب في الحمام',
        request_date: daysAgo(2),
        scheduled_date: daysAgo(-1) // Tomorrow
      },
      {
        request_id: 2,
        customer_id: 4,
        provider_id: 2,
        service_id: 2,
        status_id: 3,
        price: 200.00,
        details: 'تركيب مكيف جديد',
        request_date: daysAgo(10),
        scheduled_date: daysAgo(8)
      },
      {
        request_id: 3,
        customer_id: 4,
        provider_id: 1,
        service_id: 1,
        status_id: 3,
        price: 100.00,
        details: 'صيانة دورية',
        request_date: daysAgo(35),
        scheduled_date: daysAgo(34)
      }
    ];
    localStorage.setItem('khadamati_requests', JSON.stringify(requests));

    // Statuses
    const statuses = [
      { status_id: 1, values: 'Pending', completed_at: null },
      { status_id: 2, values: 'In Progress', completed_at: null },
      { status_id: 3, values: 'Completed', completed_at: null },
      { status_id: 4, values: 'Cancelled', completed_at: null }
    ];
    localStorage.setItem('khadamati_statuses', JSON.stringify(statuses));

    // Payments
    const payments = [
      {
        payment_id: 1,
        request_id: 2,
        amount: 200.00,
        status: 'Completed',
        method: 'Credit Card',
        create_at: daysAgo(8),
        transaction_date: daysAgo(8),
        getaway_response: 'Success'
      },
      {
        payment_id: 2,
        request_id: 3,
        amount: 100.00,
        status: 'Completed',
        method: 'Cash',
        create_at: daysAgo(34),
        transaction_date: daysAgo(34),
        getaway_response: 'Success'
      }
    ];
    localStorage.setItem('khadamati_payments', JSON.stringify(payments));

    // Reports
    const reports = [
      {
        report_id: 1,
        report_type: 'Service',
        target_id: 1,
        target_type: 'Service',
        title: 'مشكلة في الخدمة',
        content: 'الخدمة لم تكن كما هو متوقع',
        user_id: 4,
        admin_id: null,
        create_at: daysAgo(5)
      }
    ];
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));

    // Notifications
    const notifications = [
      {
        notification_id: 1,
        user_id: 4,
        type: 'Request',
        title: 'طلب جديد',
        message: 'تم قبول طلبك بنجاح',
        is_read: false,
        sent_at: daysAgo(2)
      },
      {
        notification_id: 2,
        user_id: 2,
        type: 'Request',
        title: 'New Service Request',
        message: 'A new request for your Plumbing service has been received.',
        is_read: false,
        sent_at: daysAgo(1)
      },
      {
        notification_id: 3,
        user_id: 3,
        type: 'Admin',
        title: 'Documents Verified',
        message: 'Your professional certifications have been verified by our team.',
        is_read: true,
        sent_at: daysAgo(3)
      }
    ];
    localStorage.setItem('khadamati_notifications', JSON.stringify(notifications));

    // Certificates
    const certificates = [
      {
        certificate_id: 1,
        provider_id: 2,
        image: 'https://images.unsplash.com/photo-1589330694653-90ce5d947231?q=80&w=2070&auto=format&fit=crop',
        description: 'Professional Plumber Certificate',
        issue_date: daysAgo(60)
      }
    ];
    localStorage.setItem('khadamati_certificates', JSON.stringify(certificates));

    // Reviews
    const reviews = [
      {
        review_id: 1,
        request_id: 2,
        rating: 5,
        comment: 'خدمة ممتازة',
        create_at: daysAgo(7)
      }
    ];
    localStorage.setItem('khadamati_reviews', JSON.stringify(reviews));

    // Locations - Restricted to Baalbek-Hermel
    const locations = [
      { id: 1, name: 'Baalbek', nameAr: 'بعلبك', governorate: 'Baalbek-Hermel' },
      { id: 2, name: 'Hermel', nameAr: 'الهرمل', governorate: 'Baalbek-Hermel' },
      { id: 3, name: 'Arsal', nameAr: 'عرسال', governorate: 'Baalbek-Hermel' },
      { id: 4, name: 'Ras Baalbek', nameAr: 'رأس بعلبك', governorate: 'Baalbek-Hermel' },
      { id: 5, name: 'Brital', nameAr: 'بريتال', governorate: 'Baalbek-Hermel' },
      { id: 6, name: 'Deir El Ahmar', nameAr: 'دير الأحمر', governorate: 'Baalbek-Hermel' },
      { id: 7, name: 'Labweh', nameAr: 'اللبوة', governorate: 'Baalbek-Hermel' },
      { id: 8, name: 'Nabi Sheet', nameAr: 'نبي شيت', governorate: 'Baalbek-Hermel' },
      { id: 9, name: 'Shmestar', nameAr: 'شمسطار', governorate: 'Baalbek-Hermel' },
      { id: 10, name: 'Bednayel', nameAr: 'بدنايل', governorate: 'Baalbek-Hermel' }
    ];
    localStorage.setItem('khadamati_locations', JSON.stringify(locations));

    // Currencies - Restricted to LBP and USD
    const currencies = [
      { code: 'LBP', symbol: 'L.L.', name: 'Lebanese Pound' },
      { code: 'USD', symbol: '$', name: 'US Dollar' }
    ];
    localStorage.setItem('khadamati_currencies', JSON.stringify(currencies));

    // About Us Content
    const aboutUs = {
      vision_en: 'We aim to simplify daily home maintenance by providing a safe, modern, and efficient platform.',
      vision_ar: 'نهدف إلى تبسيط صيانة المنزل اليومية من خلال توفير منصة آمنة وحديثة وفعالة.',
      mission_en: 'Connecting customers with professional and reliable service providers.',
      mission_ar: 'ربط العملاء بمقدمي الخدمات المحترفين والموثوق بهم.',
      values_en: ['Reliability', 'Transparency', 'Satisfaction', 'Innovation'],
      values_ar: ['الموثوقية', 'الشفافية', 'الرضا', 'الابتكار']
    };
    localStorage.setItem('khadamati_about_us', JSON.stringify(aboutUs));

    // Name Change Requests
    const nameChangeRequests = [
      {
        request_id: 1,
        user_id: 4,
        old_name: 'Rami Customer',
        new_name: 'Rami Al-Khatib',
        status: 'pending',
        created_at: daysAgo(1)
      }
    ];
    localStorage.setItem('khadamati_name_change_requests', JSON.stringify(nameChangeRequests));

    localStorage.setItem('khadamati_initialized_v6', 'true');
  }
};

// API functions
export const getCategories = () => {
  return JSON.parse(localStorage.getItem('khadamati_categories') || '[]');
};

export const getServices = () => {
  return JSON.parse(localStorage.getItem('khadamati_services') || '[]');
};

export const getProviders = () => {
  return JSON.parse(localStorage.getItem('khadamati_providers') || '[]');
};

export const getUsers = () => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  return users.map(({ password, ...user }) => user);
};

export const getRequests = () => {
  return JSON.parse(localStorage.getItem('khadamati_requests') || '[]');
};

export const getPayments = () => {
  return JSON.parse(localStorage.getItem('khadamati_payments') || '[]');
};

export const getReports = () => {
  return JSON.parse(localStorage.getItem('khadamati_reports') || '[]');
};

export const getNotifications = (userId = null) => {
  const notifications = JSON.parse(localStorage.getItem('khadamati_notifications') || '[]');
  if (userId) {
    return notifications.filter(n => n.user_id === userId);
  }
  return notifications;
};

export const getCertificates = (providerId = null) => {
  const certificates = JSON.parse(localStorage.getItem('khadamati_certificates') || '[]');
  if (providerId) {
    return certificates.filter(c => c.provider_id === parseInt(providerId));
  }
  return certificates;
};

export const createCertificate = (certificate) => {
  try {
    const certificates = JSON.parse(localStorage.getItem('khadamati_certificates') || '[]');
    const newCert = {
      certificate_id: Date.now(),
      issue_date: new Date().toISOString(),
      ...certificate
    };
    certificates.push(newCert);
    localStorage.setItem('khadamati_certificates', JSON.stringify(certificates));
    return newCert;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      console.error('LocalStorage quota exceeded');
      // Return null or partial object instead of throwing to prevent app crash
      return null;
    }
    throw error;
  }
};

export const deleteCertificate = (certId) => {
  const certificates = JSON.parse(localStorage.getItem('khadamati_certificates') || '[]');
  const filtered = certificates.filter(c => c.certificate_id !== certId);
  localStorage.setItem('khadamati_certificates', JSON.stringify(filtered));
  return true;
};

export const getReviews = (requestId = null) => {
  const reviews = JSON.parse(localStorage.getItem('khadamati_reviews') || '[]');
  if (requestId) {
    return reviews.filter(r => r.request_id === requestId);
  }
  return reviews;
};

export const getLocations = () => {
  const locations = localStorage.getItem('khadamati_locations');
  return locations ? JSON.parse(locations) : [];
};

export const getCurrencies = () => {
  const currencies = localStorage.getItem('khadamati_currencies');
  return currencies ? JSON.parse(currencies) : [];
};

// Create functions
export const createCategory = (category) => {
  const categories = getCategories();
  const newCategory = {
    category_id: Date.now(),
    ...category
  };
  categories.push(newCategory);
  localStorage.setItem('khadamati_categories', JSON.stringify(categories));
  return newCategory;
};

export const createService = (service) => {
  const services = getServices();
  const newService = {
    service_id: Date.now(),
    create_at: new Date('2025-01-01').toISOString(),
    ...service
  };
  services.push(newService);
  localStorage.setItem('khadamati_services', JSON.stringify(services));
  return newService;
};

export const createRequest = (request) => {
  const requests = getRequests();
  const newRequest = {
    request_id: Date.now(),
    request_date: new Date('2025-01-01').toISOString(),
    status_id: 1, // Pending
    ...request
  };
  requests.push(newRequest);
  localStorage.setItem('khadamati_requests', JSON.stringify(requests));
  return newRequest;
};

export const createNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    notification_id: Date.now(),
    sent_at: new Date('2025-01-01').toISOString(),
    is_read: false,
    ...notification
  };
  notifications.push(newNotification);
  localStorage.setItem('khadamati_notifications', JSON.stringify(notifications));
  return newNotification;
};

// Create functions
export const createUser = (pUser) => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');

  // Check if email exists
  if (users.some(u => u.email === pUser.email)) {
    throw new Error('Email already exists');
  }

  const newUser = {
    user_id: Date.now(),
    role: 'customer', // default
    ...pUser
  };
  users.push(newUser);
  localStorage.setItem('khadamati_users', JSON.stringify(users));
  return newUser;
};

// Update functions
export const updateCategory = (categoryId, updates) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.category_id === categoryId);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem('khadamati_categories', JSON.stringify(categories));
    return categories[index];
  }
  return null;
};

export const updateService = (serviceId, updates) => {
  const services = getServices();
  const index = services.findIndex(s => s.service_id === serviceId);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    localStorage.setItem('khadamati_services', JSON.stringify(services));
    return services[index];
  }
  return null;
};

export const updateRequest = (requestId, updates) => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.request_id === requestId);
  if (index !== -1) {
    requests[index] = { ...requests[index], ...updates };
    localStorage.setItem('khadamati_requests', JSON.stringify(requests));
    return requests[index];
  }
  return null;
};

export const updateUser = (userId, updates) => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  const index = users.findIndex(u => u.user_id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('khadamati_users', JSON.stringify(users));
    return users[index];
  }
  return null;
};

// Delete functions
export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  const filtered = categories.filter(c => c.category_id !== categoryId);
  localStorage.setItem('khadamati_categories', JSON.stringify(filtered));
  return true;
};

export const deleteService = (serviceId) => {
  const services = getServices();
  const filtered = services.filter(s => s.service_id !== serviceId);
  localStorage.setItem('khadamati_services', JSON.stringify(filtered));
  return true;
};

export const deleteUser = (userId) => {
  const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
  const filtered = users.filter(u => u.user_id !== userId);
  localStorage.setItem('khadamati_users', JSON.stringify(filtered));
  return true;
};

export const deleteReport = (reportId) => {
  const reports = getReports();
  const filtered = reports.filter(r => r.report_id !== reportId);
  localStorage.setItem('khadamati_reports', JSON.stringify(filtered));
  return true;
};

export const updateReport = (reportId, updates) => {
  const reports = getReports();
  const index = reports.findIndex(r => r.report_id === reportId);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...updates };
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));
    return reports[index];
  }
  return null;
};

// New About Us & Name Change Helpers
export const getAboutUs = () => {
  return JSON.parse(localStorage.getItem('khadamati_about_us') || '{}');
};

export const updateAboutUs = (data) => {
  const current = getAboutUs();
  const updated = { ...current, ...data };
  localStorage.setItem('khadamati_about_us', JSON.stringify(updated));
  return updated;
};

export const getNameChangeRequests = () => {
  return JSON.parse(localStorage.getItem('khadamati_name_change_requests') || '[]');
};

export const createNameChangeRequest = (data) => {
  const requests = getNameChangeRequests();
  const newReq = {
    request_id: Date.now(),
    status: 'pending',
    created_at: new Date().toISOString(),
    ...data
  };
  requests.push(newReq);
  localStorage.setItem('khadamati_name_change_requests', JSON.stringify(requests));
  return newReq;
};

export const updateNameChangeRequest = (id, status) => {
  const requests = getNameChangeRequests();
  const index = requests.findIndex(r => r.request_id === id);
  if (index !== -1) {
    requests[index].status = status;
    localStorage.setItem('khadamati_name_change_requests', JSON.stringify(requests));
    return requests[index];
  }
  return null;
};
