var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

var random = [];
var backup = [];

function randomSort(a,b){
    return Math.random() > 0.5 ? -1: 1;
}

router.post('/getGroup', (req, res, next)=>{
    db.select(['title','number','github','grade'],'user',{},res);
})

router.post('/addGroup', (req, res, next)=>{
    const {data} = req.body;

    db.insert('user',data);
    res.end();
})

router.post('/random', (req, res, next)=>{
    if(random.length === 0){
        const {group} = req.body;
        backup = group.slice();
        random = group.slice();
        random.sort(randomSort);

        res.json({random});
    }else{
        res.json({group: random, backup});
    }
})

router.post('/getMember', (req, res, next)=>{
    const {id} = req.body;

    db.select(['name'], 'student', {group_id: id}, res);
})

module.exports = router;
