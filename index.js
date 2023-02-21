const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user')
const app = express();
const Admin = require('./model/admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const Flutterwave = require('flutterwave-node-v3');
require('dotenv').config()
const routeLink = require('./api/route')

app.listen(process.env.PORT || 8080);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routeLink)

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
        res.send(response)
        console.log(response);
    })

    console.log(req.body);

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
  const flw = new Flutterwave('FLWPUBK_TEST-1a77c9626f9ed7c7af67eec75e44ac7b-X', 'FLWSECK_TEST-8ec03c1ce3563602b5961330f1abe97d-X');
  flw.Transaction.verify({ id: req.query.transaction_id })
  .then((response) => {
    if (response?.data?.status === "successful" && response?.data?.currency === 'NGN') {
        
      Admin.findOneAndUpdate({email: response?.data?.email}, {$inc: {accountBalance: response.data.amount}})
      .then(response =>{
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
