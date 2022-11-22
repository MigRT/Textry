const mysql = require('mysql');
const express = require("express");
const session = require('express-session');
const app = express();
const cadastro = require("./models/cadastro");
const imagens = require("./models/imagens");
const path = require('path');
const md5 = require('md5');
const validator = require("email-validator");

app.set('view engine', 'ejs')

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'banco'
});

app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb', extended: false}));
app.use('/index.html', express.static(__dirname + '/index.html'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/imagens', express.static(__dirname + '/imagens'))
app.use('/login', express.static(__dirname + '/login'))
app.use('/registro', express.static(__dirname + '/registro'))
app.use('/registro/css', express.static(__dirname + '/registro/css'))
app.use('/ferramentas', express.static(__dirname + '/ferramentas'))

//rotas
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/form-cadastro', function(req, res) {
    res.sendFile(path.join(__dirname + '/registro/registro.html'));
});

app.post('/add-usuario', function(req, res){
	let emailConfirm = req.body.email
	let nameConfirm = req.body.nome;
	let passwordConfirm = md5(req.body.senha);
	if(validator.validate(emailConfirm)){
		// Your call to model here
	}else{
		console.log('Invalid Email');
	}
	if (emailConfirm && nameConfirm && passwordConfirm) {
		connection.query('SELECT * FROM users WHERE email = ?', [emailConfirm], function(error, results, fields) {
			if (error) throw error;

			if (results.length > 0) {
				res.send('Email já cadastrado');
			} else {
				cadastro.create({
					email: emailConfirm,
					name: nameConfirm,
					password: passwordConfirm
				}).then(function(){
					res.redirect('/form-login')
				}).catch(function(erro){
					res.send("Erro ao cadastrar: "+erro)
				})
			}		
		});
	}
})

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/form-login', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login/login.html'));
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = md5(request.body.password);
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.name = email;
				// Redirect to home page
				response.redirect('/ferramentas');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/ferramentas', function(request, response) {
	// Render ferramentas template
	response.sendFile(path.join(__dirname + '/ferramentas/ferramentas.html'));
});

app.post('/add-image', function(request, response) {
	
	let base64;

	(async (req, res) => {
		await new Promise(resolve => setTimeout(resolve, 1000));
		base64 = request.body.input64;

		imagens.create({
			img:base64
		})

	})();
	response.redirect('/ferramentas');
	response.end();
});

app.post('/myaccount', function(request, response) {
	if (request.session.loggedin) {
		connection.query('SELECT img FROM images', function(error, results, fields) {
			if (error) throw error;	
			response.render("teste.ejs", {
				results
			})
			
		});
	} else {
		response.redirect('/form-cadastro');
	}
});
app.post('/personalize', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('/ferramentas');
	} else {
		response.redirect('/form-cadastro');
	}
	response.end();
});
app.post('/toLogin', function(request, response) {
	response.redirect('/form-login');
	response.end();
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.name + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(8080);