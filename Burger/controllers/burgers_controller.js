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

router.put("/api/burgers/:id", (req, res) => {
  burger.updateOne(
    { devoured: req.body.devoured },
    `id = ${req.params.id}`,
    result => res.json({ id: req.params.id, devoured: true })
  );
});

module.exports = router;