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
    if(Reconnect(number)){
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
    // db.update('user', {grade: r.score}, {title: r.title});

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