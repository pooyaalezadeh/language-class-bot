const kb = require("./keyboard");

class Admin {

    constructor(send, users, stats, logger) {

        this.send = send;
        this.users = users;
        this.stats = stats;
        this.logger = logger;

    }

    isAdmin(id) {

        return String(id) === String(process.env.ADMIN_ID);

    }

    async panel(id) {

        if (!this.isAdmin(id))
            return;

        await this.send(

            id,

`👑 پنل مدیریت

به پنل مدیریت ربات خوش آمدید.

یکی از گزینه‌های زیر را انتخاب کنید.`,

            kb.admin

        );

    }

    async usersCount(id) {

        if (!this.isAdmin(id))
            return;

        const count = Object.keys(this.users).length;

        await this.send(

            id,

            `👥 تعداد کاربران

${count} نفر`

        );

    }

    async statsInfo(id) {

        if (!this.isAdmin(id))
            return;

        const s = this.stats.getStats();

        await this.send(

            id,

`📊 آمار ربات

👥 کاربران : ${s.totalUsers}

💬 پیام ها : ${s.totalMessages}

📝 ثبت نام : ${s.totalRegistrations}`

        );

    }

}

module.exports = Admin;