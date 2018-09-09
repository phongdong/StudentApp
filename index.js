//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine','ejs');
//set the directory of views
app.set('views','./views');
//specify the path of static directory
app.use(express.static(__dirname + '/public')); 

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cpe_273_secure_string',
    resave: false,
    saveUninitialized: true
  }));

//Only user allowed is admin
var Users = [{
    "username" : "admin",
    "password" : "admin"
}];

// students list to store all student
var students = [];

// root route
app.get('/', function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('login');
    }
})

// home route
app.get('/home',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("Session data : " , req.session);
        res.render('home',{
            students : students
        });
    }
    
});

// create route
app.get('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        res.render('create');
    }
});

// login route
app.post('/login', function(req, res) {
    if (req.session.user) {
        res.render('/create');
    } else {
        console.log("Checking user login");
        console.log("Req body : " + req.body);
        Users.filter(function(user) {
            if (user.username === req.body.username 
                && user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/create')
                }
        })
    }
})

app.post('/create', function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        var newStudent = {
            studentName: req.body.studentName,
            studentId: req.body.studentId,
            department: req.body.department
        }
        students.push(newStudent)
        res.redirect('/home')
        console.log("Student successfully added.")
    }
    console.log(students)
})

app.post('/delete', function(req, res) {
    console.log("Deleting request")
    var index = students.map(function(student) {
        return student.studentId;
    }).indexOf(req.body.studentId)

    if (index === -1) {
        console.log("Student not found")
    } else {
        students.splice(index, 1);
        console.log("Successfully remove student.")
        res.redirect('/home');
    }
})


var PORT = 8080;
var server = app.listen(PORT, function() {
    console.log("Server running on port " + PORT);
})