const express = require('express');
const path = require('path');
const Buyer = require('../model/buyer');
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
        Buyer.create({
          manualId: manualId,
          userId: unique
        }).then(ele =>{
          const json = JSON.parse(data);
          res.status(200).send(json);
        })
      }else{
        res.status(400).send({error: "Invalid.."})
      }

    })
   })
  
   route.get('/verify/:uniqueId', async(req, res) =>{
    const unique = req.params.uniqueId;
    const manualId = req.query.manualId;
  
    const filePath = path.join(__dirname, '..', 'manual files', `${manualId}.json`);
    const verify = await Buyer.findOne({ 
         manualId: manualId,
         userId: unique
    })

    if(verify){
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(data){
           const json = JSON.parse(data);
           res.status(200).send(json);
        }else{
          res.status(400).send({
            message: 'File Error'
          })
        }
  
      })
    }else{
      res.status(400).send({
        message: 'You have not paid for the '+manualId+' sunday school manual'
      })
    }

   })
  
module.exports = route