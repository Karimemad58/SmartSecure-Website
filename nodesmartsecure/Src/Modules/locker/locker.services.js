const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.use(express.json());

router.get('/', (req, res) => {
  const locker_id = req.query.locker_id;

  if (!locker_id || locker_id === '%') {
    db.query('SELECT * FROM locker', (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(result);
    });
  } else {
    db.query(
      'SELECT * FROM locker WHERE locker_id = ?',
      [locker_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        res.json(result);
      }
    );
  }
});

router.post('/', (req, res) => {
  const {
    locker_code,
    status,
    location_id,
    smart_device_id,
    installation_date,
    last_maintenance
  } = req.body;

  db.query(
    'INSERT INTO locker (locker_code, status, location_id, smart_device_id, installation_date, last_maintenance) VALUES (?,?,?,?,?,?)',
    [locker_code, status, location_id, smart_device_id, installation_date, last_maintenance],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        Status: 'OK',
        Message: 'Locker added successfully',
        locker_id: result.insertId
      });
    }
  );
});

router.put('/', (req, res) => {
  const locker_id = req.query.locker_id;

  const {
    locker_code,
    status,
    location_id,
    smart_device_id,
    installation_date,
    last_maintenance
  } = req.body;

  db.query(
    'UPDATE locker SET locker_code=?, status=?, location_id=?, smart_device_id=?, installation_date=?, last_maintenance=? WHERE locker_id=?',
    [locker_code, status, location_id, smart_device_id, installation_date, last_maintenance, locker_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        Status: 'OK',
        Message: 'Locker updated successfully'
      });
    }
  );
});

router.delete('/', (req, res) => {
  const locker_id = req.query.locker_id;

  db.query(
    'DELETE FROM locker WHERE locker_id = ?',
    [locker_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({
        Status: 'OK',
        Message: 'Locker deleted successfully'
      });
    }
  );
});

router.get('/search', (req, res) => {

  const keyword = req.query.keyword;
  const keyvalue = req.query.keyvalue;
  const sort = req.query.sort || "ASC";

  const sql = "SELECT * FROM locker WHERE " + keyword + " = ? ORDER BY locker_id " + sort;

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