var express = require('express');
var router = express.Router();

var connect = [];
var nameList = [];

function generateName(){
  const str = "12345ABCDEFGHIJKKLMNOPQRSTUVWXYZ";
  let name = [];

  for(var i=0;i<4;i++){
    let index = parseInt( Math.random()*str.length );
    let chr = str[index];
    name.push(chr);
  }

  return name.join('');
}

function getName(){
  let name = generateName();
  let index = nameList.indexOf(name);
  while(index !== -1){
    name = generateName();
    index = nameList.indexOf(name);
  }
  nameList.push(name);
  return name;
}

function find(num){
  let name = null;
  for(let c in connect){
    if(c === num){
      return connect[c];
    }
  }
  return name;
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/init',function(req,res,next) {
  connect = [];
  nameList = [];
  res.end();
})

router.post('/getName', function(req, res, next){
  const {num} = req.body;
  var name = find(num);

  if(name === null){
    name = getName();
    connect[num] = name;
  }

  if(num == '123'){
    name = 'no';
  }
  res.json({name});
})

function toNames(names,numbers){
  for(let i=0;i<numbers.length;i++){
    let name = getName();
    let num = numbers[i];

    names[num] = name;
  }
}

router.post('/getAllName',async (req, res, next)=>{
  let data = [ 'WDM4','HMFY','UYL5','GHME','QY1W','NZHG','T2RA','3ASU','AKV4','LVOD','KTID','CZ1B','NLSE','Z1BU','SSQP','HH3P' ];

  res.send({data});
})

router.post('/score', function(req, res, next) {
  res.end();
})

module.exports = router;
