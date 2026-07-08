const fs = require("fs");

// خواندن فایل JSON
function readJSON(path) {
  try {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, "{}");
    }

    const data = fs.readFileSync(path, "utf8");

    if (!data.trim()) return {};

    return JSON.parse(data);

  } catch (err) {
    console.error("JSON Read Error:", err.message);
    return {};
  }
}

// ذخیره فایل JSON
function writeJSON(path, data) {
  try {
    fs.writeFileSync(
      path,
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("JSON Write Error:", err.message);
  }
}

// زمان فعلی
function now() {
  return new Date().toLocaleString("fa-IR");
}

// اعتبارسنجی شماره موبایل
function isPhone(phone) {
  return /^09\d{9}$/.test(phone);
}

// تولید شناسه تصادفی
function randomId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

// تاخیر
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  readJSON,
  writeJSON,
  now,
  isPhone,
  randomId,
  sleep
};