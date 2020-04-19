var mysql = require('mysql');

App = {
  log: function(){
  var user = document.getElementById("username").value;
  var pass = document.getElementById("password").value;
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_client"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO customers (name, pass) VALUES ('" + user + "', '" + pass + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });

}
}