var express = require('express');
var db = require('./db/mysql.js');
var router = express.Router();
var start = 0;
var admin = 0;
var reconnect = 0;

var data = [
  {"id":"1","member":"马海强、徐鑫雨、张　凡 ","title":"二手物品交易网站","github":"https://github.com/WebProject111/web","mobile":"15058613833","login":"0","grade":"82"},
  {"id":"2","member":"郑柳、陈铭璇、王胤凯 ","title":"书籍收藏推荐","github":"https://github.com/xiaxixi/Book-recommendation-collection","mobile":"15990184770","login":"0","grade":"92"},
  {"id":"3","member":"张鑫、祝夏云、组长 ","title":"形体管理","github":"https://github.com/zhangxin1102/zhangxin.github.com","mobile":"18969949128","login":"0","grade":"90"},
  {"id":"4","member":"杨德杰、干臻原、李伊宁 ","title":"代码技术问题社区","mobile":"15990184787","login":"0","grade":"90"},
  {"id":"6","member":"万峰、朱勋韬、谢强 ","title":"聊天室","github":"https://github.com/XQ0118/project-desktop.git","mobile":"17376507894","login":"0","grade":"90"},
  {"id":"7","member":"王绎朝、梅思远 ","title":"Duel - 手势游戏","github":"https://github.com/Darkmota/Duel","mobile":"15990184717","login":"0","grade":"83"},
  {"id":"9","member":"陈豪 ","title":" 微信小程序","github":"https://github.com/15305813298/-","mobile":"15305813298","login":"0","grade":"88"},
  {"id":"14","member":"李帆顺、周渊博 ","title":" mk编辑器","github":"https://github.com/oddisland/Draft","mobile":"15990184849","login":"0","grade":"96"},
  {"id":"5","member":"任亚伟、彭艳 ","title":"Resume Making","github":"https://github.com/natsuRen/web","mobile":"15355468038","login":"0","grade":"0"},
  {"id":"8","member":"罗淳、付朝燕 ","title":"亦书亦音","github":"https://github.com/slcyyy/ysyy","mobile":"15990184855","login":"0","grade":"0"},
  {"id":"10","member":"叶艳洁、蔡雅洁、章薇、陶娣 ","title":" 微信小程序-零拾实验室","github":"https://github.com/PTaoer/WebProgramming","mobile":"15990184827","login":"0","grade":"0"},
  {"id":"11","member":"周威炜、顾晨俊、钱根、张承成 ","title":"论坛","mobile":"18989845722","login":"0","grade":"0"},
  {"id":"12","member":"陈其快、吴震、王鑫、程广友 ","title":"音乐播放器","github":"https://github.com/klaaay/My-Silly-Music-Player","mobile":"15990184811","login":"0","grade":"0"},
  {"id":"13","member":"吴佳琪、陈贵婷、王秸 ","title":"照片编辑器","github":"https://github.com/Fionakiki/Myproject","mobile":"15355467622","login":"0","grade":"0"},
  {"id":"15","member":"陈俊卿、齐聪聪 ","title":" 淘宝","github":"https://github.com/xylkh/web_project  ","mobile":"18989849378","login":"0","grade":"0"},
  {"id":"16","member":"李博乐、孔昊东 ","title":" 影视推荐","github":"https://github.com/eliotkong/web_movie_hznu","mobile":"15990184818","login":"0","grade":"0"}
]

var record = [];
var connect = [];
var finish = 1;
var rateHigh = 0;
var rateLow = 0;

function Reconnect(number){
  var auth = 0;

  for(let i=0; i < connect.length;i++){
    if(connect[i] === number){
      auth = 1;
    }
  }

  return auth;
}

function isValid(data){
  let max = -1;
  let min = 101;
  let max_index = -1;
  let min_index = -1;
  let result = 0;
  let array = [];

  for(var i=0;i<data.length;i++){
    let sum = 0;
    let score = data[i].score;

    for(var j=1;j<score.length;j++){
      sum += parseInt(score[j]);
    }

    let avg = sum/5;
    result += parseInt(avg);
    array.push(avg);
    data[i].avg = avg;

    if(avg > max){ 
      max = avg;
      max_index = i;
    }
    if(avg < min){
      min = avg;
      min_index = i;
    }
  }

  var temp = result;
  result /= data.length;

  let d = Math.sqrt(deviation(array));
  let l = array.length;
  let z = 0;
  for(let i=0; i< array.length; i++){
    z = ( array[i] - result ) / d;

    if(Math.abs(z) > 1.5){
      temp -= array[i];
      l -= 1;
    }
  }
  
  if(l !== 0){
    result = temp / l;
  }
  return {max, min, max_index, min_index, result};
}

function transform(num){
  let l = data.length;
  num = parseInt(num)/100 * l;
  num = Math.round(num);
  return num;
}

function deviation(arr){
  let sum = 0;

  for(let i=0;i<arr.length;i++){
    sum += arr[i];
  }

  let ave = sum / arr.length;
  sum = 0;

  for(let i=0;i<arr.length;i++){
    sum += Math.pow((arr[i] - ave), 2);
  }
  return sum / arr.length;
}

router.post('/init', (req, res, next)=> {
  for(let i=0; i < data.len; i++ ){
    data[i].login=0;
  }

  if(finish !== 1){
    connect = [];
  }

  finish = 0;
  record = [];
  cur = -1;
  res.end();
});

router.post('/adminLogin', (req, res)=>{
  var auth = 0;
  auth = 1;
  res.json({auth});
})

router.post('/login', (req, res) => {
  const { number } = req.body;
  
  var auth = 0;
  if(start === 1){
    for(var i=0;i<data.length;i++){
      if( number === data[i].mobile ){
        auth = 1;
        connect.push(number);
        break;
      }
    }
  }else if(reconnect === 1){
    auth = Reconnect(number);
  }

  res.json({auth});
})

router.post('/score', (req, res, next)=>{
  const {score, cur} = req.body;
  var valid = isValid(score);
  confirm = 1;
  tempScore = valid.result;

  let temp = {
    id: cur, 
    title: data[cur].title,
    score: parseInt(valid.result)
  };

  record.push(temp);
  res.json({
    result: valid
  })
})

router.post('/finish', (req, res, next)=>{
  start = 0;
  finish = 1;
  var catagory = [];
  var grade = [];
  let highScore = 0;
  let wellScore = 0;
  let middleScore = 0;
  let passScore = 0;

  for(let i=0; i<record.length; i++){
    var r = record[i];
    db.update('user', {grade: r.score}, {title: r.title});

    catagory.push(r.title);
    grade.push(r.score);

    if(r.score >= 90){
      highScore += 1;
    }else if(r.score >= 80){
      wellScore += 1;
    }else if(r.score >= 70){
      middleScore += 1;
    }else passScore += 1;
  }

  highRate = highScore / record.length;
  wellRate = wellScore / record.length;
  middleRate = middleScore / record.length;
  passRate = passScore / record.length;

  res.json({record, catagory, grade, highRate, wellRate, middleRate, passRate});
})

router.post('/setRate', (req, res, next)=>{
  const {hightScoreRate, lowScoreRate} = req.body;
  rateHigh = hightScoreRate;
  rateLow = lowScoreRate;
  start = 1;
  
  res.end();
})

router.post('/getRate', (req, res, next)=>{
  var high = transform(rateHigh);
  var low = transform(rateLow);
  var length = data.length;

  res.json({high, low, length});
})

module.exports = router;