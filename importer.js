var parse = require('csv-parse');
var fs = require('fs');
var util = require('util');
var sqlite = require('sqlite3');

var db = new sqlite.Database('BabyCare_updated.db');

fs.readFile('BabyCareData.csv', function(err, data){
	parse(data.toString(), {columns:true}, function(err, records){
		var query = db.prepare("INSERT OR REPLACE into event_v2 (eventtype,subtype,amount,duration,_eventid,_babyid,createtime,updatetime,endtime,status,recordstatus,mark,starttime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ");
		records.forEach(function(values){
			query.run([
				values.eventtype,
				values.subtype,
				values.amount,
				values.duration,
				values._eventid,
				values._babyid,
				values.createtime,
				values.updatetime,
				values.endtime,
				values.status,
				values.recordstatus,
				values.mark,
				values.starttime
			]);
		});
	});
});


