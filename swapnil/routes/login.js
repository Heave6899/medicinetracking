exports.login = function(req, res){
    var uname = req.body.username;
    const password = req.body.password;

    if(uname && password)
    {
        connection.query('SELECT * FROM user WHERE UNAME=?',[uname],(err,result)=>{
            if(result.length>0)
            {
                bcrypt.compare(req.body.password,result[0].PASS,(err,r)=>{
                    if(r==true)
                    {
                        req.session.loggedin=true;
                        req.session.uid = uname; 
                        res.end();
                        if(result[0].FIRST_LOG==0)
                        {
                            res.redirect('/change_pass');
                        }
                        else
                        {
                            res.redirect('/userhome');
                        }
                    }
                    else
                    {
                        res.render('index.ejs',{
                            error:true
                        });
                    }
                });
            }
            else
            {
                res.render('index.ejs',{
                    error:true
                });
            }
        });
    }

    //console.log(uname);
    //console.log(password);
}


exports.register = function(req, res){
    var name = req.body.name;
    var uname = req.body.username;
    var email = req.body.email;
    const pass = Math.floor((Math.random()*999999)+1);
    const pas = pass.toString();
    const sr=10;
    
    bcrypt.genSalt(sr, function (err, salt) {
        if (err) {
            throw err
        } else {
            bcrypt.hash(pas, salt, function(err, hash) {
                if (err) {
                    throw err
                } else {
                    var mailOptions = {
                        from: 'ibatj7@gmail.com',
                        to: email,
                        subject: 'OTP',
                        text: 'Here is the one time password '+pas
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                        
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    connection.query('INSERT INTO user VALUES(?,?,?,?,?)',[name,uname,email,hash,0]);
                    res.redirect('/home');
                }
            });
        }
    });
}

exports.change_pass = function(req,res){
    const pass1 = req.body.pass1;
    const pass2 = req.body.pass2;

    const sr=10;
    if(pass1===pass2)
    {
        bcrypt.genSalt(sr, function (err, salt) {
            if (err) {
                throw err
            } else {
                bcrypt.hash(pass1, salt, function(err, hash) {
                    if (err) {
                        throw err
                    } else {
                        connection.query('SELECT * FROM user WHERE UNAME=?',[req.session.uid],(err,results)=>{
                            if(results.length>0)
                            {
                                if(results[0].FIRST_LOG==0)
                                {
                                    var mailOptions = {
                                        from: 'ibatj7@gmail.com',
                                        to: results[0].EMAIL,
                                        subject: 'Successful Login',
                                        text: 'Welcome to Medicine tracking'
                                    };
                                    transporter.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                        console.log(error);
                                        } else {
                                        
                                        console.log('Email sent: ' + info.response);
                                        connection.query('UPDATE user SET FIRST_LOG=? WHERE UNAME=?',[1,req.session.uid]);
                                        }
                                    });
                                }
                                connection.query('UPDATE user SET PASS=? WHERE UNAME=?',[hash,req.session.uid]);
                                res.redirect('/userhome');
                            }
                        });
                    }
                });
            }
        });
    }
}


