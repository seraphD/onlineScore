var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

function randomSort(a,b){
    return Math.random() > 0.5 ? -1: 1;
}

router.post('/', function(req, res, next) {
    
});

router.post('/getGroup', async (req, res, next)=>{
    db.select(['title','number','grade'],'user',{},res);
})

router.post('/addGroup', (req, res, next)=>{
    const {data} = req.body;

    db.insert('user',data);
    res.end();
})

router.post('/random',async (req, res, next)=>{
    const {group} = req.body;
    group.sort(randomSort);

    res.json({group});
})

router.post('/test', (req,res,next)=>{
    const {table, field, filter};
    
})

module.exports = router;