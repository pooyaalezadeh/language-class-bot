const data = require("../data");

module.exports = function faq(text){

text = text.toLowerCase();


if(
text.includes("شهریه") ||
text.includes("قیمت") ||
text.includes("هزینه")
){
return data.prices;
}


if(
text.includes("کلاس") ||
text.includes("دوره")
){
return data.classes;
}


if(
text.includes("آدرس") ||
text.includes("کجا")
){
return data.address;
}


if(
text.includes("استاد") ||
text.includes("مدرس")
){
return data.teacher;
}


return null;

};