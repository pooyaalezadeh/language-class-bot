const fs = require("fs");

const FILE = "./database/users.json";


class Register {


    constructor(send){

        this.send = send;

        this.users = this.load();

        this.states = {};

    }



    load(){

        if(!fs.existsSync(FILE)){
            fs.writeFileSync(FILE,"[]");
        }

        return JSON.parse(
            fs.readFileSync(FILE)
        );

    }



    save(){

        fs.writeFileSync(
            FILE,
            JSON.stringify(
                this.users,
                null,
                2
            )
        );

    }



    async start(chatId){

        this.states[chatId] = {
            step: "name",
            data:{}
        };


        await this.send(
            chatId,
            "📝 ثبت‌نام شروع شد\n\nنام و نام خانوادگی خود را وارد کنید:"
        );

    }



    async process(chatId,text){


        let state = this.states[chatId];


        if(!state)
            return false;



        if(state.step === "name"){


            state.data.name = text;

            state.step = "phone";


            await this.send(
                chatId,
                "📞 شماره تماس خود را وارد کنید:"
            );

            return true;

        }



        if(state.step === "phone"){


            state.data.phone = text;

            state.step = "course";


            await this.send(
                chatId,
                "📚 دوره مورد نظر را انتخاب کنید:\n\nمبتدی\nمتوسط\nپیشرفته\nIELTS\nخصوصی"
            );


            return true;

        }



        if(state.step === "course"){


            state.data.course = text;


            this.users.push({

                id: chatId,

                ...state.data,

                date:new Date().toLocaleString("fa-IR")

            });



            this.save();


            delete this.states[chatId];


            await this.send(
                chatId,
                "✅ ثبت‌نام شما با موفقیت انجام شد.\n\nکارشناسان آموزشگاه با شما تماس می‌گیرند."
            );


            return true;

        }


    }



}


module.exports = Register;