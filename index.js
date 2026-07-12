const welcomeFile = "./database/welcome.json";
const usersFile = "./database/users_list.json";

let users = [];
let welcomedUsers = [];

// ساخت پوشه database اگر وجود نداشت
if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database");
}

// ساخت فایل users_list.json اگر وجود نداشت
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
} else {
  users = JSON.parse(fs.readFileSync(usersFile));
}

// ساخت فایل welcome.json اگر وجود نداشت
if (!fs.existsSync(welcomeFile)) {
  fs.writeFileSync(welcomeFile, "[]");
} else {
  welcomedUsers = JSON.parse(fs.readFileSync(welcomeFile));
}
function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function saveWelcome() {
  fs.writeFileSync(welcomeFile, JSON.stringify(welcomedUsers, null, 2));
}

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

const game = new Game(send);
const register = new Register(send);

async function getUpdates() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const result = await axios.get(config.BOT.API + "/getUpdates?offset=" + offset);
    const updates = result.data.result || [];

    for (const update of updates) {
      offset = update.update_id + 1;
      if (!update.message) continue;
      if (processedMessages.has(update.update_id)) continue;

      processedMessages.add(update.update_id);

      const chatId = update.message.chat.id;
      const text = update.message.text || "";

      if (!users.includes(chatId)) {
        users.push(chatId);
        saveUsers();
      }

      console.log("📩", text);

      const registering = await register.process(chatId, text);
      if (registering) continue;

      const playing = await game.check(chatId, text);
      if (playing) continue;

      if (text === "/start") {
        if (!welcomedUsers.includes(chatId)) {
          welcomedUsers.push(chatId);
          saveWelcome();

          await send(
            chatId,
            `👋 سلام

به ربات آموزشگاه زبان سپید خوش آمدید.

از طریق این ربات می‌توانید:

✅ ثبت‌نام کنید
✅ شهریه را ببینید
✅ اطلاعات کلاس‌ها را دریافت کنید
✅ مطالب آموزشی انگلیسی بخوانید

👇 لطفاً از منوی زیر گزینه موردنظر خود را انتخاب کنید.`
          );

          await send(
            chatId,
            `📌 اطلاعات آموزشگاه
            
📅 کلاس‌ها:
همه روزه (روزهای زوج و فرد)
            
📍 آدرس:
باغ فیض، کوچه چهارم
            
👩‍🏫 مدرس:
مریم بقایی
            
📞 شماره تماس:
09102303779
            
💰 شهریه‌ها:
            
🇬🇧 آیلتس: 3,000,000 تومان
👨‍🏫 کلاس خصوصی: 2,000,000 تومان
📝 کلاس خصوصی جبرانی: 700,000 تومان`
          );
        }
      } 
      else if (text === "📝 ثبت‌نام") {
        await register.start(chatId);
      } 
      else if (text === "📚 کلاس‌ها") {
        await send(chatId, data.classes);
      } 
      else if (text === "📍 آدرس") {
        await send(chatId, data.address);
      } 
      else if (text === "👩‍🏫 استاد") {
        await send(chatId, data.teacher);
      } 
      else if (text === "📞 تماس") {
        await send(chatId, data.phone);
      } 
      else if (text === "💰 شهریه") {
        await send(chatId, data.prices);
      } 
      else if (text === "🇬🇧 جمله انگیزشی روز") {
        const random = motivations[Math.floor(Math.random() * motivations.length)];
        await send(chatId, random);
      } 
      else if (text === "🎮 بازی لغات") {
        await game.start(chatId);
      } 
      else if (text === "📢 انگیزشی") {
        const random = data.motivational[Math.floor(Math.random() * data.motivational.length)];
        await send(chatId, random);
      } 
      else if (text === "⚙️ پنل مدیریت") {
        if (String(chatId) !== String(config.ADMIN.ID)) {
          await send(chatId, "⛔ شما دسترسی به پنل مدیریت ندارید.");
        } else {
          await send(chatId, `⚙️ پنل مدیریت\n\n1️⃣ 👥 تعداد کاربران\n...`);
        }
      } 
      else {
        await send(chatId, "لطفاً از منوی ربات انتخاب کنید 👇");
      }
    }
  } catch (error) {
    console.log("UPDATE ERROR:", error.response?.data || error.message);
  } finally {
    isProcessing = false;
  }
}

console.log("🚀 Language Bot PRO Started");
scheduler(send);
setInterval(getUpdates, 1000);
