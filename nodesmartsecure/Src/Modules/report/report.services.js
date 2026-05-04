const mysql = require("mysql2");
const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../../db/connection");

// GET REPORTS
router.get("/", (req, res) => {
  const report_id = req.query.report_id;

  if (!report_id || report_id == "%") {
    db.query("SELECT * FROM report", function (err, result) {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM report WHERE report_id = ?",
      [report_id],
      function (err, result) {
        if (err)
          return res
            .status(500)
            .json({
              Status: "Error",
              Message: err.sqlMessage || "Database error",
            });
        res.json(result);
      },
    );
  }
});

// INSERT REPORT
router.post("/", (req, res) => {
  const {
    user_id,
    report_type,
    status,
    generation_mode,
    period_start,
    period_end,
    generated_at,
  } = req.body;

  db.query(
    "INSERT INTO report (`user_id`,`report_type`,`status`,`generation_mode`,`period_start`,`period_end`,`generated_at`) VALUES (?,?,?,?,?,?,?)",
    [
      user_id,
      report_type,
      status,
      generation_mode,
      period_start,
      period_end,
      generated_at,
    ],
    function (err, result) {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json({
        Status: "OK",
        Message: "Report Added Successfully with Id " + result.insertId,
      });
    },
  );
});

// UPDATE REPORT
router.put("/", (req, res) => {
  const report_id = req.query.report_id;

  const {
    user_id,
    report_type,
    status,
    generation_mode,
    period_start,
    period_end,
    generated_at,
  } = req.body;

  db.query(
    "UPDATE report SET `user_id`=?, `report_type`=?, `status`=?, `generation_mode`=?, `period_start`=?, `period_end`=?, `generated_at`=? WHERE report_id=?",
    [
      user_id,
      report_type,
      status,
      generation_mode,
      period_start,
      period_end,
      generated_at,
      report_id,
    ],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json({
        Status: "OK",
        Message: "Report Updated Successfully",
      });
    },
  );
});

// DELETE REPORT
router.delete("/", (req, res) => {
  const report_id = req.query.report_id;

  db.query(
    "DELETE FROM report WHERE report_id = ?",
    [report_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json({
        Status: "OK",
        Message: "Report Deleted Successfully",
      });
    },
  );
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql =
    "SELECT * FROM report WHERE " + keyword + " = ? ORDER BY report_id " + sort;

  db.query(sql, [keyvalue], (err, result) => {
    if (err) {
      res.json({ Status: "Error", Message: err });
    } else {
      res.json(result);
      console.log(result);
    }
  });

  console.log("Incoming SEARCH Request");
});

module.exports = router;
