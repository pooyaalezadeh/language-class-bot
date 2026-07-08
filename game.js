const words = require("./words");

class Game {

    constructor(send){
        this.send = send;
        this.players = {};
    }

    async start(chatId){

        const random =
            words[Math.floor(Math.random() * words.length)];

        this.players[chatId] = random;

        await this.send(
            chatId,
`🎮 بازی لغات

🇬🇧 معنی این کلمه چیست؟

${random.word}

✍️ پاسخ را ارسال کنید.`
        );

    }

    async check(chatId, text){

        if(!this.players[chatId]){
            return false;
        }

        const question = this.players[chatId];

        if(text.trim() === question.answer){

            delete this.players[chatId];

            await this.send(
                chatId,
"🎉 آفرین!\n\n✅ پاسخ صحیح بود."
            );

        }else{

            await this.send(
                chatId,
`❌ پاسخ اشتباه است.

دوباره تلاش کن.`
            );

        }

        return true;
    }

}

module.exports = Game;