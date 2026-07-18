require("dotenv").config();

const axios = require("axios");

const fs = require("fs");
const cron = require("node-cron");
const express = require("express");
const location = require("./features/location");
const register = require("./features/register");
const admin = require("./features/admin");
const faq = require("./features/faq");
const game = require("./features/game");
const tetris = require("./features/tetris");
const missions = require("./features/missions");

const welcomeFile = "./database/welcome.json";
const usersFile = "./database/users_list.json";
const memoryFile = "./database/memory.json";
const registerFile = "./database/registers.json";
const gameFile = "./database/game_scores.json";
const missionFile = "./database/missions.json";

if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database");
}

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

if (!fs.existsSync(welcomeFile)) {
  fs.writeFileSync(welcomeFile, "[]");
}
if (!fs.existsSync(memoryFile)) {
  fs.writeFileSync(memoryFile, "{}");
}
if (!fs.existsSync(registerFile)) {
  fs.writeFileSync(registerFile, "[]");
}
if (!fs.existsSync(gameFile)) {
  fs.writeFileSync(gameFile, "{}");
}


if (!fs.existsSync(missionFile)) {
  fs.writeFileSync(missionFile, "{}");
}

let users = JSON.parse(fs.readFileSync(usersFile));
let welcomedUsers = JSON.parse(fs.readFileSync(welcomeFile));
let registrations = JSON.parse(
  fs.readFileSync(registerFile)
  );



function saveUsers() {
  let memory = JSON.parse(fs.readFileSync(memoryFile));
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function saveWelcome() {
  function saveMemory() {
    fs.writeFileSync(
        memoryFile,
        JSON.stringify(memory, null, 2)
    );
}
function saveRegistrations(){

  fs.writeFileSync(
    registerFile,
    JSON.stringify(registrations, null, 2)
  );

}
  fs.writeFileSync(welcomeFile, JSON.stringify(welcomedUsers, null, 2));
}


const config = {
  BOT: {
    TOKEN: process.env.BOT_TOKEN,
    API: `https://tapi.bale.ai/bot${process.env.BOT_TOKEN}`
  }
};

console.log("AI KEY:", process.env.AI_KEY ? "FOUND" : "NOT FOUND");



const keyboard = {
  mainKeyboard: [
    [
      "📞 تماس",
      "💰 شهریه"
    ],
    [
      "📍 نقشه آموزشگاه",
      "🎮 بازی زبان"
    ],
    [
      "🎮 بازی تتریس"
    ],
    [
      "🇬🇧 جمله انگیزشی روز"
    ]
  ]
  [
    "🏆 رتبه‌بندی"
    ],
};


const data = {

classes:
`📚 دوره‌های آموزشگاه زبان سپید:

🇬🇧 مکالمه انگلیسی
تقویت Speaking و اعتماد به نفس

📖 گرامر و واژگان
یادگیری اصولی زبان

🎯 آمادگی آزمون آیلتس
تمرین مهارت‌های Listening، Reading، Writing و Speaking

کلاس‌ها در روزهای زوج و فرد برگزار می‌شوند.`,

address:
"📍 آدرس: باغ فیض، کوچه چهارم",

teacher:
"👩‍🏫 مدرس: مریم بقایی",

phone:
"📞 شماره تماس: 09102303779",

prices:
`💰 شهریه کلاس‌ها:

🇬🇧 آیلتس: 3,000,000 تومان

👨‍🏫 کلاس خصوصی: 2,000,000 تومان

📝 کلاس جبرانی: 700,000 تومان`,

level:
`🎯 تعیین سطح زبان

برای تعیین سطح لطفاً اطلاعات زیر را ارسال کنید:

1- نام و نام خانوادگی
2- سن
3- سطح تقریبی زبان
4- هدف شما از یادگیری زبان`,

register:
`📝 ثبت‌نام کلاس

برای ثبت‌نام لطفاً نام، شماره تماس و دوره مورد نظر خود را ارسال کنید.`
};


const motivations = [
"🌱 موفقیت با قدم‌های کوچک روزانه ساخته می‌شود.",
"📚 هر روز یک کلمه جدید یاد بگیر.",
"🇬🇧 زبان انگلیسی دریچه‌ای به فرصت‌های جدید است."
];
const randomReplies = [
  "😊 ممنون که پیام دادی. چطور می‌تونم کمکت کنم؟",
  "🇬🇧 یادگیری زبان با تمرین روزانه قوی‌تر می‌شود.",
  "📚 اگر سوالی درباره کلاس‌ها داری از منوی ربات انتخاب کن.",
  "🌱 هر روز یک قدم برای پیشرفت زبان بردار.",
  "✨ عالیه! ادامه بده، موفقیت نزدیکه."
  ];


const dailyLessons = [
`📖 تمرین امروز:

Word: Beautiful

Meaning: زیبا

Example:
She has a beautiful smile.`,

`📖 تمرین امروز:

Word: Improve

Meaning: بهتر کردن

Example:
I want to improve my English.`,

`📖 تمرین امروز:

Word: Success

Meaning: موفقیت

Example:
Hard work leads to success.`
];


async function send(chatId,text){

try{

await axios.post(
config.BOT.API + "/sendMessage",
{
chat_id:chatId,
text:text,
reply_markup:{
keyboard:keyboard.mainKeyboard,
resize_keyboard:true
}
}
);

}catch(error){

console.log(
"SEND ERROR:",
error.response?.data || error.message
);

}

}
async function askAI(question){

  try{

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-8b:free",
        messages:[
          {
            role:"system",
            content:"تو دستیار هوشمند آموزشگاه زبان سپید هستی. فارسی و دوستانه جواب بده."
          },
          {
            role:"user",
            content: question
          }
        ]
      },
      {
        headers:{
          Authorization:`Bearer ${process.env.AI_KEY}`,
          "Content-Type":"application/json",
          "HTTP-Referer":"https://language-class-bot-2.onrender.com",
          "X-Title":"Language Sefid Bot"
        }
      }
    );


    return response.data.choices[0].message.content;


  }catch(error){

    console.log(
      "AI ERROR:",
      error.response?.data || error.message
    );

    return "خطای AI: " + (error.response?.data?.error?.message || error.message);

  }

}
let isProcessing = false;
let registerStates = {};
let profiles = {};
let memory = {};
let registerStep = {};

async function handleUpdate(update){




  if(isProcessing) return;
  
  isProcessing = true;
  
  
  try{
  


  
  
    if(!update || !update.message) return;
  
  
  const chatId = update.message.chat.id;
  if (!profiles[chatId]) {
    profiles[chatId] = {
        id: chatId,
        xp: 0,
        level: 1,
        games: 0,
        lessons: 0,
        register: false
    };
    achievements: []
}
  const text = update.message.text || "";
  if(registerStep[chatId]){
    if(registerStep[chatId].step === 4){

      registerStep[chatId].course = text;
    
    
      registrations.push({
    
        userId: chatId,
    
        name: registerStep[chatId].name,
    
        age: registerStep[chatId].age,
    
        phone: registerStep[chatId].phone,
    
        course: registerStep[chatId].course,
    
        date: new Date().toLocaleString("fa-IR")
    
      });
    
    
      saveRegistrations();
    
    
      delete registerStep[chatId];
    
    
      await send(
        chatId,
    `
    ✅ ثبت‌نام شما با موفقیت انجام شد 🎉
    
    📝 اطلاعات شما ذخیره شد.
    
    📚 دوره:
    ${text}
    
    مدیریت آموزشگاه به زودی با شما تماس می‌گیرد.
    `
      );
    
    
      return;
    
    }
    if(registerStep[chatId].step === 3){

      registerStep[chatId].phone = text;
    
      registerStep[chatId].step = 4;
    
    
      await send(
        chatId,
        `
    ✅ شماره تماس ذخیره شد
    
    📚 لطفاً دوره مورد نظر خود را وارد کنید:
    
    گزینه‌ها:
    🇬🇧 آیلتس
    🗣 مکالمه انگلیسی
    📖 گرامر
    👨‍🏫 کلاس خصوصی
    `
      );
    
      return;
    
    }

    if(registerStep[chatId].step === 1){
  
      registerStep[chatId].name = text;
      registerStep[chatId].step = 2;
  
      await send(
        chatId,
        "🎂 سن خود را وارد کنید:"
      );
  
      return;
    }
  
  
    if(registerStep[chatId].step === 2){
      if(registerStep[chatId].step === 1){

        registerStep[chatId].name = text;
      
        registerStep[chatId].step = 2;
      
      
        await send(
          chatId,
          `
      ✅ نام ذخیره شد
      
      🎂 لطفاً سن خود را وارد کنید:
      `
        );
      
        return;
      
      }
      if(registerStep[chatId].step === 2){

        registerStep[chatId].age = text;
      
        registerStep[chatId].step = 3;
      
      
        await send(
          chatId,
          `
      ✅ سن ذخیره شد
      
      📞 لطفاً شماره تماس خود را وارد کنید:
      `
        );
      
        return;
      
      }
  
      registerStep[chatId].age = text;
      registerStep[chatId].step = 3;
  
      await send(
        chatId,
        "📞 شماره تماس خود را وارد کنید:"
      );
  
      return;
    }
  
  
    if(registerStep[chatId].step === 3){
  
      registerStep[chatId].phone = text;
      registerStep[chatId].step = 4;
  
      await send(
        chatId,
        "📚 دوره مورد نظر را وارد کنید:"
      );
  
      return;
    }
  
  
    if(registerStep[chatId].step === 4){
  
      registerStep[chatId].course = text;
  
  
      registrations.push({
        user: chatId,
        name: registerStep[chatId].name,
        age: registerStep[chatId].age,
        phone: registerStep[chatId].phone,
        course: registerStep[chatId].course,
        date: new Date()
      });
  
  
      saveRegistrations();
  
  
      delete registerStep[chatId];
  
  
      await send(
        chatId,
        `
  ✅ ثبت‌نام شما انجام شد
  
  📝 اطلاعات شما ذخیره شد.
  مدیریت آموزشگاه در اولین فرصت با شما تماس می‌گیرد.
  `
      );
  
      return;
    }
  
  }
  if (!memory[chatId]) {
    memory[chatId] = {};
}
  // افزایش امتیاز کاربر
profiles[chatId].xp += 5;
// دستاوردها

if(
  profiles[chatId].xp >= 100 &&
  !profiles[chatId].achievements.includes("🥉")
  ){
  
  profiles[chatId].achievements.push("🥉");
  
  await send(
  chatId,
  `🏅 دستاورد جدید
  
  🥉 کاربر فعال
  
  تبریک!
  اولین مدال خودت را گرفتی.`
  );
  
  }
  
  if(
  profiles[chatId].xp >= 500 &&
  !profiles[chatId].achievements.includes("🥈")
  ){
  
  profiles[chatId].achievements.push("🥈");
  
  await send(
  chatId,
  `🏅 دستاورد جدید
  
  🥈 زبان‌آموز حرفه‌ای
  
  تبریک!`
  );
  
  }
  
  if(
  profiles[chatId].xp >= 1000 &&
  !profiles[chatId].achievements.includes("🥇")
  ){
  
  profiles[chatId].achievements.push("🥇");
  
  await send(
  chatId,
  `🏆
  
  تبریک
  
  مدال طلایی گرفتی.`
  );
  
  }

// هر 100 امتیاز = یک سطح
const newLevel = Math.floor(profiles[chatId].xp / 100) + 1;

if (newLevel > profiles[chatId].level) {

    profiles[chatId].level = newLevel;

    await send(
        chatId,
        `🎉 تبریک!

شما به سطح ${newLevel} رسیدید.

🏆 جایزه:
۵۰ امتیاز اضافه دریافت کردید.`
    );

    profiles[chatId].xp += 50;

}
  
  
  
  if(!users.includes(chatId)){
  
  users.push(chatId);
  saveUsers();
  
  }
  
  
  
  
  if(text === "/start"){
  
  
  if(!welcomedUsers.includes(chatId)){
  
  
  welcomedUsers.push(chatId);
  saveWelcome();
  
  
  
  await send(chatId,
  `👋 به ربات آموزشگاه زبان سپید خوش آمدید 🌱
  
  
  🇬🇧 این ربات برای آموزش و مشاوره زبان انگلیسی طراحی شده است.
  
  
  با استفاده از ربات می‌توانید:
  
  📚 مشاهده دوره‌های زبان
  
  📝 ثبت‌نام کلاس‌ها
  
  🎯 درخواست تعیین سطح
  
  📖 دریافت تمرین روزانه زبان
  
  👩‍🏫 آشنایی با مدرس
  
  💰 اطلاع از شهریه‌ها
  
  
  برای شروع یکی از گزینه‌های منو را انتخاب کنید 😊`
  );
  
  
  
  }
  
  
  }
  
  
  
  else if(text === "📚 کلاس‌ها"){
  
  await send(chatId,data.classes);
  
  }
  
  
  
  else if(text === "📍 آدرس"){
  
  await send(chatId,data.address);
  
  }
  
  
  
  else if(text === "👩‍🏫 استاد"){
  
  await send(chatId,data.teacher);
  
  }
  
  
  
  else if(text === "📞 تماس"){
  
  await send(chatId,data.phone);
  
  }
  else if(text === "📍 نقشه آموزشگاه"){


    await send(
    chatId,
    location.text
    );
    
    
    // ارسال لوکیشن
    await axios.post(
    config.BOT.API + "/sendLocation",
    {
    chat_id: chatId,
    latitude: location.latitude,
    longitude: location.longitude
    }
    );
    
    
    }
  
  
  else if(text === "💰 شهریه"){
  
  await send(chatId,data.prices);
  
  }
  
  
  
  else if(text === "📝 ثبت‌نام"){

    registerStep[chatId] = {
      step: 1
    };
  
    await send(
      chatId,
      `
  📝 ثبت‌نام آموزشگاه زبان سپید
  
  لطفاً نام و نام خانوادگی خود را وارد کنید:
  `
    );
  
  }
  
  
  
  else if(text === "🎯 تعیین سطح"){
    
  
  await send(chatId,data.level);
  
  }
  else if(text === "🎮 بازی تتریس"){

    profiles[chatId].games += 1;
    
    await send(
    chatId,
    tetris()
    );
    
    }
    else if(text === "🏆 رتبه‌بندی"){

      let ranking = Object.entries(gameScores)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,10);
      
      
      if(ranking.length === 0){
      
      await send(
      chatId,
      "🏆 هنوز کسی بازی نکرده است."
      );
      
      }else{
      
      
      let textRank = "🏆 جدول برترین زبان‌آموزان\n\n";
      
      
      ranking.forEach((user,index)=>{
      
      textRank +=
      `${index+1} 🥇 شناسه: ${user[0]}\n⭐ امتیاز: ${user[1]}\n\n`;
      
      });
      
      
      await send(
      chatId,
      textRank
      );
      
      }
      
      }
  else if(text.startsWith("هدف من ")){

    const goal = text.replace("هدف من ","");
    
    if(!memory[chatId]){
    memory[chatId] = {};
    }
    
    memory[chatId].goal = goal;
    
    saveMemory();
    
    await send(
    chatId,
    `🎯 هدف شما ذخیره شد:
    
    ${goal}`
    );
    
    }
  
  
  
  else if(text === "📖 تمرین روزانه"){
  
  
  const lesson =
  dailyLessons[
  Math.floor(Math.random()*dailyLessons.length)
  ];
  
  
  await send(chatId,lesson);
  
  
  }
  
  
  
  
  
  else if(text === "👤 پروفایل کاربر"){

    let user = memory[chatId] || {};
    
    await send(
    chatId,
    `
    👤 پروفایل شما
    
    📝 نام:
    ${user.name || "ثبت نشده"}
    
    🎂 سن:
    ${user.age || "ثبت نشده"}
    
    📚 دوره:
    ${user.course || "ثبت نشده"}
    
    🎯 هدف:
    ${user.goal || "ثبت نشده"}
    
    
    🏆 سطح:
    ${profiles[chatId]?.level || 1}
    
    ⭐ امتیاز:
    ${profiles[chatId]?.xp || 0}
    
    `
    );
    
    }
  else if(text === "👤 پروفایل من"){

    await send(chatId,
    
    `👤 پروفایل شما
    ["👤 پروفایل من"]
    🆔 شناسه:
    ${profiles[chatId].id}
    
    ⭐ سطح:
    ${profiles[chatId].level}
    ⭐ امتیاز تا سطح بعد:

${100 - (profiles[chatId].xp % 100)}
    
    🏆 امتیاز:
    ${profiles[chatId].xp}
    
    🎮 بازی انجام شده:
    ${profiles[chatId].games}
    
    📚 تمرین‌های خوانده شده:
    ${profiles[chatId].lessons}
    
    📝 ثبت نام:
    🏅 مدال‌ها

${profiles[chatId].achievements.join(" ") || "ندارد"}
    ${profiles[chatId].register ? "✅ انجام شده" : "❌ انجام نشده"}
    `);
    
    }
    else if(text.startsWith("اسم من ")){

      const name = text.replace("اسم من ","");
      
      memory[chatId].name = name;
      saveMemory();
      
      await send(
      chatId,
      `😊 خوشبختم ${name}
      
      اسم شما را به خاطر سپردم.`
      );
      
      }
      
      else if(text === "اسم من چیه؟"){
      
      if(memory[chatId].name){
      
      await send(
      chatId,
      `😊 اسم شما
      
      ${memory[chatId].name}
      
      هست.`
      );
      
      }else{
      
      await send(
      chatId,
      "❌ هنوز اسم خودت را به من نگفتی."
      
      );
      
      }
      
      }
      else if(text.startsWith("سن من ")){

        const age = text.replace("سن من ","");
        
        memory[chatId].age = age;
        saveMemory();
        
        await send(
        chatId,
        "🎂 سنت ذخیره شد.");
        
        }
        else if(text.startsWith("دوره من ")){

          const course = text.replace("دوره من ","");
          
          memory[chatId].course = course;
          
          saveMemory();
          
          await send(
          chatId,
          `📚 دوره شما ذخیره شد:
          
          ${course}`
          );
          
          }
        
        else if(text === "سن من چنده؟"){
          
        
        if(memory[chatId].age){
        
        await send(
        chatId,
        `🎂 سن شما
        
        ${memory[chatId].age}
        
        سال است.`);
        
        }else{
          
        
        await send(chatId,"سن خودت را نگفتی.");
        
        }
        
        }
  else{
    
    

    const answer = await askAI(text);

    await send(chatId, answer);

}
}catch(error){
  
  console.log(
  "UPDATE ERROR:",
  error.response?.data || error.message
  );
  
  
  }
  finally{
  
  isProcessing=false;
  
  }
  
  }
  
  
  
  
  
  // ارسال تمرین روزانه ساعت ۹ صبح
  
  cron.schedule("0 9 * * *",async()=>{
  
  
  const lesson =
  dailyLessons[
  Math.floor(Math.random()*dailyLessons.length)
  ];
  
  
  for(const userId of users){
  
  await send(userId,lesson);
  
  }
  
  
  console.log("Daily lesson sent");
  
  
  });
  
  
  
  
  
  console.log("🚀 Bot Started");
  
  

  
  
  
  
  
  // Web Server برای Render
  const app = express();

  app.use(express.json());
  
  app.get("/",(req,res)=>{
    res.send("Language Bot is Running");
  });
  
  app.post("/webhook", async (req,res)=>{
    const update = req.body;
  
    console.log("NEW UPDATE:", update);
  
    await handleUpdate(update);
  
    res.sendStatus(200);
  });
  app.listen(
  process.env.PORT || 3000,
  ()=>{
  
  console.log("Web server started");
  
  }
  );
