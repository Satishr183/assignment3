const express =require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const path = require('path')
const session = require('express-session')
const cookieParser = require("cookie-parser");

dotenv.config({ path:'./.env'})


const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser());


app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24,
  }
}));

const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:process.env.DATABASE
})

db.connect( (error)=>{
  if(error){
    throw error
  }
  console.log('mysql Connected')
})


//using css publically
const publicDirectory =path.join(__dirname,'./public')
app.use(express.static(publicDirectory))

app.set('view engine','hbs')

//routes
app.use('/',require('./routes/pages'))

app.use('/auth',require('./routes/auth'))



app.listen(5000,()=>{
  console.log('Server is Connected..')
})