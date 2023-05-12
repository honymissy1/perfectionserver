const express = require('express');
const path = require('path');
const Buyer = require('../model/buyer')
const route = express.Router();
const fs = require('fs');

route.get('/', (req, res) =>{
    res.send('coooking')
})

route.get('/payment/:uniqueId', (req, res) =>{
    const unique = req.params.uniqueId;
    const manualId = req.query.manualId;
  
    Buyer.create({
      manualId: manualId,
      userId: unique
    })
  
    const filePath = path.join(__dirname, '..', 'manual files', `${manualId}.json`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      const json = JSON.parse(data);
      res.send(json);
    })
   })
  

module.exports = route