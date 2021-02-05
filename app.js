const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const { Sequelize } = require('sequelize');

//Database
const db = require('./config/database');

//Test DB
db.authenticate().then(()=>console.log('Database Connected...')).catch(err=>(console.log('Error: ')));

const app = express();

//HandleBars
app.engine('handlebars',exphbs({defaultLayout:'main',handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine','handlebars');

//Body Parser
app.use(bodyParser.urlencoded({extended:false}));

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Index Route
app.get('/',(req,res)=>res.render('index',{layout:'landing'}));

//Gig Routes
app.use('/gigs',require('./routes/gigs'));

const PORT =  process.env.PORT||5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));