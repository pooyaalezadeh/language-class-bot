const questions = [
    {
    q:"Apple یعنی؟",
    a:"سیب"
    },
    {
    q:"Book یعنی؟",
    a:"کتاب"
    },
    {
    q:"House یعنی؟",
    a:"خانه"
    }
    ];
    
    
    module.exports = function game(){
    
    let item =
    questions[
    Math.floor(Math.random()*questions.length)
    ];
    
    
    return `
    🎮 بازی زبان
    
    ترجمه کن:
    
    🇬🇧 ${item.q}
    
    جواب را ارسال کن 😊
    `;
    
    };