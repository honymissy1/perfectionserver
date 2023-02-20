const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user')
const app = express();
const Admin = require('./model/admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const Flutterwave = require('flutterwave-node-v3');


app.listen(8080);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
  

mongoose.connect(`mongodb+srv://honymissy:honymissy1@cluster0.q6yjv.mongodb.net/Perfection`)
mongoose.set('strictQuery', false);


app.get('/', (req, res) =>{
  res.send('Woooow it worked')
})

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
        res.json({message: 'success', data: 'Successfully Verified'})
     }
   }else{
     res.json({message: 'error 2', data: 'The account is not activated contact admin for more support'})
   }  
 })

app.post('/admin', (req, res) =>{
   Admin.create({
    email: 'techhub@gmail.com',
    password: '123456',
    accountBalance: 10000
   }).then(ele =>{
    res.send('element added successfully')
})
})

app.get('/admin', (req, res) =>{
    Admin.findOne({email: 'techhub@gmail.com'})
    .then(response =>{
        res.send(response)
    })
})

app.post('/updateaccount', (req, res) =>{
    Admin.findOneAndUpdate({email: 'techhub@gmail.com'}, {$inc: {accountBalance: -1000}})
    .then(response =>{
        res.send(response);
    })
})

app.post('/activate', async (req, res) =>{
  const user = await User.findOneAndUpdate({userId: req.body.userId}, {$set: {activated: true}})
  res.send(user);
  console.log(user)
})


app.get('/payment', (req, res) =>{
  const flw = new Flutterwave('FLWPUBK_TEST-1a77c9626f9ed7c7af67eec75e44ac7b-X', 'FLWSECK_TEST-8ec03c1ce3563602b5961330f1abe97d-X');
  flw.Transaction.verify({ id: req.query.transaction_id })
  .then((response) => {
    if (response?.data?.status === "successful" && response?.data?.currency === 'NGN') {
        
      Admin.findOneAndUpdate({email: 'techhub@gmail.com'}, {$inc: {accountBalance: response.data.amount}})
      .then(response =>{
        res.redirect('back');
      })
    } else {
      console.log('Never1');
      res.send('Not Sucessfull')
        // Inform the customer their payment was unsuccessful
    }
}).catch((err) =>{
  console.log(err);
});

})