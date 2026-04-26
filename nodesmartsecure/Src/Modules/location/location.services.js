const express = require('express'); 
const router = express.Router();
router.use(express.json());
const db = require('../../db/connection');

router.get('/', (req, res) => {
  var location_id = req.query.location_id;

  if (!location_id || location_id == '%') {
    db.query("SELECT * FROM location", function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } else {
    db.query(
      "SELECT * FROM location WHERE location_id = ?",
      [location_id],
      function (err, result) {
        if (err) throw err;
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {
  const { name, address, city, category, num_lockers } = req.body;

  db.query(
    "INSERT INTO location (`name`, `address`, `city`, `category`, `num_lockers`) VALUES (?,?,?,?,?)",
    [name, address, city, category, num_lockers],
    function(err, result) {
      if(err) throw err;
      res.json({ Status: "OK", Message: "Record Added Successfully with Id " + result.insertId });
    }
  );
});

router.put('/', (req, res) => {
  const location_id = req.query.location_id;

  const { name, address, city, category, num_lockers } = req.body;

  db.query(
    "UPDATE location SET `name`=?, `address`=?, `city`=?, `category`=?, `num_lockers`=? WHERE location_id=?",
    [name, address, city, category, num_lockers, location_id],
    (err, result) => {
      if(err) throw err;
      res.json({ Status:"OK", Message:"Record Updated Successfully" });
    }
  );
});

router.delete('/', (req, res) => {
  const location_id = req.query.location_id;

  db.query("DELETE FROM location WHERE location_id = ?", [location_id], (err, result) => {
    if (err) throw err;
    res.json({ Status: "OK", Message: "Record deleted Successfully" });
  });
});

module.exports = router;