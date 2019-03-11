var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

router.post('/', function(req, res, next) {
    
});

router.post('/getGroup', (req, res, next)=>{
    db.select(['title','number','grade'],'user',{},res);
})

router.post('/addGroup', (req, res, next)=>{
    const {data} = req.body;

    db.insert('user',data);
    res.end();
})

module.exports = router;