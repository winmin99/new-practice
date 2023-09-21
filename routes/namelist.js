import express  from "express";
const router = express.Router();

import postgresql from '../middlewares/postgresql';


router.get("/", function (req, res, next) {
    postgresql.executeQuery(`SELECT * FROM "code_table";`, function (error, result) {
        if (error) {
            throw error;
        }
        res.status(200).json({
            data: result.rows,
        });
    });
});

module.exports = router;




