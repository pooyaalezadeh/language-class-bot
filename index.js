require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const motivations = require("./motivations");
const scheduler = require("./scheduler");
const Game = require("./game");

const config = require("./config");
const data = require("./data");
const keyboard = require("./keyboard");
const Register = require("./register");
const game = new Game(send);

let offset = 0;
let processedMessages = new Set();
let isProcessing = false;


const welcomeFile = "./database/welcome.json";
const usersFile = "./database/users_list.json";

let users = [];

let welcomedUsers = [];

if(fs.existsSync(welcomeFile)){
    welcomedUsers = JSON.parse(
        fs.readFileSync(welcomeFile)
    );
}
if(fs.existsSync(usersFile)){
  users = JSON.parse(
      fs.readFileSync(usersFile)
  );
}


function saveUsers(){

  fs.writeFileSync(
      usersFile,
      JSON.stringify(users, null, 2)
  );

}



// ارسال پیام
async function send(chatId, text) {

    try {

        await axios.post(
            config.BOT.API + "/sendMessage",
            {
                chat_id: chatId,
                text: text,
                reply_markup: {
                    keyboard: keyboard.mainKeyboard,
                    resize_keyboard: true
                }
            }
        );

    } catch(error) {

        console.log(
            "SEND ERROR:",
            error.response?.data || error.message
        );

    }

}


// بعد از ساخت send
const register = new Register(send);
async function sendPhoto(chatId){
  const register = new Register(send);
const game = new Game(send);

  try {

      const form = new FormData();

      form.append("chat_id", chatId);

      form.append(
          "photo",
          fs.createReadStream("./assets/english.jpg.jfif")
      );

      form.append(
          "caption",
          "🇬🇧 آموزش زبان انگلیسی\n\nدرس امروز: یادگیری روزانه لغات 🌱"
      );


      const response = await axios.post(
          config.BOT.API + "/sendPhoto",
          form,
          {
              headers: form.getHeaders()
          }
      );


      console.log("PHOTO SENT:", response.data);


  } catch(error){

      console.log(
          "PHOTO ERROR:",
          error.response?.data || error.message
      );

  }

}
async function sendPhoto(chatId){

  try {

      const form = new FormData();

      form.append(
          "chat_id",
          chatId
      );

      form.append(
          "photo",
          fs.createReadStream("./assets/english.jpg")
      );

      form.append(
          "caption",
`🇬🇧 آموزش زبان انگلیسی

📚 درس امروز:
یادگیری هر روز یک قدم بهتر 🌱`
      );


      await axios.post(
          config.BOT.API + "/sendPhoto",
          form,
          {
              headers: form.getHeaders()
          }
      );


  } catch(error){

      console.log(
          "PHOTO ERROR:",
          error.response?.data || error.message
      );

  }

}

// دریافت پیام
async function getUpdates(){


    if(isProcessing) return;

    isProcessing = true;


    try {


        const result = await axios.get(
            config.BOT.API + "/getUpdates?offset=" + offset
        );


        const updates = result.data.result || [];



        for(const update of updates){


            offset = update.update_id + 1;



            if(!update.message)
                continue;



            if(processedMessages.has(update.update_id))
                continue;



            processedMessages.add(update.update_id);



            const chatId = update.message.chat.id;
            const text = update.message.text || "";
            if(!users.includes(chatId)){

              users.push(chatId);
          
              saveUsers();
          
          }



            console.log("📩", text);



            // اگر ثبت نام در حال انجام است
            const registering = await register.process(chatId,text);


            if(registering){
                continue;
            }
            const playing = await game.check(chatId, text);

            if(playing){
                continue;
            }

            if(text === "/start"){


              if(!welcomedUsers.includes(chatId)){
          
          
                  welcomedUsers.push(chatId);
          
                  saveWelcome();
                  function saveUsers(){

                    fs.writeFileSync(
                        usersFile,
                        JSON.stringify(users, null, 2)
                    );
                
                }
          
          
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


            else if(text === "📝 ثبت‌نام"){


                await register.start(chatId);


            }



            else if(text === "📚 کلاس‌ها"){


                await send(
                    chatId,
                    data.classes
                );


            }



            else if(text === "📍 آدرس"){


                await send(
                    chatId,
                    data.address
                );


            }



            else if(text === "👩‍🏫 استاد"){


                await send(
                    chatId,
                    data.teacher
                );


            }


            else if(text === "⚙️ پنل مدیریت"){
              console.log("ADMIN ID =", config.ADMIN.ID);
              console.log("CHAT ID =", chatId);
              if(String(chatId) !== String(config.ADMIN.ID)){
          
                  await send(
                      chatId,
                      "⛔ شما دسترسی به پنل مدیریت ندارید."
                  );
          
              }else{
          
                  await send(
                      chatId,
          `⚙️ پنل مدیریت
          
          1️⃣ 👥 تعداد کاربران
          2️⃣ 📋 لیست ثبت‌نام‌ها
          3️⃣ 📢 پیام همگانی
          4️⃣ 📊 آمار ربات
          
          (به‌زودی قابلیت‌های بیشتری اضافه می‌شود)`
                  );
          
              }
          
          }
            else if(text === "📞 تماس"){


                await send(
                    chatId,
                    data.phone
                );


            }



            else if(text === "💰 شهریه"){


                await send(
                    chatId,
                    data.prices
                );


            }


            else if(text === "🖼 تصویر آموزشی"){

              await send(
                  chatId,
          `🇬🇧 درس روزانه زبان انگلیسی
          
          📚 موضوع: معرفی خود (Introducing Yourself)
          
          Hello! My name is Pooya.
          I am learning English.
          I want to improve my speaking skills.
          
          🔹 معنی:
          سلام! اسم من پویاست.
          من در حال یادگیری زبان انگلیسی هستم.
          می‌خواهم مهارت صحبت کردنم را بهتر کنم.
          
          📝 کلمات مهم:
          
          ⭐ Improve = بهبود دادن
          ⭐ Learn = یاد گرفتن
          ⭐ Skill = مهارت
          ⭐ Speaking = صحبت کردن
          ⭐ Introduce = معرفی کردن
          
          💬 مثال:
          
          I learn English every day.
          من هر روز انگلیسی یاد می‌گیرم.
          
          🌱 تمرین امروز:
          یک جمله درباره خودت به انگلیسی بنویس.
          
          موفق باشی 💪🇬🇧`
              );
          
          }
          
          else if(text === "👤 پروفایل کاربر"){

            await send(
                chatId,
        `👤 پروفایل کاربر
        
        نام: ثبت نشده
        سطح زبان: انتخاب نشده
        تعداد آزمون: 0
        امتیاز: 0
        
        📝 برای تکمیل اطلاعات، ثبت‌نام کنید.`
            );
        
        }
        else if(text === "🇬🇧 جمله انگیزشی روز"){
          

          const random =
              motivations[
                  Math.floor(Math.random() * motivations.length)
              ];
      
          await send(chatId, random);
      
      }
      else if(text === "🎮 بازی لغات"){

        await game.start(chatId);
    
    }
          else if(text === "📢 انگیزشی"){
                const random =
                data.motivational[
                    Math.floor(
                        Math.random() *
                        data.motivational.length
                    )
                ];
                



                await send(
                    chatId,
                    random
                );


            }



            else {


                await send(
                    chatId,
                    "لطفاً از منوی ربات انتخاب کنید 👇"
                );


            }


        }



    } catch(error){


        console.log(
            "UPDATE ERROR:",
            error.response?.data || error.message
        );


    }



    finally{

        isProcessing = false;

    }


}



console.log("🚀 Language Bot PRO Started");
scheduler(send);



setInterval(
    getUpdates,
    1000
);