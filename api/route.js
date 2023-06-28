const express = require('express');
const path = require('path');
const Buyer = require('../model/buyer');
const Suggestion = require('../model/request');
const route = express.Router();
const fs = require('fs');
const Admin = require('../model/admin')
const bodyParser = require('body-parser');


route.use(express.json())
route.use(bodyParser.json());


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
          userId: unique,
          createdAt: new Date().toISOString().substring(0, 7)
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


   route.post('/request', (req, res) =>{
     const {email, suggestion} = req.body;

     Suggestion.create({
      email,
      suggestion
     }).then(result =>{
      res.status(200).send({
        message: 'Request Sent Successfully'
      })
      }).catch((error) => {
        res.status(400).send({
          message: 'Error in request'
        })
      })
     })


     route.get('/buyers', async(req, res) =>{

      try {
        const total = await Buyer.find();
        const totalNum = total.length;
        res.status(200).send({
          response: totalNum 
        })
        
      } catch (error) {
        res.status(400).send({response:'Error'})
      }

     })


     route.post('/buyers/:month/:manual', async(req, res) =>{
      const {month, manual} = req.params;


      try {
        const total = await Buyer.find({createdAt: month, manualId: manual});
        const totalNum = total.length;
        res.status(200).send({
          response: totalNum
        })
        
      } catch (error) {
        res.status(400).send({response:'Error'})
      }

     })
  

     route.get('/buyers/:month', async(req, res) =>{
      const {month} = req.params;


      try {
        const total = await Buyer.find({createdAt: month});
        const totalNum = total.length;
        res.status(200).send({
          response: totalNum 
        })
        
      } catch (error) {
        res.status(400).send({response:'Error'})
      }

     })

     route.post('/password', (req, res) =>{
      console.log(req.body)
      Admin.updateOne({email: 'paulabass@gmail.com'}, {$set: {password: req.body.password} })
       .then(result =>{
        res.status(200).send({message: 'Password Update Successful'})
       }).catch(err =>{
        res.status(400).send({message: 'Error.  .Not updated'}) 
        })
     })

  
module.exports = route