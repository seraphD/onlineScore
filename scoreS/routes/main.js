var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

router.post('/', function(req, res, next) {
    
});

router.post('/getGroup', (req, res, next)=>{
    db.select(['title','number','grade'],'user',{},res);
})

module.exports = router;