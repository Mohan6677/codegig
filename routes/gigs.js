const express = require('express');
const router = express.Router();
const db = require('../config/database');
const gig = require('../models/gig');
const sequelize = require('sequelize');
const Op = sequelize.Op;

//Get gig list
router.get('/',(req,res)=>
    gig.findAll()
    .then(gigs=>{
        res.render('gigs',{
            gigs
        });
    })
    .catch(err=>console.log(err)));

//Display Add Gig Form
router.get('/add',(req,res)=>{
    res.render('add')
});
//Add a Gig
router.post('/add',(req,res)=>{
    let {title,technologies,budget,description,contact_email} = req.body;
    let errors = [];

    // Validate Fields
    if(!title) {
        errors.push({ text: 'Please add a title' });
    }
    if(!technologies) {
        errors.push({ text: 'Please add some technologies' });
    }
    if(!description) {
        errors.push({ text: 'Please add a description' });
    }
    if(!contact_email) {
        errors.push({ text: 'Please add a contact email' });
    }

    // Check for errors
    if(errors.length > 0) 
    {
        res.render('add', {
        errors,
        title, 
        technologies, 
        budget, 
        description, 
        contact_email
        });
    } 
    else 
    {
        if(!budget) {
        budget = 'Unknown';
        } else {
        budget = `$${budget}`;
        }

        // Make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/,[ ]+/g, ',');

        // Insert into table
        gig.create({
        title,
        technologies,
        description,
        budget,
        contact_email
        })
        .then(gig => res.redirect('/gigs'))
        .catch(err => res.render('error', {error:err.message}))
    }
});

//Search gigs
router.get('/search',(req,res)=>{
    let {term} = req.query;
    term = term.toLowerCase();
    gig.findAll({where:{
        technologies:{[Op.like]:'%'+term+'%'}
    }}).then(gigs=>{
        res.render('gigs',{
            gigs
        })
    }).catch(err=>console.log(err));
});

module.exports = router;