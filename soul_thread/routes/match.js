const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()


router.get('/matches-suggestions', (req, res)=>{
    const user_id = req.user_id;

    const sql = 'Select p.profile_id, p.user_id, p.full_name, p.gender, p.height, p.religion, p.caste, p.education, p.occupation, p.city from profiles p JOIN partner_preferences pref ON pref.user_id = ? WHERE p.user_id!=? AND p.height BETWEEN pref.height_min AND pref.height_max AND p.religion = pref.religion'
    pool.query(sql, [user_id, user_id], (err, data)=>{
        if (err){
            return res.send(result.createResult(err));
        }
        res.send(result.createResult(null, data))
    })
})


router.get('/my-matches', (req, res) => {
    const user_id = req.user_id;

    const sql = "SELECT p.profile_id, p.user_id, p.full_name, p.gender, p.city, p.state FROM profiles p JOIN matches m ON (p.profile_id = m.profile1_id AND m.profile2_id = ?) OR (p.profile_id = m.profile2_id AND m.profile1_id = ?) WHERE m.status = 'Active'"

    pool.query(sql, [user_id, user_id], (err, data) => {
        if (err) {
            return res.send(result.createResult(err));
        }
        res.send(result.createResult(null, data));
    })
})
module.exports = router