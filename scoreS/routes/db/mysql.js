const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'online_scoe'
});

/* 
	Mysql select方法
	第一个参数为要查询的字段,* 表示全部查询，否则用一个数组表示查询的字段 如['id','title']
	第二个参数为要查询的表，暂时没有表联合功能
	第三个蚕食为删选条件，用一个对象表示，如 {id:1}
*/
exports.select = (field , table, filter, res) =>{
	var f = '';
	if(field === '*')f = '*';
	else{
		for(let i=0;i<field.length;i++){
			let fi = field[i];

			if(i<field.length-1){
				f += fi + ',';
			}else f += fi;
		}
	}

	var fl = '';
	if(JSON.stringify(filter) !== '{}'){
		fl = "where";
		console.log(fl);
		for(var p in filter){
			fl += p + "=" + filter[p];
			console.log(fl);
		}
		fl.splice(fl.length-1,1);
	}

	let sql = `select ${f} from ${table} ${fl};`;
	connection.query(sql, (err, results)=>{
		if(err)throw err;
		else{
			res.json(results);
		}
	})
}
