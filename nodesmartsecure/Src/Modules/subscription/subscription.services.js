const express = require("express");
const router = express.Router();
router.use(express.json());
const db = require("../../db/connection");

router.get("/", (req, res) => {
  var subscription_id = req.query.subscription_id;

  if (!subscription_id || subscription_id == "%") {
    db.query("SELECT * FROM subscription", function (err, result) {
      if (err)
        return res.status(500).json({
          Status: "Error",
          Message: err.sqlMessage || "Database error",
        });
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM subscription WHERE subscription_id = ?",
      [subscription_id],
      function (err, result) {
        if (err)
          return res.status(500).json({
            Status: "Error",
            Message: err.sqlMessage || "Database error",
          });
        res.json(result);
      },
    );
  }
});

router.post("/", (req, res) => {
  const {
    user_id,
    plan_id,
    status,
    start_date,
    end_date,
    auto_renew,
    last_payment_id,
  } = req.body;

  db.query(
    "INSERT INTO subscription (`user_id`,`plan_id`,`status`,`start_date`,`end_date`,`auto_renew`,`last_payment_id`) VALUES (?,?,?,?,?,?,?)",
    [
      user_id,
      plan_id,
      status,
      start_date,
      end_date,
      auto_renew,
      last_payment_id,
    ],
    function (err, result) {
      if (err)
        return res.status(500).json({
          Status: "Error",
          Message: err.sqlMessage || "Database error",
        });
      res.json({
        Status: "OK",
        Message: "Subscription Added Successfully with Id " + result.insertId,
      });
    },
  );
});

router.put("/", (req, res) => {
  const subscription_id = req.query.subscription_id;

  const {
    user_id,
    plan_id,
    status,
    start_date,
    end_date,
    auto_renew,
    last_payment_id,
  } = req.body;

  db.query(
    "UPDATE subscription SET `user_id`=?, `plan_id`=?, `status`=?, `start_date`=?, `end_date`=?, `auto_renew`=?, `last_payment_id`=? WHERE subscription_id=?",
    [
      user_id,
      plan_id,
      status,
      start_date,
      end_date,
      auto_renew,
      last_payment_id,
      subscription_id,
    ],
    (err, result) => {
      if (err)
        return res.status(500).json({
          Status: "Error",
          Message: err.sqlMessage || "Database error",
        });
      res.json({
        Status: "OK",
        Message: "Subscription Updated Successfully",
      });
    },
  );
});

router.delete("/", (req, res) => {
  const subscription_id = req.query.subscription_id;

  db.query(
    "DELETE FROM subscription WHERE subscription_id=?",
    [subscription_id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          Status: "Error",
          Message: err.sqlMessage || "Database error",
        });
      res.json({
        Status: "OK",
        Message: "Subscription Deleted Successfully",
      });
    },
  );
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql =
    "SELECT * FROM subscription WHERE " +
    keyword +
    " = ? ORDER BY subscription_id " +
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
