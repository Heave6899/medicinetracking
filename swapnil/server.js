global.mysql = require('mysql');
global.express = require('express');
global.session = require('express-session');
global.bodyParser = require('body-parser');
global.path = require('path');
global.app = express();
global.bcrypt=require('bcryptjs');
global.http = require('http');

var multipart = require('connect-multiparty');
app.use(multipart());
app.use(bodyParser.urlencoded({extended:true}));


global.connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medicine'
});

app.use(session({secret: 'nirma@123',resave: true,saveUninitialized: true}));

app.set('view engine','ejs');
app.use('/css',express.static('css'));
app.use('/img',express.static('img'));
app.use('/fonts',express.static('fonts'));
app.use('/js',express.static('js'));
app.use('/contactform',express.static('contactform'));

global.nodemailer = require('nodemailer');
global.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ibatj7@gmail.com',
        pass: '348920348920'
    }
  });

app.get('/',(req,res)=>{
    res.redirect('/home');
});

app.get('/home',(req,res)=>{
    res.render('index.ejs',{
        error:false
    });
});

var login = require('./routes/login');

app.post('/userlogin',login.login);
app.post('/register',login.register);
app.get('/userhome',(req,res)=>{
    if(req.session.uid==null)
    {
        res.redirect('/home');
    }
    else
    {
        connection.query('SELECT * FROM user WHERE UNAME=?',[req.session.uid],(err,result)=>{
            res.render('userhome.ejs',{
                user : result
            });
        });
    }
});

app.get('/change_pass',(req,res)=>{
    if(req.session.uid==null)
    {
        res.redirect('/home');
    }
    else
    {
        connection.query('SELECT * FROM user WHERE UNAME=?',[req.session.uid],(err,result)=>{
            res.render('change_pass.ejs',{
                user : result
            });
        });
    }
});

app.post('/change_pass',login.change_pass);
app.listen(8030);
console.log("Server is listning port 8030 !!!!");
