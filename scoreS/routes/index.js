var express = require('express');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var db = require('./db/mysql');
var router = express.Router();
var start = 0;
var XLSX = require('xlsx');
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
var cur = -1;
var finish = 1;
var confirm = 0;
var tempLog = [];
var tempScore = 0;

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
  var max = -1;
  var min = 101;
  var max_index = -1;
  var min_index = -1;
  var result = 0;

  for(var i=0;i<data.length;i++){
    var sum = 0;
    var score = data[i].score;

    for(var j=1;j<score.length;j++){
      sum += parseInt(score[j]);
    }

    var avg = sum/5;
    result += parseInt(avg);
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

  if( data.length > 2){
    result -= max + min;
    result /= data.length - 2;
  }else{
    if( data.length !== 0 ){
      result /= data.length;
    }
  }
  
  return {max, min, max_index, min_index, result};
}

router.get('/', (req, res, next)=> {
  
});

router.post('/dbtest', (req,res,next)=>{
  
})

router.post('/init', (req, res, next)=> {
  for(let i=0; i < data.len; i++ ){
    data[i].login=0;
  }

  if(finish !== 1){
    connect = [];
  }

  start = 1;
  finish = 0;
  record = [];
  cur = -1;
  res.end();
});

router.post('/getData', (req, res, next)=> {
  res.json({data,finish});
})

router.post('/curData', (req, res, next)=>{
  if(cur > -1){
    let curData = data[cur];
    res.json({cur,curData});
  }else{
    res.json({cur});
  }
})

router.post('/start', (req, res, next)=>{
  const {log} = req.body;

  tempLog = log;
  reconnect = 1;
  cur += 1;
  res.end();
})

router.post('/adminLogin',(req, res, next)=>{
  var auth = 0;

  if(admin === 0){
    auth = 1;
    admin = 1;
  }

  res.json({auth});
})

router.post('/adminLogout',(req, res, next)=>{
  admin = 0;
  start = 0;
  res.end();
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

router.post('/next', (req, res, next)=>{
  const {log} = req.body;

  tempLog = log;
  cur += 1;
  confirm = 0;
  res.end();
})

router.post('/score', (req, res, next)=>{
  const {score, cur, log} = req.body;
  var valid = isValid(score);
  confirm = 1;
  tempScore = valid.result;
  tempLog = log;

  let temp = {
    id: cur, 
    title: data[cur].title,
    score: valid.result
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

  for(let i=0; i<record.length; i++){
    var r = record[i];

    catagory.push(r.title);
    grade.push(r.score);
  }

  res.json({record,catagory,grade});
})

router.post('/reStart', (req, res, next)=>{
  console.log(tempLog);
  res.json({cur, confirm, tempLog, tempScore});
})

module.exports = router;