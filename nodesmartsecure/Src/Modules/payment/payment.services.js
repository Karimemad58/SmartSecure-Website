const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');

router.get('/', (req, res) => {
  const payment_id = req.query.payment_id;

  if (!payment_id || payment_id == '%') {
    db.query("SELECT * FROM payment", function (err, result) {
      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM payment WHERE payment_id = ?",
      [payment_id],
      function (err, result) {
        if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {

  const {
    user_id,
    reservation_id,
    amount,
    method,
    status,
    transaction_date
  } = req.body;

  db.query(
    "INSERT INTO payment (user_id, reservation_id, amount, method, status, transaction_date) VALUES (?,?,?,?,?,?)",
    [user_id, reservation_id, amount, method, status, transaction_date],
    function(err, result) {

      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });

      res.json({
        Status: "OK",
        Message: "Payment Added Successfully",
        payment_id: result.insertId
      });

    }
  );

});

router.put('/', (req, res) => {

  const payment_id = req.query.payment_id;

  const {
    user_id,
    reservation_id,
    amount,
    method,
    status,
    transaction_date
  } = req.body;

  db.query(
    "UPDATE payment SET user_id=?, reservation_id=?, amount=?, method=?, status=?, transaction_date=? WHERE payment_id=?",
    [user_id, reservation_id, amount, method, status, transaction_date, payment_id],
    (err, result) => {

      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });

      res.json({
        Status:"OK",
        Message:"Payment Updated Successfully"
      });

    }
  );

});

router.delete('/', (req, res) => {

  const payment_id = req.query.payment_id;

  db.query(
    "DELETE FROM payment WHERE payment_id = ?",
    [payment_id],
    (err, result) => {

      if (err) return res.status(500).json({ Status: "Error", Message: err.sqlMessage || "Database error" });

      res.json({
        Status: "OK",
        Message: "Payment Deleted Successfully"
      });

    }
  );

});

router.get('/search', (req, res) => {

  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql = "SELECT * FROM payment WHERE " + keyword + " = ? ORDER BY payment_id " + sort;

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