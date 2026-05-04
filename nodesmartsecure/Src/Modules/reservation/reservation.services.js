const express = require("express");
const router = express.Router();
router.use(express.json());

const db = require("../../db/connection");

router.get("/", (req, res) => {
  const reservation_id = req.query.reservation_id;

  if (!reservation_id || reservation_id == "%") {
    db.query("SELECT * FROM reservation", function (err, result) {
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
      "SELECT * FROM reservation WHERE reservation_id = ?",
      [reservation_id],
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
  const { user_id, locker_id, start_time, end_time, status, created_at } =
    req.body;

  const total_amount =
    ((new Date(end_time) - new Date(start_time)) / (1000 * 60 * 60)) * 50;

  db.query(
    "INSERT INTO reservation (user_id, locker_id, start_time, end_time, status, total_amount, created_at) VALUES (?,?,?,?,?,?,?)",
    [
      user_id,
      locker_id,
      start_time,
      end_time,
      status,
      total_amount,
      created_at,
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
        Message: "Reservation Added Successfully",
        reservation_id: result.insertId,
        total_amount,
      });
    },
  );
});

router.put("/", (req, res) => {
  const reservation_id = req.query.reservation_id;

  const {
    user_id,
    locker_id,
    start_time,
    end_time,
    status,
    total_amount,
    created_at,
  } = req.body;

  db.query(
    "UPDATE reservation SET user_id=?, locker_id=?, start_time=?, end_time=?, status=?, total_amount=?, created_at=? WHERE reservation_id=?",
    [
      user_id,
      locker_id,
      start_time,
      end_time,
      status,
      total_amount,
      created_at,
      reservation_id,
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
        Message: "Reservation Updated Successfully",
      });
    },
  );
});

router.delete("/", (req, res) => {
  const reservation_id = req.query.reservation_id;

  db.query(
    "DELETE FROM reservation WHERE reservation_id = ?",
    [reservation_id],
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
        Message: "Reservation Deleted Successfully",
      });
    },
  );
});

router.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql =
    "SELECT * FROM reservation WHERE " +
    keyword +
    " = ? ORDER BY reservation_id " +
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

function expireReservations() {
  db.query(
    `
      UPDATE reservation
      SET status = 'Completed'
      WHERE status = 'Active'
        AND end_time < NOW()
    `,
    (err, result) => {
      if (err) {
        console.error("Failed to expire reservations:", err);
        return;
      }

      if (result.affectedRows > 0) {
        console.log(`Expired ${result.affectedRows} reservation(s).`);
      }
    },
  );
}

// Run once on startup, then every 24 hours.
expireReservations();
setInterval(
  () => {
    expireReservations();
  },
  1000 * 60 * 60,
);

module.exports = router;
