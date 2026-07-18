const fs = require("fs");

const file = "./database/register.json";


if(!fs.existsSync(file)){
    fs.writeFileSync(file,"[]");
}


let registrations = JSON.parse(
    fs.readFileSync(file)
);


function save(){

    fs.writeFileSync(
        file,
        JSON.stringify(registrations,null,2)
    );

}



module.exports = {


start(chatId){

return {
    step:"name",
    message:
`📝 ثبت‌نام آموزشگاه زبان سپید

لطفاً نام و نام خانوادگی خود را وارد کنید:`
};

},



process(chatId,text,state){


if(state.step==="name"){

state.name=text;

state.step="phone";


return "📞 لطفاً شماره تماس خود را وارد کنید:";

}



if(state.step==="phone"){

state.phone=text;

state.step="course";


return `
📚 انتخاب دوره:

1️⃣ مکالمه انگلیسی

2️⃣ آیلتس

3️⃣ کلاس خصوصی

نام دوره را ارسال کنید:
`;

}



if(state.step==="course"){


state.course=text;


registrations.push({

chatId:chatId,

name:state.name,

phone:state.phone,

course:state.course,

date:new Date()

});


save();


state.step="done";


return `
✅ ثبت‌نام شما با موفقیت انجام شد 🌱

👤 نام: ${state.name}

📞 تماس: ${state.phone}

📚 دوره: ${state.course}

کارشناسان آموزشگاه با شما تماس خواهند گرفت.
`;

}


return null;


}



};