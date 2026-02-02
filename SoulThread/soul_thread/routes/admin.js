const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()

router.post('/admin/register', (req, res) => {
    const { admin_name, admin_email, password } = req.body;

    const sql = "INSERT INTO admin (admin_name, admin_email, password) VALUES (?, ?, ?)"

    pool.query(sql, [admin_name, admin_email, password], (err) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, 'Admin registered'));
    })
})


router.post('/admin/login', (req, res) => {
    const { admin_email, password } = req.body;

    const sql = "SELECT admin_id, admin_name, admin_email FROM admin WHERE admin_email = ? AND password = ?"

    pool.query(sql, [admin_email, password], (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.length === 0)
            return res.send(result.createResult('Invalid credentials'));

        res.send(result.createResult(null, data[0]));
    })
})


router.get('/admin/profile', (req, res) => {
  const user_id = req.body.user_id; // ← pass manually from Postman

  const sql = "SELECT profile_id, full_name, gender, city FROM profiles WHERE user_id = ?"

  pool.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.send(result.createResult(err));
    }

    res.send(result.createResult(null, data));
  })
})


router.get('/admin/users', (req, res) => {
    const sql = "SELECT u.user_id, u.email, p.full_name, p.gender, p.city FROM users u JOIN profiles p ON u.user_id = p.user_id"

    pool.query(sql, (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, data));
    })
})

router.get('/admin/allUsers', (req, res) => {
    const sql = "SELECT * from profiles"

    pool.query(sql, (err, data) => {
        if (err) return res.send(result.createResult(err));
        console.log(result.data)
        res.send(result.createResult(null, data));
    })
})





module.exports = router