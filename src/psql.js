const express = require('express');
const router = express.Router();

router.get('/', function (req, res, err) {
    console.log("       /upload.js :::: status : arrived");

    // req.params
    // ex) www.~~~.com/post/100/hello
    //      req.params.id == 100
    //      req.params.name == hello
    console.log(req.params);

    // req.query
    // Get 요청을 처리한다.
    // ex) www.~~~.com/post?title=yaho
    //      req.query.title == yaho
    console.log(req.query);

    // req.body
    // POST 요청을 처리함
    // formdata
    // 키-값 데이터 쌍 구조
    console.log(req.body);

    let param1 = req.query.param1
    let param2 = req.query.param2
    let name = req.query.name
    const data = {
        param1: param1,
        param2: param2,
        name: name,
    }

    res.render('upload', {
        data: data
    })
});
module.exports = router;
