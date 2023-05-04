const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user')
const app = express();
const Admin = require('./model/admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const Flutterwave = require('flutterwave-node-v3');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const fs = require('fs');

const path = require('path');
const routeLink = require('./api/route')

app.listen(process.env.PORT || 8080);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routeLink);
app.use(cookieParser())

mongoose.connect(process.env.DBURL)
mongoose.set('strictQuery', false);


app.post('/user', async(req, res) =>{

   const Unique = await User.findOne({userId: req.body.userId})
    
   if(Unique){
    res.send('User Account Already Created')
   }else{
        User.create({
        userId: req.body.userId,
        activated: false
    })
     .then(ele =>{
        res.send('User Successfully Activated')
      }).catch(err =>{
        res.send('Didnt go well sorrry');
      })
   }
})


app.post('/verifyuser', async(req, res) =>{
   const user = await User.findOne({userId: req.body.userId})

   if(user){
     if(user.activated){
        res.json({message: 'error', data: 'The account is already activated contact admin for more support'})
     }else{
        const activate = await User.findOneAndUpdate({userId: req.body.userId}, {$set: {activated: true}});
        res.json({message: 'success', data: 'Successfully Verified'})
     }
   }else{
     res.json({message: 'error 2', data: 'The account is not activated contact admin for more support'})
   }  
 })

// app.post('/admin', (req, res) =>{
//    Admin.create({
//     email: 'techhub@gmail.com',
//     password: '123456',
//     accountBalance: 0
//    }).then(ele =>{
//     res.send('element added successfully')
// })
// })

app.post('/admins', (req, res) =>{
    Admin.findOne({email: req.body.email})
     .then(response =>{
        res.json(response)
        console.log(response);
    })
})

app.post('/updateaccount', (req, res) =>{
    Admin.findOneAndUpdate({email: req.body.email}, {$inc: {accountBalance: -500}})
    .then(response =>{
        res.send(response);
    })
})

app.post('/activate', async (req, res) =>{
  const user = await User.findOneAndUpdate({userId: req.body.userId}, {$set: {activated: true}})
  res.send(user);
})


app.get('/payment', (req, res) =>{
  const flw = new Flutterwave('FLWPUBK-17db7720752df7fc23b9e9dbbec997ea-X', 'FLWSECK-02cfa45d355ce556ce898802420d1491-X');
  flw.Transaction.verify({ id: req.query.transaction_id })
  .then((response) => {
    if (response?.data?.status === "successful" && response?.data?.currency === 'NGN') {    
      Admin.findOneAndUpdate({email: response?.data?.customer.email}, {$inc: {accountBalance: response.data.amount}})
      .then(response =>{
        console.log(response);
        res.redirect('back');
      })
    } else {
      res.send('Not Sucessfull')
    }
}).catch((err) =>{
  console.log(err);
});

})

app.post('/adminsignin', async (req, res) =>{
  const user = await Admin.findOne({email: req.body.email});

  if(user){
    if(user.password === req.body.password){
      res.json({message: 'success', data: 'Login Successful', response: user})
    }else{
      res.json({message: 'error', data: 'User/Password is Invalid'})
    }
  }else{
    res.json({message: 'error', data: 'User/Password is Invalid'})
  }
})


app.get('/clientpayment/:id', (req, res) =>{
  const filePath = path.join(__dirname, 'manual files', 'to', 'file.pdf');
  const flw = new Flutterwave('FLWPUBK-17db7720752df7fc23b9e9dbbec997ea-X', 'FLWSECK-02cfa45d355ce556ce898802420d1491-X');
  flw.Transaction.verify({ id: req.query.transaction_id })
    .then((response) => {
      if (response?.data?.status === "successful" && response?.data?.currency === 'NGN') {    
      //  Here we'll send the Json file to the client
        res.send('')
      } else {
        res.send('Not Sucessfull')
      }
  }).catch((err) =>{
    console.log(err);
  });
})

app.get('/test', (req, res) =>{
  const filePath = path.join(__dirname, 'manual files', 'Jan-July-2023.json');
  console.log(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(typeof(data));
    res.send(data)
  });
})