const mysql = require("mysql2");
const express = require("express");
const router = express.Router();
router.use(express.json());

const db = require("../../db/connection");

router.get("/", (req, res) => {
  var device_id = req.query.device_id;

  if (!device_id || device_id == "%") {
    db.query("SELECT * FROM smart_device", function (err, result) {
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
      "SELECT * FROM smart_device WHERE device_id = ?",
      [device_id],
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

router.post("/", (req, res) => {
  const { serial_number, firmware_version, status, location_id } = req.body;

  db.query(
    "INSERT INTO smart_device (`serial_number`,`firmware_version`,`status`,`location_id`) VALUES (?,?,?,?)",
    [serial_number, firmware_version, status, location_id],
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
        Message: "Device Added Successfully with Id " + result.insertId,
      });
    },
  );
});

router.put("/", (req, res) => {
  const device_id = req.query.device_id;

  const { serial_number, firmware_version, status, location_id } = req.body;

  db.query(
    "UPDATE smart_device SET `serial_number`=?, `firmware_version`=?, `status`=?, `location_id`=? WHERE device_id=?",
    [serial_number, firmware_version, status, location_id, device_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json({ Status: "OK", Message: "Device Updated Successfully" });
    },
  );
});

router.delete("/", (req, res) => {
  const device_id = req.query.device_id;

  db.query(
    "DELETE FROM smart_device WHERE device_id = ?",
    [device_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
      res.json({ Status: "OK", Message: "Device Deleted Successfully" });
    },
  );
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql =
    "SELECT * FROM smart_device WHERE " +
    keyword +
    " = ? ORDER BY device_id " +
    sort;

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
