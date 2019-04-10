var express = require('express');
var db = require('./db/mysql.js');
var router = express.Router();
var start = 0;
var admin = 0;
var reconnect = 0;

var data = []
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

router.post('/setData', (req, res)=>{
  const {group} = req.body;
  data = group.slice();
  res.end();
})

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
      if( number === data[i].mobile && data[i].login === "0"){
        auth = 1;
        data[i].login = "1";
        connect.push(number);
        break;
      }
    }
  }else if(reconnect === 1){
    console.log(number);
    if(Reconnect(number)){
      console.log(1);
      auth = 2;
    }else auto = 0;
  }

  res.json({auth});
})

router.post('/start', (req, res) =>{
  start = 0;
  reconnect = 1;
  res.end();
})

router.post('/score', (req, res, next)=>{
  const {score, cur, group} = req.body;
  var valid = isValid(score);
  confirm = 1;
  tempScore = valid.result;

  let temp = {
    id: cur, 
    title: group.title,
    member: group.member,
    number: group.mobile,
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
  record.sort(function(a,b){return b.score-a.score;});

  res.json({record});
})

router.post('/setRate', (req, res, next)=>{
  const {hightScoreRate, lowScoreRate} = req.body;
  rateHigh = hightScoreRate/100;
  rateLow = lowScoreRate/100;
  start = 1;
  
  res.end();
})

function addUp(array){
  let s = 0;
  for(let i=0; i< array.length; i++){
    s += parseInt(array[i]);
  }
  return s;
}

router.post('/getRate', (req, res, next)=>{
  var sum = (data.length - 1) * 5;
  var vote = [0,0,0,0,0];

  vote[0] = parseInt(sum * rateHigh * 0.25);
  vote[1] = parseInt(sum * rateHigh * 0.75);
  vote[4] = parseInt(sum * rateLow);
  
  var left = sum * (1- rateHigh - rateLow);
  vote[2] = parseInt(left * 0.4);
  vote[3] = parseInt(left * 0.6);
  
  while(addUp(vote) !== sum){
    vote[2] += 1;
  }

  res.json({vote, length: data.length});
})

module.exports = router;