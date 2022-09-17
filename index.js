const express       = require('express');
let session         = require('express-session');
const cookieParser  = require("cookie-parser");
const port          = 3000;
const ejs           = require('ejs');
const bodyParser    = require('body-parser');
const connection    = require('./database');
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
const app           = express();
require('dotenv').config()



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

/////////////////////////Get Routes////////////////////////

app.get('/', (req,res)=>{
  session = req.session;
  if(session.user_id){ 
    res.redirect('/notes')
  }else{
    res.render('home');
  }
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/notes', (req, res) => {
  session = req.session;
  if(session.user_id){
    const sql = `SELECT * FROM users WHERE user_id = + "${session.user_id}"`;
    connection.query(sql,(err, user)=> {
    if (err) throw err;
    user = (user[0].user_name);
    const getNotes = `SELECT * FROM notes`;
    connection.query(getNotes,(error,notes)=>{
      if(error) throw error;
      const getName = 'SELECT users.user_id,user_name FROM users JOIN notes ON users.user_id = notes.user_id;';
      connection.query(getName,(err, cardName)=>{
        if(err) throw err;
        res.render('notes.ejs' , {user: user[0].user_name, success: '', data: notes, cardName: cardName.user_name})
      })

    })
    
  });
    
  }else{
    res.render('home');
  }
  
})

app.get('/login',(req, res) => {
  res.render('login.ejs');
});


app.get('/register', (req, res) => {
  res.render('register');
})

/////////////////////////END of Get Routes////////////////////////

/////////////////////////Post Routes////////////////////////

app.post('/register',async (req,res)=>{
  const name = req.body.registerName;
  const surname = req.body.registerSurname;
  const email = req.body.registerEmail;
  const pass = req.body.registerPassword;
  const ecryptedPass = await bcrypt.hash(pass, saltRounds);
  const sql = `INSERT INTO users (user_name,user_surname,user_email,user_password) VALUES ("${name}","${surname}","${email}","${ecryptedPass}")`;
  connection.query(sql,(err, result)=> {
    if (err) throw err;
    if (result.insertId > 0){
      res.render("login");
    }else{
        res.redirect("/");
    }
  });
});

app.post('/login', (req, res) => {
  const email = req.body.inputEmail;
  const pass = req.body.inputPassword;
  const sql = `SELECT * FROM users WHERE user_email =  + "${email}"`;

  connection.query(sql, async (err, result)=> {
    if (err) throw err;
    if(result.length > 0){
      const compare = await bcrypt.compare(pass, result[0].user_password)
      if (compare){
        req.session.user_id = result[0].user_id;
        const getNotes = `SELECT * FROM notes JOIN users ON notes.user_id = users.user_id;`;
        connection.query(getNotes,(error,notes)=>{
        if(error) throw error;
        res.render('notes.ejs' , {user: result[0].user_name, data: notes})



        // res.render('notes', {user: result[0].user_name, data: data});
    });
        
      }else{
        res.send("Incorrect password");
      }
    }else{
      res.send("Incorrect Email Address");
    }
  });
});

app.post('/notes' , (req, res)=>{
  session = req.session;
  console.log(session);
  const subject = req.body.subject;
  const content = req.body.content;
  const sql = `INSERT INTO notes (user_name, note_subject,note_content,note_date, note_hasContributed) VALUES ("${session.user_id}","${subject}","${content}","${convertDateTime()}", TRUE)`;
  connection.query(sql,(err, result)=> {
    if (err) throw err;
    if(result.insertId > 0){
      res.redirect('/notes');
    }
  });
});

/////////////////////////END of Post Routes////////////////////////


app.listen(port, () => {
  console.log(`Server connected to port: ${port}`)
})


function convertDateTime(){
  let date;
date = new Date();
date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    ('00' + date.getUTCHours()).slice(-2) + ':' + 
    ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + date.getUTCSeconds()).slice(-2);
  return date;
}


