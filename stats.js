const path = require("path");
const { readJSON, writeJSON } = require("./utils");

const STATS_FILE = path.join(__dirname, "database", "stats.json");

function loadStats() {
    return readJSON(STATS_FILE);
}

function saveStats(stats) {
    writeJSON(STATS_FILE, stats);
}

function initStats() {
    const stats = loadStats();

    if (!stats.totalUsers) stats.totalUsers = 0;
    if (!stats.totalMessages) stats.totalMessages = 0;
    if (!stats.totalRegistrations) stats.totalRegistrations = 0;
    if (!stats.startTime) stats.startTime = new Date().toISOString();

    saveStats(stats);
}

function increaseUsers() {
    const stats = loadStats();
    stats.totalUsers++;
    saveStats(stats);
}

function increaseMessages() {
    const stats = loadStats();
    stats.totalMessages++;
    saveStats(stats);
}

function increaseRegistrations() {
    const stats = loadStats();
    stats.totalRegistrations++;
    saveStats(stats);
}

function getStats() {
    return loadStats();
}

module.exports = {
    initStats,
    increaseUsers,
    increaseMessages,
    increaseRegistrations,
    getStats
};