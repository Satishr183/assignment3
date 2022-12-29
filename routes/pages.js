const express =require('express')
const router = express.Router()


router.get('/',(req,res)=>{
    res.render('index')
  })
  
router.get('/register',(req,res)=>{
    res.render('register')
  })

  router.get('/login',(req,res)=>{
    res.render('login')
  })

  router.post('/logout', (req, res) => {
    if (req.session.loggedin) {
      let name = req.session.name;
  
       res.render('userPage', { name });
    } else {
      res.redirect('/login');
    }
  });

  

  module.exports=router