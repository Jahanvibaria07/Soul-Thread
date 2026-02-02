const express=require('express')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const config=require('../utils/config')
const pool=require('../utils/db')
const result=require('../utils/result')

const router=express.Router()

router.post('/preference',(req,res)=>{
     const user_id=req.user_id
     const{age_min,age_max,height_min,height_max,religion,caste,education,occupation,location, gender}=req.body
     const sql='insert into partner_preferences(user_id,age_min,age_max, height_min,height_max,religion,caste,education,occupation,location, gender) values(?,?,?,?,?,?,?,?,?,?,?)'
     pool.query(sql,[user_id,age_min,age_max,height_min,height_max,religion,caste,education,occupation,location, gender],(err,data)=>{
        res.send(result.createResult(err,data))
     })

})

router.put('/preference',(req,res)=>{
    const user_id=req.user_id
    const{age_min,age_max,height_min,height_max,religion,caste,education,occupation,location, gender}=req.body
    const sql='update partner_preferences set age_min=?,age_max=?,height_min=?,height_max=?,religion=?,caste=?,education=?,occupation=?,location=?, gender=? where user_id=?'
    pool.query(sql,[age_min,age_max,height_min,height_max,religion,caste,education,occupation,location, gender, user_id],(err,data)=>{
        res.send(result.createResult(err,data))
    })
})

router.get('/preference',(req,res)=>{
    const user_id=req.user_id
    const sql='select * from partner_preferences where user_id=?'
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

router.get('/preference/status', (req, res) => {
  const user_id = req.user_id

  const sql = 'SELECT preference_id FROM partner_preferences WHERE user_id = ?'

  pool.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.send(result.createResult(err))
    }

    if (data.length === 0) {
      return res.send(result.createResult(null, { preferenceCompleted: false }))
    }

    res.send(result.createResult(null, { preferenceCompleted: true }))
  })
})




module.exports = router