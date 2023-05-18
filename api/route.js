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
  
    const filePath = path.join(__dirname, '..', 'manual files', `${manualId}.json`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if(data){
         const json = JSON.parse(data);
         res.status(200).send(json);

        //  Buyer.create({
        //   manualId: manualId,
        //   userId: unique
        // })
      }else{
        res.send('Invalid')
      }

    })
   })
  

module.exports = route