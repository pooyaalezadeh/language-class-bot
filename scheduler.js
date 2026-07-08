const cron = require("node-cron");
const fs = require("fs");
const motivations = require("./motivations");

module.exports = function(send){

    cron.schedule("0 9 * * *", async ()=>{

        const users = JSON.parse(
            fs.readFileSync("./database/users_list.json")
        );

        for(const chatId of users){

            const random =
                motivations[
                    Math.floor(
                        Math.random() * motivations.length
                    )
                ];

            await send(chatId, random);

        }

        console.log("✅ Daily motivational message sent.");

    });

};