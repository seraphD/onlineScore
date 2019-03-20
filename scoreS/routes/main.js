var express = require('express');
var router = express.Router();
var db = require('./db/mysql');

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
    const {group} = req.body;
    let pre = group.slice();
    group.sort(randomSort);
    let dis = [];
    
    for(let i=0;i<group.length;i++){
        let g = pre[i];
        let index = group.indexOf(g);
        
        dis.push(index - i);
    }

    res.json({group,dis});
})

router.post('/getMember', (req, res, next)=>{
    const {id} = req.body;

    db.select(['name'], 'student', {group_id: id}, res);
})


module.exports = router;
