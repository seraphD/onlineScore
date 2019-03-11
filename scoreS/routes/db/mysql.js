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
	第三个参数为删选条件，用一个对象表示，如 {id:1}
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

		for(var p in filter){
			fl += p + "=" + filter[p] + "&&";
		}
		fl.substr(fl.length-2,2);
	}

	let sql = `select ${f} from ${table} ${fl};`;
	connection.query(sql, (err, results)=>{
		if(err)throw err;
		else{
			res.json(results);
			return results;
		}
	})
}

/*
	Mysql插入函数，table是要插入的表，datas是要插入的记录的数组
	插入的记录要完全按照表格的格式
*/

exports.insert = (table,datas) =>{
	for(var data of datas){
		let v = "";
		let value = "";

		for(let p in data){
			v += p + ',';
			if(typeof(data[p]) === 'string'){
				value += `'${data[p]}',`;
			}else value += `${data[p]},`;
		}

		v = v.substr(0, v.length-1);
		value = value.substr(0, value.length-1);

		let sql = `insert into ${table} (${v}) values(${value});`;
		connection.query(sql, (err, results)=>{
			if(err)throw err;
		})
	}
}

exports.update = (table,field,filter) => {
	let set = "";
	if(JSON.stringify(field) !== '{}'){
		for(let p in field){
			set += p + "=" + field[p] + ","; 
		}
		set.substr(set.length-1,1);
	}else return;

	let fl = "";
	if(JSON.stringify(filter) !== '{}'){
		fl = "where";

		for(var p in filter){
			fl += p + "=" + filter[p] + "&&";
		}
		fl.substr(fl.length-2,2);
	}

	let sql = `update ${table} set ${set} ${fl}`;
	connection.query(sql, (err,results)=>{
		if(err)throw err;
	})
}