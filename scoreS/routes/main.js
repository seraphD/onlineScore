var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

var random = [];

function randomSort(a,b){
    return Math.random() > 0.5 ? -1: 1;
}

function findGroup(group,number){
    let index = -1;

    for(let i=0;i<group.length;i++){
        if(group[i].number === number){
            index = i;
        }
    }

    return index;
}

router.post('/', function(req, res, next) {
    
});

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
        let pre = group.slice();
        group.sort(randomSort);
        random = group.slice();

        res.json({group});
    }else{
        res.json({group: random});
    }
})

router.post('/getMember', (req, res, next)=>{
    const {id} = req.body;

    db.select(['name'], 'student', {group_id: id}, res);
})


module.exports = router;
