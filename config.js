require("dotenv").config();

module.exports = {
  // اطلاعات ربات
  BOT: {
    TOKEN: process.env.BOT_TOKEN,
    API: `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}`,
    NAME: "ربات آموزشگاه زبان",
    VERSION: "3.0.0 PRO"
  },

  // ادمین
  ADMIN: {
    ID: process.env.ADMIN_ID
  },

  // تنظیمات ثبت‌نام
  REGISTER: {
    MIN_NAME: 3,
    MAX_NAME: 40,

    PHONE_REGEX: /^09\d{9}$/,

    LEVELS: [
      "مبتدی",
      "متوسط",
      "پیشرفته",
      "IELTS",
      "خصوصی",
      "خصوصی جبرانی"
    ]
  },

  // ضد اسپم
  ANTISPAM: {
    ENABLED: true,
    DELAY: 800
  },

  // فایل‌ها
  FILES: {
    USERS: "./database/users.json",
    STATE: "./database/state.json",
    LOGS: "./database/logs.json",
    STATS: "./database/stats.json"
  },

  // تنظیمات ربات
  SETTINGS: {
    SAVE_LOGS: true,
    SAVE_STATS: true,
    AUTO_BACKUP: true,
    WELCOME: true
  }
};