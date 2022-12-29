const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mysql = require('mysql')


const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:process.env.DATABASE
  })

  const saltRounds = 10;

exports.register =(req,res)=>{
    
    console.log(req.body);
    
    const {name,email, password, passwordConfirm }=req.body

    db.query('SELECT email FROM users WHERE email=?',[email],async (error,results)=>{
        if(error){
            throw error
        }

        if(results.length>0){
            console.log(results.password);
            return res.render('register',{
                message:'This email is already taken'
            })
        }
        else if(password !== passwordConfirm){
            return res.render('register',{
                message:'Password do not match'
            })
        }

        bcrypt.hash(password,saltRounds,(err,hash)=>{
            if(err){
                throw err
            }
            db.query('INSERT INTO users SET ?', {name:name, email:email, password:hash},(error,results)=>{
                if(error){
                    throw error
                }else{
                    console.log(results)
                    return res.render('register',{ message:'Registered Successfully'})
                   
                }
            })
        })

    })
}

exports.login =(req,res)=>{

    const {email, password }=req.body

    db.query('SELECT * FROM users WHERE email=?;',email,(error,results)=>{
        if(error){
            throw error
        }

        if(results.length>0){
            // console.log(results[0].password);
            bcrypt.compare(password,results[0].password,(error,response)=>{
                if (response) {
                   
                    req.session.user = results;
                    console.log(req.session.user);
                    return res.render('userPage');
                    // console.log("welcome")
                  } else {
                    return res.render('login',{
                        message:'Wrong username/password combination!'
                    })
                  }
            })
        } else {
            return res.render('login',{
                message:"User doesn't exist"
            })
          }
    })
}


exports.logout=(req, res)=> {
    if (req.session.loggedin) {
      req.session.destroy();
    }
    res.redirect('/');
  }
