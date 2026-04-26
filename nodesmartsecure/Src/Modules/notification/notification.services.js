const mysql = require('mysql');
const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');

router.get('/', (req, res) => {
  var notification_id = req.query.notification_id;

  if (!notification_id || notification_id == '%') {
    db.query("SELECT * FROM notification", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM notification WHERE notification_id = ?",
      [notification_id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {
  const { user_id, type, message, is_read, sent_at } = req.body;

  db.query(
    "INSERT INTO notification (`user_id`, `type`, `message`, `is_read`, `sent_at`) VALUES (?,?,?,?,?)",
    [user_id, type, message, is_read, sent_at],
    function(err, result) {
      if(err) throw err;
      res.json({ Status: "OK", Message: "Record Added Successfully with Id " + result.insertId });
    }
  );
});

router.put('/', (req, res) => {
  const notification_id = req.query.notification_id;

  const { user_id, type, message, is_read, sent_at } = req.body;

  db.query(
    "UPDATE notification SET `user_id`=?, `type`=?, `message`=?, `is_read`=?, `sent_at`=? WHERE notification_id=?",
    [user_id, type, message, is_read, sent_at, notification_id],
    (err, result) => {
      if(err) throw err;
      res.json({ Status:"OK", Message:"Record Updated Successfully" });
    }
  );
});

router.delete('/', (req, res) => {
  const notification_id = req.query.notification_id;

  db.query("DELETE FROM notification WHERE notification_id = ?", [notification_id], (err, result) => {
    if (err) throw err;
    res.json({ Status: "OK", Message: "Record deleted Successfully" });
  });
});

module.exports = router;