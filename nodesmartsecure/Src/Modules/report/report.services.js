const mysql = require('mysql');
const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');


// GET REPORTS
router.get('/', (req, res) => {
  const report_id = req.query.report_id;

  if (!report_id || report_id == '%') {
    db.query("SELECT * FROM report", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM report WHERE report_id = ?",
      [report_id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
});


// INSERT REPORT
router.post('/', (req, res) => {

  const {
    user_id,
    report_type,
    status,
    generation_mode,
    period_start,
    period_end,
    generated_at
  } = req.body;

  db.query(
    "INSERT INTO report (`user_id`,`report_type`,`status`,`generation_mode`,`period_start`,`period_end`,`generated_at`) VALUES (?,?,?,?,?,?,?)",
    [user_id, report_type, status, generation_mode, period_start, period_end, generated_at],
    function(err, result) {
      if(err) throw err;
      res.json({
        Status: "OK",
        Message: "Report Added Successfully with Id " + result.insertId
      });
    }
  );
});


// UPDATE REPORT
router.put('/', (req, res) => {

  const report_id = req.query.report_id;

  const {
    user_id,
    report_type,
    status,
    generation_mode,
    period_start,
    period_end,
    generated_at
  } = req.body;

  db.query(
    "UPDATE report SET `user_id`=?, `report_type`=?, `status`=?, `generation_mode`=?, `period_start`=?, `period_end`=?, `generated_at`=? WHERE report_id=?",
    [user_id, report_type, status, generation_mode, period_start, period_end, generated_at, report_id],
    (err, result) => {
      if(err) throw err;
      res.json({
        Status:"OK",
        Message:"Report Updated Successfully"
      });
    }
  );
});


// DELETE REPORT
router.delete('/', (req, res) => {

  const report_id = req.query.report_id;

  db.query(
    "DELETE FROM report WHERE report_id = ?",
    [report_id],
    (err, result) => {
      if (err) throw err;
      res.json({
        Status: "OK",
        Message: "Report Deleted Successfully"
      });
    }
  );
});

module.exports = router;