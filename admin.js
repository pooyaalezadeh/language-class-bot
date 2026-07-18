const fs = require("fs");


const usersFile = "./database/users_list.json";
const registerFile = "./database/register.json";



function getUsers(){

if(!fs.existsSync(usersFile)){
return [];
}

return JSON.parse(
fs.readFileSync(usersFile)
);

}



function getRegisters(){

if(!fs.existsSync(registerFile)){
return [];
}

return JSON.parse(
fs.readFileSync(registerFile)
);

}




module.exports = {



panel(chatId,adminId){


if(chatId != adminId){

return "⛔ شما دسترسی مدیریت ندارید.";

}



let users = getUsers();

let registers = getRegisters();



return `
👑 پنل مدیریت آموزشگاه سپید


👥 تعداد کاربران:

${users.length}


📝 تعداد ثبت‌نام‌ها:

${registers.length}



دستورات مدیریت:

📊 /stats
📝 /registers

`;

},




stats(chatId,adminId){


if(chatId != adminId){

return "⛔ دسترسی ندارید.";

}


let users=getUsers();


return `
📊 آمار ربات


👥 کاربران:

${users.length}


🤖 وضعیت:

فعال ✅
`;

},




registers(chatId,adminId){


if(chatId != adminId){

return "⛔ دسترسی ندارید.";

}


let data=getRegisters();



if(data.length===0){

return "📝 هنوز ثبت‌نامی وجود ندارد.";

}



let text="📝 ثبت‌نام‌ها:\n\n";


data.forEach((item,index)=>{


text +=
`
${index+1}-
👤 ${item.name}

📞 ${item.phone}

📚 ${item.course}

----------------
`;

});


return text;


}



};