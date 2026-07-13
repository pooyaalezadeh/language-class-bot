require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");

const welcomeFile = "./database/welcome.json";
const usersFile = "./database/users_list.json";

let users = [];
let welcomedUsers = [];

if (!fs.existsSync("./database")) fs.mkdirSync("./database");
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
else users = JSON.parse(fs.readFileSync(usersFile));
if (!fs.existsSync(welcomeFile)) fs.writeFileSync(welcomeFile, "[]");
else welcomedUsers = JSON.parse(fs.readFileSync(welcomeFile));

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}
function saveWelcome() {
  fs.writeFileSync(welcomeFile, JSON.stringify(welcomedUsers, null, 2));
}

const config = {
  BOT: {
    TOKEN: process.env.BOT_TOKEN,
    API: `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}`
  },
  ADMIN: { ID: "YOUR_ADMIN_CHAT_ID" }
};

const keyboard = {
  mainKeyboard: [
    ["📝 ثبت‌نام", "📚 کلاس‌ها"],
    ["📍 آدرس", "👩‍🏫 استاد"],
    ["📞 تماس", "💰 شهریه"],
    ["🇬🇧 جمله انگیزشی روز", "🎮 بازی لغات"]
  ]
};

const data = {
  classes: "📅 کلاس‌ها همه روزه (روزهای زوج و فرد) برگزار می‌شود.",
  address: "📍 آدرس: باغ فیض، کوچه چهارم",
  teacher: "👩‍🏫 مدرس: مریم بقایی",
  phone: "📞 شماره تماس: 09102303779",
  prices: "💰 شهریه‌ها:\n🇬🇧 آیلتس: 3,000,000 تومان\n👨‍🏫 کلاس خصوصی: 2,000,000 تومان\n📝 کلاس خصوصی جبرانی: 700,000 تومان"
};

const motivations = [
  "موفقیت از تلاش مداوم می‌آید.",
  "هر روز یک قدم کوچک به سمت هدف.",
  "یادگیری زبان، باز کردن درهای جدید است."
];

async function send(chatId, text) {
  try {
    await axios.post(config.BOT.API + "/sendMessage", {
      chat_id: chatId,
      text: text,
      reply_markup: {
        keyboard: keyboard.mainKeyboard,
        resize_keyboard: true
      }
    });
  } catch (error) {
    console.log("SEND ERROR:", error.response?.data || error.message);
  }
}

let offset = -1;
let isProcessing = false;

async function getUpdates() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const result = await axios.get(config.BOT.API + "/getUpdates?offset=" + offset);
    const updates = result.data.result || [];

    for (const update of updates) {
      offset = update.update_id + 1;
      if (!update.message) continue;

      const chatId = update.message.chat.id;
      const text = update.message.text || "";

      if (!users.includes(chatId)) {
        users.push(chatId);
        saveUsers();
      }

      if (text === "/start") {
        if (!welcomedUsers.includes(chatId)) {
          welcomedUsers.push(chatId);
          saveWelcome();
          await send(chatId, `👋 سلام\n\nبه ربات آموزشگاه زبان سپید خوش آمدید.`);
          await send(chatId, `📌 اطلاعات آموزشگاه\n\n📅 کلاس‌ها: همه روزه\n📍 آدرس: باغ فیض، کوچه چهارم\n👩‍🏫 مدرس: مریم بقایی\n📞 تماس: 09102303779\n💰 شهریه: آیلتس ۳ میلیون، خصوصی ۲ میلیون`);
        }
      } 
      else if (text === "📚 کلاس‌ها") await send(chatId, data.classes);
      else if (text === "📍 آدرس") await send(chatId, data.address);
      else if (text === "👩‍🏫 استاد") await send(chatId, data.teacher);
      else if (text === "📞 تماس") await send(chatId, data.phone);
      else if (text === "💰 شهریه") await send(chatId, data.prices);
      else if (text === "🇬🇧 جمله انگیزشی روز") {
        const random = motivations[Math.floor(Math.random() * motivations.length)];
        await send(chatId, random);
      } 
      
      else {
        const dailyLessons = [
          "📚 تمرین امروز:\n\nWord: Beautiful\nMeaning: زیبا\nExample: She has a beautiful smile.",
        
          "📚 تمرین امروز:\n\nWord: Improve\nMeaning: بهتر کردن\nExample: I want to improve my English.",
        
          "📚 تمرین امروز:\n\nWord: Success\nMeaning: موفقیت\nExample: Hard work leads to success."
        ];

        await send(chatId, "لطفاً از منوی ربات انتخاب کنید 👇");
      }
    }
  } catch (error) {
    console.log("UPDATE ERROR:", error.response?.data || error.message);
  } finally {
    isProcessing = false;
  }
}

cron.schedule("0 9 * * *", async () => {

  const lesson = dailyLessons[
    Math.floor(Math.random() * dailyLessons.length)
  ];

  for (const userId of users) {
    await send(userId, lesson);
  }

  console.log("Daily lesson sent");

});
console.log("🚀 Bot Started");
setInterval(getUpdates, 1000);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server started");
});
