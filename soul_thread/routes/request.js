const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()


router.post('/request/send', (req, res) => {
    const user_id = req.user_id;
    const { receiver_id } = req.body;

    const getProfile="SELECT profile_id FROM profiles WHERE user_id = ?"
    pool.query(getProfile,[user_id],(err,senderData)=>{
        if (err) return res.send(result.createResult(err))
        if(senderData.length == 0)
            return res.send(result.createResult('Sender Profile Not Found'))

        const sender_profile_id=senderData[0].profile_id
   

    const sqlCheck = "SELECT profile_id FROM profiles WHERE profile_id IN (?, ?)"
    pool.query(sqlCheck, [sender_profile_id, receiver_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        if (data.length < 2) return res.send(result.createResult('Sender or receiver profile does not exist'));

        const sqlInsert = "INSERT INTO requests (sender_id, receiver_id, status, sent_at) VALUES (?, ?, 'Pending', NOW())"
        pool.query(sqlInsert, [sender_profile_id, receiver_id], (err2, data2) => {
            if (err2) return res.send(result.createResult(err2));
            res.send(result.createResult(null, 'Request sent successfully'));
        })
    })
})
})


router.get('/request/received', (req, res) => {
    const user_id = req.user_id; 
    const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
    pool.query(getProfileSql, [user_id], (err, profileResult) => {
        if (err) return res.send(result.createResult(err));
        if (profileResult.length === 0)
            return res.send(result.createResult('Profile not found'));
        const profile_id = profileResult[0].profile_id;
        const sql = ` SELECT r.request_id, r.sender_id,p.full_name AS sender_name, r.status, r.sent_at FROM requests r  JOIN profiles p ON p.profile_id = r.sender_id  WHERE r.receiver_id = ?  AND r.status = 'Pending' ORDER BY r.sent_at DESC `;
          pool.query(sql, [profile_id], (err2, data) => {
            if (err2) return res.send(result.createResult(err2));
            res.send(result.createResult(null, data));
        })
    })
})

router.get('/request/sent', (req, res) => {
    const user_id = req.user_id; 
    const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
    pool.query(getProfileSql, [user_id], (err, profileResult) => {
        if (err) return res.send(result.createResult(err));
        if (profileResult.length === 0)
            return res.send(result.createResult('Profile not found'));
        const profile_id = profileResult[0].profile_id;
        const sql = `SELECT r.request_id,r.receiver_id,p.full_name AS receiver_name,r.status, r.sent_at FROM requests r JOIN profiles p ON p.profile_id = r.receiver_id WHERE r.sender_id = ? ORDER BY r.sent_at DESC `;

        pool.query(sql, [profile_id], (err2, data) => {
            if (err2) return res.send(result.createResult(err2));
            res.send(result.createResult(null, data));
        });
    });
});




router.put('/request/accept', (req, res) => {
    const user_id = req.user_id;   
    const { request_id } = req.body;
    if (!request_id)
        return res.send(result.createResult("request_id is required"));
    // const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
    // pool.query(getProfileSql, [user_id], (err, profileResult) => {
    //     if (err) return res.send(result.createResult(err));
    //     if (profileResult.length === 0)
    //         return res.send(result.createResult("Profile not found"));
    //     const profile_id = profileResult[0].profile_id;
        const sql = `UPDATE requests SET status = 'Accepted', responded_at = NOW() WHERE request_id = ?`;
        pool.query(sql, [request_id], (err2, data) => {
            if (err2) return res.send(result.createResult(err2));
            if (data.affectedRows === 0)
                return res.send(result.createResult("No pending request found to accept"));
            res.send(result.createResult(null, "Request accepted"));
        });
    });




router.put('/request/reject', (req, res) => {
    const receiver_id = req.user_id;   // 
    const { request_id } = req.body;
    const sql = "UPDATE requests SET status = 'Rejected', responded_at = NOW() WHERE request_id = ?"
    pool.query(sql, [request_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, 'Request rejected'));
    })
})



module.exports = router