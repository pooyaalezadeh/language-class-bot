require("dotenv").config();

const axios = require("axios");

const fs = require("fs");
const cron = require("node-cron");
const express = require("express");

const welcomeFile = "./database/welcome.json";
const usersFile = "./database/users_list.json";

if (!fs.existsSync("./database")) {
  fs.mkdirSync("./database");
}

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}

if (!fs.existsSync(welcomeFile)) {
  fs.writeFileSync(welcomeFile, "[]");
}

let users = JSON.parse(fs.readFileSync(usersFile));
let welcomedUsers = JSON.parse(fs.readFileSync(welcomeFile));

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
  }
};

console.log("AI KEY:", process.env.AI_KEY ? "FOUND" : "NOT FOUND");



const keyboard = {
  mainKeyboard: [
    ["📝 ثبت‌نام", "📚 کلاس‌ها"],
    ["🎯 تعیین سطح", "📖 تمرین روزانه"],
    ["📍 آدرس", "👩‍🏫 استاد"],
    ["📞 تماس", "💰 شهریه"],
    ["🇬🇧 جمله انگیزشی روز"]
  ]
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
        model: "meta-llama/llama-3.2-3b-instruct:free",
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

async function handleUpdate(update){




  if(isProcessing) return;
  
  isProcessing = true;
  
  
  try{
  


  
  
    if(!update || !update.message) return;
  
  
  const chatId = update.message.chat.id;
  const text = update.message.text || "";
  
  
  
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
  
  
  
  else if(text === "💰 شهریه"){
  
  await send(chatId,data.prices);
  
  }
  
  
  
  else if(text === "📝 ثبت‌نام"){
  
  await send(chatId,data.register);
  
  }
  
  
  
  else if(text === "🎯 تعیین سطح"){
  
  await send(chatId,data.level);
  
  }
  
  
  
  else if(text === "📖 تمرین روزانه"){
  
  
  const lesson =
  dailyLessons[
  Math.floor(Math.random()*dailyLessons.length)
  ];
  
  
  await send(chatId,lesson);
  
  
  }
  
  
  
  else if(text === "🇬🇧 جمله انگیزشی روز"){
  
  
  const msg =
  motivations[
  Math.floor(Math.random()*motivations.length)
  ];
  
  
  await send(chatId,msg);
  
  
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
