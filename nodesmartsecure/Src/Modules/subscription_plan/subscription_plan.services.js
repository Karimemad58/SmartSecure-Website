const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');

router.get('/', (req, res) => {
  var plan_id = req.query.plan_id;

  if (!plan_id || plan_id == '%') {
    db.query("SELECT * FROM subscription_plan", function (err, result) {
      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM subscription_plan WHERE plan_id = ?",
      [plan_id],
      function (err, result) {
        if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {
  const { name, description, price, duration_days, discount_rate, locker_access, is_active } = req.body;

  db.query(
    "INSERT INTO subscription_plan (`name`,`description`,`price`,`duration_days`,`discount_rate`,`locker_access`,`is_active`) VALUES (?,?,?,?,?,?,?)",
    [name, description, price, duration_days, discount_rate, locker_access, is_active],
    function(err, result){
      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
      res.json({
        Status: "OK",
        Message: "Plan Added Successfully with Id " + result.insertId
      });
    }
  );
});

router.put('/', (req, res) => {
  const plan_id = req.query.plan_id;

  const { name, description, price, duration_days, discount_rate, locker_access, is_active } = req.body;

  db.query(
    "UPDATE subscription_plan SET `name`=?, `description`=?, `price`=?, `duration_days`=?, `discount_rate`=?, `locker_access`=?, `is_active`=? WHERE plan_id=?",
    [name, description, price, duration_days, discount_rate, locker_access, is_active, plan_id],
    (err, result) => {
      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
      res.json({
        Status:"OK",
        Message:"Plan Updated Successfully"
      });
    }
  );
});

router.delete('/', (req, res) => {
  const plan_id = req.query.plan_id;

  db.query(
    "DELETE FROM subscription_plan WHERE plan_id=?",
    [plan_id],
    (err, result) => {
      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
      res.json({
        Status:"OK",
        Message:"Plan Deleted Successfully"
      });
    }
  );
});

router.get('/search', (req, res) => {

  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql = "SELECT * FROM subscription_plan WHERE " + keyword + " = ? ORDER BY plan_id " + sort;

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
