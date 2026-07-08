const data = require("./data");

class AI {
  constructor() {
    this.rules = [
      {
        keywords: ["کلاس", "برنامه", "روز", "زمان"],
        answer: data.schedule,
      },
      {
        keywords: ["آدرس", "کجا", "باغ فیض"],
        answer: data.address,
      },
      {
        keywords: ["شماره", "تلفن", "تماس"],
        answer: data.phone,
      },
      {
        keywords: ["استاد", "مدرس", "مریم", "بقایی"],
        answer: data.teacher,
      },
      {
        keywords: ["شهریه", "هزینه", "قیمت", "آیلتس", "خصوصی"],
        answer: data.price,
      },
      {
        keywords: ["دوره", "کلاس", "آموزش"],
        answer: data.classes,
      },
    ];
  }

  reply(text) {
    if (!text) return null;

    const input = text.toLowerCase().trim();

    for (const rule of this.rules) {
      for (const keyword of rule.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return rule.answer;
        }
      }
    }

    return null;
  }
}

module.exports = AI;