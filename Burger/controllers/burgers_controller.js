const express = require('express');
const router = express.Router();
const burger = require('../models/burger.js');

router.get("/", (req, res) => { 
    burger.selectAll((data) => {
        const obj = {
            burgers: data,
          };
          console.log(obj);
          res.render("index", obj);
  });
});

router.post("/api/burgers", (req, res) => {
    burger.insertOne(
        ["burger_name", "devoured"],
        [req.body.burger_name, req.body.devoured],
    (result) => {
      res.json({ id: result.insertId });
    }
  );
});

module.exports = router;