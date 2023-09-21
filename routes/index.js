var express = require('express');
var router = express.Router();
const pg = require("pg");

const client = new pg.Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'testDB',
  port: 5432,
  max: 5,
})

client.connect(err => {
  if (err) {
    console.log('Failed to connect db ' + err)
  } else {
    console.log('Connect to db done!')
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/dashboard', function (req, res, next) {
  res.render('dashboard', {title: 'Express'});
});

/* GET home page. */
router.get('/list', function (req, res, next) {
  res.render('list', {title: 'Express'});
});

/* GET home page. */
router.get('/modal', function (req, res, next) {
  res.render('modal', {title: 'Express'});
  console.log("       /index.js :::: status : arrived");

  // const data = {
  //   // 임시로 넣은 값들입니다.
  //   param1: "null_1",
  //   param2: "null_2",
  //   name: "name_test_1",
  // }

  res.render('index', {data: data,});
});

// router.get('/list/:page', function(req, res, next) {
//   var page = req.params.page;
//   const query = {
//     text: "SELECT * FROM view_expense_ledger",
//   };
//   client.query(query, function (err, rows) {
//     if (err) console.error("err : " + err);
//     rows.render('list', {title: '게시판 리스트', rows: rows});
//     console.log(rows,res)
//   });
// });



module.exports = router;
