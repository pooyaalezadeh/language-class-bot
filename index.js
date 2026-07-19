require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");
const express = require("express");

const tetris = require("./tetris");

/* ================= DATABASE ================= */

if (!fs.existsSync("./database")) {
    fs.mkdirSync("./database");
}


const DB = {

users:"./database/users_list.json",
welcome:"./database/welcome.json",
memory:"./database/memory.json",
registers:"./database/registers.json",
scores:"./database/game_scores.json",
missions:"./database/missions.json",
profiles:"./database/profiles.json"

};



function createFile(path,data){

if(!fs.existsSync(path)){
fs.writeFileSync(
path,
JSON.stringify(data,null,2)
);
}

}


createFile(DB.users,[]);
createFile(DB.welcome,[]);
createFile(DB.memory,{});
createFile(DB.registers,[]);
createFile(DB.scores,{});
createFile(DB.missions,{});
createFile(DB.profiles,{});



let users =
JSON.parse(fs.readFileSync(DB.users));


let welcomedUsers =
JSON.parse(fs.readFileSync(DB.welcome));


let memory =
JSON.parse(fs.readFileSync(DB.memory));


let registrations =
JSON.parse(fs.readFileSync(DB.registers));


let gameScores =
JSON.parse(fs.readFileSync(DB.scores));


let missionsData =
JSON.parse(fs.readFileSync(DB.missions));


let profiles =
JSON.parse(fs.readFileSync(DB.profiles));




/* ================= SAVE ================= */


function saveUsers(){

fs.writeFileSync(
DB.users,
JSON.stringify(users,null,2)
);

}



function saveWelcome(){

fs.writeFileSync(
DB.welcome,
JSON.stringify(welcomedUsers,null,2)
);

}



function saveMemory(){

fs.writeFileSync(
DB.memory,
JSON.stringify(memory,null,2)
);

}



function saveRegistrations(){

fs.writeFileSync(
DB.registers,
JSON.stringify(registrations,null,2)
);

}



function saveScores(){

fs.writeFileSync(
DB.scores,
JSON.stringify(gameScores,null,2)
);

}



function saveProfiles(){

fs.writeFileSync(
DB.profiles,
JSON.stringify(profiles,null,2)
);

}




/* ================= CONFIG ================= */


const config={

BOT:{

TOKEN:process.env.BOT_TOKEN,

API:
`https://tapi.bale.ai/bot${process.env.BOT_TOKEN}`

}

};



console.log(
"AI KEY:",
process.env.AI_KEY ? "FOUND":"NOT FOUND"
);




/* ================= KEYBOARD ================= */


const keyboard={

mainKeyboard:[

["📞 تماس","💰 شهریه"],

["📍 نقشه آموزشگاه","🎮 بازی تتریس"],

["📚 کلاس‌ها","📝 ثبت‌نام"],

["🎯 تعیین سطح"],

["🏆 رتبه‌بندی"]

]

};




/* ================= DATA ================= */


const data={


classes:

`
📚 دوره‌های آموزشگاه زبان سپید

🇬🇧 مکالمه انگلیسی

📖 گرامر و واژگان

🎯 آمادگی آزمون آیلتس


تقویت:
Speaking
Listening
Reading
Writing


کلاس‌ها در روزهای زوج و فرد برگزار می‌شوند.
`,


address:

"📍 آدرس: باغ فیض، کوچه چهارم",


teacher:

"👩‍🏫 مدرس: مریم بقایی",


phone:

"📞 شماره تماس: 09102303779",


prices:

`
💰 شهریه کلاس‌ها:

🇬🇧 آیلتس:
3,000,000 تومان

👨‍🏫 کلاس خصوصی:
2,000,000 تومان

📝 کلاس جبرانی:
700,000 تومان
`,


level:

`
🎯 تعیین سطح زبان

لطفاً ارسال کنید:

1- نام و نام خانوادگی

2- سن

3- سطح زبان

4- هدف یادگیری

`

};




const motivations=[

"🌱 موفقیت با قدم‌های کوچک روزانه ساخته می‌شود.",

"📚 هر روز یک کلمه جدید یاد بگیر.",

"🇬🇧 زبان انگلیسی دریچه‌ای به فرصت‌های جدید است."

];



const dailyLessons=[


`
📖 تمرین امروز:

Word:
Beautiful

Meaning:
زیبا

Example:
She has a beautiful smile.
`,


`
📖 تمرین امروز:

Word:
Improve

Meaning:
بهتر کردن

Example:
I want to improve my English.
`,


`
📖 تمرین امروز:

Word:
Success

Meaning:
موفقیت

Example:
Hard work leads to success.
`

];



let registerStep={};

let isProcessing=false;
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
  
  model:"qwen/qwen3-8b:free",
  
  messages:[
  
  {
  role:"system",
  content:
  "تو دستیار هوشمند آموزشگاه زبان سپید هستی. فارسی و دوستانه پاسخ بده."
  },
  
  {
  role:"user",
  content:question
  }
  
  ]
  
  },
  
  {
  
  headers:{
  
  Authorization:
  `Bearer ${process.env.AI_KEY}`,
  
  "Content-Type":
  "application/json",
  
  "HTTP-Referer":
  "https://language-class-bot-2.onrender.com",
  
  "X-Title":
  "Language Sefid Bot"
  
  }
  
  }
  
  );
  
  
  return response.data.choices[0].message.content;
  
  
  }catch(error){
  
  
  console.log(
  "AI ERROR:",
  error.response?.data || error.message
  );
  
  
  return "فعلاً پاسخ هوشمند در دسترس نیست 😊";
  
  
  }
  
  }
  
  
  
  
  
  async function handleUpdate(update){
  
  
  if(isProcessing) return;
  
  
  isProcessing=true;
  
  
  try{
  
  
  if(!update || !update.message)
  return;
  
  
  
  const chatId =
  update.message.chat.id;
  
  
  
  const text =
  update.message.text || "";
  
  
  
  /* ساخت پروفایل */
  
  
  if(!profiles[chatId]){
  
  
  profiles[chatId]={
  
  id:chatId,
  
  xp:0,
  
  level:1,
  
  games:0,
  
  lessons:0,
  
  register:false,
  
  achievements:[]
  
  };
  
  
  saveProfiles();
  
  }
  
  
  
  
  
  /* حافظه */
  
  
  if(!memory[chatId]){
  
  memory[chatId]={};
  
  }
  
  
  
  /* ثبت کاربر */
  
  
  if(!users.includes(chatId)){
  
  users.push(chatId);
  
  saveUsers();
  
  }
  
  
  
  /* امتیاز */
  
  
  profiles[chatId].xp +=5;
  
  saveProfiles();
  
  
  
  
  
  /* ثبت نام مرحله ای */
  
  
  if(registerStep[chatId]){
  
  
  let step =
  registerStep[chatId].step;
  
  
  
  if(step===1){
  
  
  registerStep[chatId].name=text;
  
  registerStep[chatId].step=2;
  
  
  await send(
  chatId,
  "🎂 سن خود را وارد کنید:"
  );
  
  
  return;
  
  }
  
  
  
  if(step===2){
  
  
  registerStep[chatId].age=text;
  
  registerStep[chatId].step=3;
  
  
  await send(
  chatId,
  "📞 شماره تماس خود را وارد کنید:"
  );
  
  
  return;
  
  }
  
  
  
  if(step===3){
  
  
  registerStep[chatId].phone=text;
  
  registerStep[chatId].step=4;
  
  
  await send(
  chatId,
  `
  📚 دوره مورد نظر را وارد کنید:
  
  🇬🇧 آیلتس
  
  🗣 مکالمه انگلیسی
  
  📖 گرامر
  
  👨‍🏫 کلاس خصوصی
  `
  );
  
  
  return;
  
  }
  
  
  
  if(step===4){
  
  
  
  registrations.push({
  
  userId:chatId,
  
  name:
  registerStep[chatId].name,
  
  age:
  registerStep[chatId].age,
  
  phone:
  registerStep[chatId].phone,
  
  course:text,
  
  date:
  new Date().toLocaleString("fa-IR")
  
  });
  
  
  saveRegistrations();
  
  
  delete registerStep[chatId];
  
  
  profiles[chatId].register=true;
  
  saveProfiles();
  
  
  
  await send(
  
  chatId,
  
  `
  ✅ ثبت‌نام با موفقیت انجام شد 🎉
  
  
  📝 اطلاعات شما ذخیره شد.
  
  
  📚 دوره:
  ${text}
  
  
  مدیریت آموزشگاه با شما تماس می‌گیرد.
  `
  
  );
  
  
  return;
  
  
  }
  
  
  }
  
  
  
  
  
  
  /* دستورات اصلی */
  
  
  if(text==="/start"){
  
  
  await send(
  
  chatId,
  
  `
  👋 به ربات آموزشگاه زبان سپید خوش آمدید 🌱
  
  
  🇬🇧 آموزش زبان انگلیسی
  
  
  امکانات:
  
  📚 مشاهده دوره‌ها
  
  📝 ثبت‌نام
  
  🎯 تعیین سطح
  
  💰 شهریه
  
  🎮 بازی آموزشی
  
  
  از منو انتخاب کنید 😊
  
  `
  
  );
  
  
  }
  
  
  
  
  else if(text==="📚 کلاس‌ها"){
  
  await send(
  chatId,
  data.classes
  );
  
  }
  
  
  
  else if(text==="📞 تماس"){
  
  await send(
  chatId,
  data.phone
  );
  
  }
  
  
  
  else if(text==="💰 شهریه"){
  
  await send(
  chatId,
  data.prices
  );
  
  }
  
  
  
  
  
  
  else if(text==="📝 ثبت‌نام"){
  
  
  registerStep[chatId]={
  
  step:1
  
  };
  
  
  await send(
  
  chatId,
  
  "📝 نام و نام خانوادگی خود را وارد کنید:"
  
  );
  
  
  }
  
  
  
  
  
  else if(text==="🎯 تعیین سطح"){
  
  
  await send(
  chatId,
  data.level
  );
  
  
  }
  
  
  
  
  
  else if(text==="👩‍🏫 استاد"){
  
  
  await send(
  chatId,
  data.teacher
  );
  
  
  }
  
  
  
  
  
  else if(text==="🎮 بازی تتریس"){
  
  
  profiles[chatId].games++;
  
  saveProfiles();
  
  
  await send(
  
  chatId,
  
  tetris()
  
  );
  
  
  }
  
  
  
  
  
  else if(text==="🇬🇧 جمله انگیزشی روز"){
  
  
  let m =
  motivations[
  Math.floor(Math.random()*motivations.length)
  ];
  
  
  await send(
  chatId,
  m
  );
  
  
  }
  
  
  
  
  else if(text==="🏆 رتبه‌بندی"){
  
  
  let rank =
  Object.entries(gameScores)
  .sort((a,b)=>b[1]-a[1])
  .slice(0,10);
  
  
  
  let result=
  "🏆 رتبه‌بندی زبان‌آموزان\n\n";
  
  
  
  rank.forEach((u,i)=>{
  
  result+=
  `${i+1}- ${u[0]} ⭐ ${u[1]}\n`;
  
  });
  
  
  await send(
  chatId,
  result
  );
  
  
  }
  else if(text.startsWith("اسم من ")){

    if(!memory[chatId]){
    memory[chatId]={};
    }
    
    
    memory[chatId].name =
    text.replace("اسم من ","");
    
    
    saveMemory();
    
    
    await send(
    chatId,
    "😊 اسم شما ذخیره شد."
    );
    
    
    }
  
  
  
  
  else if(text.startsWith("اسم من ")){

    if(!memory[chatId]){
    memory[chatId]={};
    }
    
    
    memory[chatId].name =
    text.replace("اسم من ","");
    
    
    saveMemory();
    
    
    await send(
    chatId,
    "😊 اسم شما ذخیره شد."
    );
    
    
    }
  
  
  
  else{
  
  
  const answer =
  await askAI(text);
  
  
  await send(
  chatId,
  answer
  );
  
  
  }
  
  
  
  }catch(error){
  
  
  console.log(
  "UPDATE ERROR:",
  error.message
  );
  
  
  }
  
  finally{
  
  isProcessing=false;
  
  }
  
  
  }
  
// ================= DAILY LESSON CRON =================


cron.schedule(
  "0 9 * * *",
  async()=>{
  
  
  const lesson =
  dailyLessons[
  Math.floor(
  Math.random()*dailyLessons.length
  )
  ];
  
  
  
  for(const userId of users){
  
  
  await send(
  userId,
  lesson
  );
  
  
  }
  
  
  
  console.log(
  "✅ Daily lesson sent"
  );
  
  
  }
  
  );
  
  
  
  
  
  // ================= EXPRESS SERVER =================
  
  
  const app = express();
  
  
  app.use(
  express.json()
  );
  
  
  
  
  // تست Render
  
  app.get("/",(req,res)=>{
  
  
  res.send(
  "🚀 Language Bot PRO is Running"
  );
  
  
  });
  
  
  
  
  // تست سلامت
  
  app.get("/health",(req,res)=>{
  
  
  res.json({
  
  status:"OK",
  
  time:new Date()
  
  });
  
  
  });
  
  
  
  
  
  // Bale Webhook
  
  
  app.post(
  "/webhook",
  async(req,res)=>{
  
  
  try{
  
  
  console.log(
  "📩 NEW UPDATE:",
  JSON.stringify(req.body)
  );
  
  
  
  await handleUpdate(
  req.body
  );
  
  
  
  res.sendStatus(200);
  
  
  
  }catch(error){
  
  
  console.log(
  "WEBHOOK ERROR:",
  error.message
  );
  
  
  
  res.sendStatus(200);
  
  
  }
  
  
  }
  
  );
  
  
  
  
  
  
  // Start Server Render
  
  
  const PORT =
  process.env.PORT || 3000;
  
  
  
  app.listen(
  PORT,
  ()=>{
  
  
  console.log(
  `🚀 Server running on port ${PORT}`
  );
  
  
  console.log(
  "🚀 Bot Started Successfully"
  );
  
  
  }
  
  );
