var parse = require('csv-parse');
var fs = require('fs');
var util = require('util');
var sqlite = require('sqlite3');
var path = require('path');
var _ = require('lodash');

var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var basePath = path.join(homepath, 'Dropbox','BabyCareApp');
var CSVPath = path.join(basePath, 'BabyCareData.csv');
var DBPathOrg = path.join(basePath, 'BabyCare.db');
var DBPathAlt = path.join(basePath, 'BabyCare-altered.db');

var Importer = {
	run: function() {
		this.copydb();
		fs.readFile(CSVPath, this.csvParse);
	},
	copydb: function(){
		fs.writeFileSync(DBPathAlt, fs.readFileSync(DBPathOrg));
	},
	csvParse: function(err, data){
		parse(data.toString(), {columns:true}, this.dbImport);
	},
	dbImport: function(err, records){
		var db = new sqlite.Database(DBPathAlt);

		var query = db.prepare("INSERT OR REPLACE into event_v2 (eventtype,subtype,amount,duration,_eventid,_babyid,createtime,updatetime,endtime,status,recordstatus,mark,starttime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ");
		records.forEach(function(values){
			values = _.mapValues(values, function(value){
				return (_.isEmpty(value)) ? null : value;
			});
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
	}
};

module.exports = _.bindAll(Importer);


