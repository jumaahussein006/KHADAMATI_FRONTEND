const fs = require('fs');
const path = require('path');

const localesDir = './src/i18n/locales';

const enPath = path.join(localesDir, 'en.json');
const arPath = path.join(localesDir, 'ar.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8').replace(/^\uFEFF/, ''));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8').replace(/^\uFEFF/, ''));

const missingKeysData = {
    "common": {
        "allUsers": { en: "All Users", ar: "جميع المستخدمين" },
        "certificateDeleted": { en: "Certificate deleted successfully", ar: "تم حذف الشهادة بنجاح" },
        "confirmDeleteCertificate": { en: "Are you sure you want to delete this certificate?", ar: "هل أنت متأكد أنك تريد حذف هذه الشهادة؟" },
        "issueDate": { en: "Issue Date", ar: "تاريخ الإصدار" },
        "justNow": { en: "Just now", ar: "الآن" },
        "message": { en: "Message", ar: "الرسالة" },
        "noCertificates": { en: "No certificates found", ar: "لم يتم العثور على شهادات" },
        "noReviews": { en: "No reviews yet", ar: "لا توجد تقييمات بعد" },
        "notificationSentToAll": { en: "Notification sent to all users", ar: "تم إرسال الإشعار لجميع المستخدمين" },
        "recipient": { en: "Recipient", ar: "المستلم" },
        "selectLocation": { en: "Select Location", ar: "اختر الموقع" },
        "sendNotification": { en: "Send Notification", ar: "إرسال إشعار" },
        "success": { en: "Success", ar: "نجاح" },
        "title": { en: "Title", ar: "العنوان" },
        "unknownUser": { en: "Unknown User", ar: "مستخدم غير معروف" },
        "noDetails": { en: "No details provided", ar: "لا توجد تفاصيل مقدمة" },
        "goHome": { en: "Back to Home", ar: "العودة للصفحة الرئيسية" }
    },
    "dashboard": {
        "welcome": { en: "Welcome back, {{name}}!", ar: "مرحباً بعودتك، {{name}}!" }
    },
    "notification": {
        "welcomeTitle": { en: "Welcome to Khadamati!", ar: "مرحباً بك في خدماتي!" },
        "welcomeMessage": { en: "We are glad to have you here. Start exploring services now.", ar: "يسعدنا انضمامك إلينا. ابدأ باستكشاف الخدمات الآن." },
        "newRequest": { en: "New Service Request!", ar: "طلب خدمة جديد!" },
        "requestDesc": { en: "A new customer has requested your service.", ar: "قام عميل جديد بطلب خدمتك." },
        "stayUpdated": { en: "Stay updated with our latest news.", ar: "ابقَ على اطلاع بأحدث أخبارنا." }
    },
    "customer": {
        "profile": {
            "title": { en: "My Profile", ar: "ملفي الشخصي" },
            "personalInfo": { en: "Personal Information", ar: "المعلومات الشخصية" },
            "address": { en: "Address", ar: "العنوان" },
            "changePassword": { en: "Change Password", ar: "تغيير كلمة المرور" },
            "currentPassword": { en: "Current Password", ar: "كلمة المرور الحالية" },
            "newPassword": { en: "New Password", ar: "كلمة المرور الجديدة" }
        }
    },
    "search": {
        "servicePlaceholder": { en: "Search for a service...", ar: "ابحث عن خدمة..." }
    },
    "success": {
        "passwordChanged": { en: "Password changed successfully", ar: "تم تغيير كلمة المرور بنجاح" },
        "statusUpdated": { en: "Status updated successfully", ar: "تم تحديث الحالة بنجاح" }
    },
    "errors": {
        "emailAlreadyRegistered": { en: "Email already registered", ar: "البريد الإلكتروني مسجل بالفعل" },
        "pageNotFound": { en: "Page Not Found", ar: "الصفحة غير موجودة" },
        "pageNotFoundDesc": { en: "Sorry, the page you are looking for does not exist.", ar: "عذرًا، الصفحة التي تبحث عنها غير موجودة." }
    },
    "request": {
        "requestDate": { en: "Request Date", ar: "تاريخ الطلب" },
        "waitingApproval": { en: "Waiting for Approval", ar: "في انتظار الموافقة" }
    }
};

function deepMerge(target, source, lang) {
    for (const key in source) {
        if (source[key][lang] !== undefined) {
            target[key] = source[key][lang];
        } else {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key], lang);
        }
    }
}

deepMerge(en, missingKeysData, 'en');
deepMerge(ar, missingKeysData, 'ar');

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));

console.log('Successfully updated en.json and ar.json');
