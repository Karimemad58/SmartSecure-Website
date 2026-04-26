const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('../../db/connection');

router.get('/', (req, res) => {

  const reservation_id = req.query.reservation_id;

  if (!reservation_id || reservation_id == '%') {

    db.query("SELECT * FROM reservation", function (err, result) {
      if (err) throw err;
      res.json(result);
    });

  } else {

    db.query(
      "SELECT * FROM reservation WHERE reservation_id = ?",
      [reservation_id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );

  }

});

router.post('/', (req, res) => {

  const {
    user_id,
    locker_id,
    start_time,
    end_time,
    status,
    total_amount,
    created_at
  } = req.body;

  db.query(
    "INSERT INTO reservation (user_id, locker_id, start_time, end_time, status, total_amount, created_at) VALUES (?,?,?,?,?,?,?)",
    [user_id, locker_id, start_time, end_time, status, total_amount, created_at],
    function(err, result) {

      if(err) throw err;

      res.json({
        Status: "OK",
        Message: "Reservation Added Successfully",
        reservation_id: result.insertId
      });

    }
  );

});

router.put('/', (req, res) => {

  const reservation_id = req.query.reservation_id;

  const {
    user_id,
    locker_id,
    start_time,
    end_time,
    status,
    total_amount,
    created_at
  } = req.body;

  db.query(
    "UPDATE reservation SET user_id=?, locker_id=?, start_time=?, end_time=?, status=?, total_amount=?, created_at=? WHERE reservation_id=?",
    [user_id, locker_id, start_time, end_time, status, total_amount, created_at, reservation_id],
    (err, result) => {

      if(err) throw err;

      res.json({
        Status:"OK",
        Message:"Reservation Updated Successfully"
      });

    }
  );

});

router.delete('/', (req, res) => {

  const reservation_id = req.query.reservation_id;

  db.query(
    "DELETE FROM reservation WHERE reservation_id = ?",
    [reservation_id],
    (err, result) => {

      if (err) throw err;

      res.json({
        Status: "OK",
        Message: "Reservation Deleted Successfully"
      });

    }
  );

});

module.exports = router;