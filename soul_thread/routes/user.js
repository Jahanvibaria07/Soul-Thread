const express = require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const config=require('../utils/config')
const pool=require('../utils/db')
const result=require('../utils/result')

const router = express.Router()

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    pool.query(sql, [email], (err, data) => {
        if (err) 
             res.send(result.createResult(err));
       else if (data.length === 0) 
             res.send(result.createResult("Invalid Email"));
        else{
        const user = data[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if(match)
            {
            const token = jwt.sign( { user_id: user.user_id },config.Secret);
            return res.send(result.createResult(null, {
                token,
                user_id: user.user_id,
                email: user.email
            }));
        }else
            return res.send(result.createResult("Invalid Password")); 
        });
    }
    });
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    console.log("HIII")
    const sql = "INSERT INTO users(email, password) VALUES (?, ?)";
    bcrypt.hash(password, config.Salt_Round, (err, hashedPassword) => {
        if (err) {
            return res.send(result.createResult(err));
        }
        pool.query(sql, [email, hashedPassword], (err, data) => {
            if (err) return res.send(result.createResult(err));
            const user_id = data.insertId;
            const token = jwt.sign({ user_id }, config.Secret);
            const response = {
                user_id,
                email,
                token
            };
            res.send(result.createResult(null, response));
        });
    });
});


router.post('/profile',(req,res)=>{
    const user_id=req.user_id;
        const{full_name,gender,height,religion,caste,mother_tongue,education,occupation,income,marital_status,hobbies,about_me,address,city,state,country}=req.body
    
        const sql='Insert into profiles(user_id,full_name,gender,height,religion,caste,mother_tongue,education,occupation,income,marital_status,hobbies,about_me,address,city,state,country) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
         pool.query(sql,[user_id,full_name,gender,height,religion,caste,mother_tongue,education,occupation,income,marital_status,hobbies,about_me,address,city,state,country],(err,data)=>{
                         res.send(result.createResult(err,data))
                    })
})

router.get('/profile',(req,res)=>{
    const user_id=req.user_id;
    const sql='select u.user_id,u.email,p.profile_id,p.full_name,p.gender,p.height,p.religion,p.caste,p.mother_tongue,p.education,p.occupation,p.income,p.marital_status,p.hobbies,p.about_me,p.address,p.city,p.state,p.country from users u left join profiles p on u.user_id=p.user_id where u.user_id=?'
    pool.query(sql,[user_id],(err,data)=>{
        if(err){
            return res.send(result.createResult(err))
        }
        if(data.length==0){
            return res.send(result.createResult("Profile not found"))
        }
        res.send(result.createResult(null,data[0]))
    })
})


router.put('/profile', (req, res)=>{
 const user_id = req.user_id;
 const{full_name, mother_tongue,education, occupation, income,marital_status, hobbies, about_me, address, city, state, country} = req.body
 const sql = 'UPDATE profiles SET full_name=?, mother_tongue=?, education=?, occupation=?, income=?, marital_status=?, hobbies=?, about_me=?, address=?, city=?, state=?, country=? WHERE user_id=?'
 pool.query(sql, [full_name, mother_tongue,education, occupation, income,marital_status, hobbies, about_me, address, city, state, country,user_id], (err, data)=>{
  res.send(result.createResult(err, data))
  })
})

router.delete('/profile', (req, res)=>{
 const user_id = req.user_id;
 const sql = 'Delete from profiles where user_id=?'
 pool.query(sql, [user_id], (err, data)=>{
   res.send(result.createResult(err, data))
})
})



module.exports = router