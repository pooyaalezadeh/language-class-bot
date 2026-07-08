const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "database", "logs.json");

// ایجاد فایل در صورت نبود
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, "[]");
}

// خواندن لاگ‌ها
function readLogs() {
    try {
        return JSON.parse(fs.readFileSync(LOG_FILE, "utf8"));
    } catch {
        return [];
    }
}

// ذخیره لاگ
function saveLogs(logs) {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

// ثبت لاگ جدید
function log(type, userId, text) {

    const logs = readLogs();

    logs.unshift({

        id: Date.now(),

        type,

        userId,

        text,

        date: new Date().toLocaleString("fa-IR")

    });

    // فقط ۵۰۰۰ لاگ آخر نگه داشته شود
    if (logs.length > 5000)
        logs.pop();

    saveLogs(logs);

}

// دریافت همه لاگ‌ها
function getLogs() {
    return readLogs();
}

// حذف لاگ‌ها
function clearLogs() {
    saveLogs([]);
}

module.exports = {

    log,

    getLogs,

    clearLogs

};