import React from "react";
import { openDatabase } from "react-native-sqlite-storage";

const errorCB = err => {
	console.log("SQL Error: " + err);
};

const openCB = () => {
	console.log("Database OPENED");
};

const _database = openDatabase(
	{ name: "evidencija_voznje.db" },
	openCB,
	errorCB(this)
);

class DatabaseService {
	createTables = () => {
		let sql =
			"CREATE TABLE IF NOT EXISTS user(" +
			"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
			"username TEXT, " +
			"token TEXT" +
			")";
		_database.transaction(tx => {
			tx.executeSql(sql, [], (tx, results) => {});
		});

		sql =
			"CREATE TABLE IF NOT EXISTS gps_data(" +
			"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
			"latitude TEXT, " +
			"longitude TEXT, " +
			"vehicle TEXT, " +
			"date DATETIME" +
			")";
		_database.transaction(tx => {
			tx.executeSql(sql, [], (tx, results) => {});
		});
	};

	insertIntoUserTable = (token, username) => {
		let sql =
			"INSERT INTO user(token,username) VALUES('" +
			token +
			"', '" +
			username +
			"');";
		_database.transaction(tx => {
			tx.executeSql(sql, [], (tx, results) => {});
		});
	};

	insertIntoDataTable = (lat, lng, vehicle, date) => {
		let sql =
			"INSERT INTO gps_data(latitude,longitude,vehicle, date) VALUES('" +
			lat +
			"', '" +
			lng +
			"', '" +
			vehicle +
			"', '" +
			date +
			"');";
		_database.transaction(tx => {
			tx.executeSql(sql, [], (tx, results) => {});
		});
	};

	readFromTable = async table => {
		let sql = "SELECT * FROM " + table;
		var promise = new Promise((resolve, reject) => {
			_database.transaction(
				tx => {
					tx.executeSql(sql, [], (tx, results) => {
						var len = results.rows.length;
						let data = [];
						for (let i = 0; i < len; i++) {
							let row = results.rows.item(i);
							data.push(row);
						}
						resolve(data);
					});
				},
				null,
				null
			);
		}).then(values => {
			return values;
		});
		return promise;
	};

	deleteFromTable = async table => {
		let sql = "DELETE FROM " + table;
		var promise = new Promise(function(resolve, reject) {
			let data = [];
			_database.transaction(tx => {
				tx.executeSql(sql, [], (tx, results) => {});
			});
			resolve(data);
		});
		return promise;
	};

	dropTable = async table => {
		let sql = "DROP TABLE " + table;
		var promise = new Promise(function(resolve, reject) {
			let data = [];
			_database.transaction(tx => {
				tx.executeSql(sql, [], (tx, results) => {});
			});
			resolve(data);
		});
		return promise;
	};
}

export default DatabaseService;
