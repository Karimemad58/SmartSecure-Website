const mysql = require('mysql'); 
const express = require('express'); 
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');

router.get('/', (req, res) => {
  var user_id = req.query.user_id;

  if (!user_id || user_id == '%') {
    db.query("SELECT * FROM user", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM user WHERE user_id = ?",
      [user_id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {
  const { full_name, email, phone, password, role, status } = req.body;

  db.query(
    "INSERT INTO user (`full_name`, `email`, `phone`, `password`, `role`, `status`) VALUES (?,?,?,?,?,?)",
    [full_name, email, phone, password, role, status],
    function(err, result) {
      if(err) throw err;
      res.json({ Status: "OK", Message: "Record Added Successfully with Id " + result.insertId });
    }
  );
});

router.put('/', (req, res) => {
  const user_id = req.query.user_id;

  const { full_name, email, phone, password, role, status } = req.body;

  db.query(
    "UPDATE user SET `full_name`=?, `email`=?, `phone`=?, `password`=?, `role`=?, `status`=? WHERE user_id=?",
    [full_name, email, phone, password, role, status, user_id],
    (err, result) => {
      if(err) throw err;
      res.json({ Status:"OK", Message:"Record Updated Successfully" });
    }
  );
});

router.delete('/', (req, res) => {
  const user_id = req.query.user_id;

  db.query("DELETE FROM user WHERE user_id = ?", [user_id], (err, result) => {
    if (err) throw err;
    res.json({ Status: "OK", Message: "Record deleted Successfully" });
  });
});

router.get('/login', (req, res) => {
  const { email, password } = req.query;

  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    function (err, result) {
      if (err) {
        res.json({ Status: "Error", Message: err });
      } else {
        if (result.length == 0) {
          res.json({ Status: "Error", Message: "Authentication Failed, Check email or password" });
        } else {
          res.json({ Status: "OK", Message: "Logged In Successfully"});
        }
      }
    }
  );
  console.log("Incoming LOGIN Request");
});

module.exports = router;