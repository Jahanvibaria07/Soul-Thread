const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()


router.post('/request/send', (req, res) => {
  const user_id = req.user_id;
  const { receiver_id } = req.body; 

  const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
  pool.query(getProfileSql, [user_id], (err, senderData) => {
    if (err) return res.send(result.createResult(err));
    if (senderData.length === 0) return res.send(result.createResult("Sender Profile Not Found"));

    const sender_profile_id = senderData[0].profile_id;

    if (sender_profile_id == receiver_id)
      return res.send(result.createResult("Cannot send request to yourself"));

    const checkSql = "SELECT request_id FROM requests WHERE sender_id = ? AND receiver_id = ?";
      pool.query(checkSql, [sender_profile_id, receiver_id], (err3, existing) => {
        if (err3) return res.send(result.createResult(err3));
        if (existing.length > 0) return res.send(result.createResult(null, { alreadySent: true }));

        const insertSql = `
          INSERT INTO requests (sender_id, receiver_id, status, sent_at)
          VALUES (?, ?, 'Pending', NOW())
        `;
        pool.query(insertSql, [sender_profile_id, receiver_id], (err4) => {
          if (err4) return res.send(result.createResult(err4));
          res.send(result.createResult(null, "Request sent successfully"));
        });
      });
  });
});


router.get('/request/received', (req, res) => {
  console.log(req.user_id)
  const user_id = req.user_id;

  const profileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
  pool.query(profileSql, [user_id], (err, profileData) => {
    if (err) return res.send(result.createResult(err));
    if (profileData.length === 0) return res.send(result.createResult("Profile not found"));

    const my_profile_id = profileData[0].profile_id;

  
    const sql = `
      SELECT 
        r.request_id,
        r.status,
        r.sent_at,
        p.profile_id AS sender_profile_id,
        p.full_name,
        p.gender,
        p.city,
        p.education,
        p.occupation
      FROM requests r
      JOIN profiles p ON p.profile_id = r.sender_id
      WHERE r.receiver_id = ? AND r.status = 'Pending'
      ORDER BY r.sent_at DESC
    `;
    pool.query(sql, [my_profile_id], (err2, data) => {
      if (err2) return res.send(result.createResult(err2));
      res.send(result.createResult(null, data));
    });
  });
});


router.get('/request/sent', (req, res) => {
    const user_id = req.user_id; 
    const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
    pool.query(getProfileSql, [user_id], (err, profileResult) => {
        if (err) return res.send(result.createResult(err));
        if (profileResult.length === 0)
            return res.send(result.createResult('Profile not found'));
        const profile_id = profileResult[0].profile_id;
        const sql = `
      SELECT 
        r.request_id,
        r.status,
        r.sent_at,
        p.profile_id AS receiver_profile_id,
        p.full_name AS receiver_name
      FROM requests r
      JOIN profiles p ON p.profile_id = r.receiver_id
      WHERE r.sender_id = ?
      ORDER BY r.sent_at DESC
    `;

        pool.query(sql, [profile_id], (err2, data) => {
            if (err2) return res.send(result.createResult(err2));
            res.send(result.createResult(null, data));
        });
    });
});


router.put('/request/accept', (req, res) => {
  const user_id = req.user_id
  const { request_id } = req.body

  const getProfileSql = `SELECT profile_id FROM profiles WHERE user_id = ?`
  pool.query(getProfileSql, [user_id], (err, profileData) => {
    if (err) return res.send(result.createResult(err))
    if (profileData.length === 0)
      return res.send(result.createResult("Profile not found"))
    const receiver_profile_id = profileData[0].profile_id

    const getRequestSql = `SELECT sender_id FROM requests WHERE request_id = ? AND receiver_id = ?`
    pool.query(getRequestSql,[request_id, receiver_profile_id],(err2, requestData) => {
        if (err2) return res.send(result.createResult(err2))
        if (requestData.length === 0)
          return res.send(result.createResult("No pending request found"))
        const sender_profile_id = requestData[0].sender_id

        const acceptSql = `UPDATE requests SET status = 'Accepted', responded_at = NOW() WHERE request_id = ?`
        pool.query(acceptSql, [request_id], (err3) => {
          if (err3) return res.send(result.createResult(err3))

          const checkMatchSql = `SELECT match_id FROM matches WHERE (profile1_id = ? AND profile2_id = ?) OR (profile1_id = ? AND profile2_id = ?) `
          pool.query( checkMatchSql,[sender_profile_id, receiver_profile_id,receiver_profile_id,sender_profile_id, ],
            (err4, matchData) => {
              if (err4) return res.send(result.createResult(err4))

              if (matchData.length > 0) {
                return res.send(
                  result.createResult(null, "Request accepted (already matched)")
                )
              }

              const insertMatchSql = `INSERT INTO matches (profile1_id, profile2_id, status) VALUES (?, ?, 'Active') `
              pool.query(insertMatchSql,[sender_profile_id, receiver_profile_id],(err5) => {
                  if (err5) return res.send(result.createResult(err5))
                  res.send( result.createResult(null, "Request accepted & match created" )
                  )
                }
              )
            }
          )
        })
      }
    )
  })
})


// router.put('/request/accept', (req, res) => {
//     const user_id = req.user_id;
//     const { request_id } = req.body;

//     const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
//     pool.query(getProfileSql, [user_id], (err, profileData) => {
//         if (err) return res.send(result.createResult(err));
//         if (profileData.length === 0)
//             return res.send(result.createResult("Profile not found"));

//         const receiver_profile_id = profileData[0].profile_id;

//         const sql = `
//             UPDATE requests 
//             SET status = 'Accepted', responded_at = NOW() 
//             WHERE request_id = ? AND receiver_id = ?
//         `;

//         pool.query(sql, [request_id, receiver_profile_id], (err2, data) => {
//             if (err2) return res.send(result.createResult(err2));
//             if (data.affectedRows === 0)
//                 return res.send(result.createResult("No pending request found"));
//             res.send(result.createResult(null, "Request accepted"));
//         });
//     });
// });




router.put('/request/reject', (req, res) => {
    const user_id = req.user_id;
    const { request_id } = req.body;

    const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
    pool.query(getProfileSql, [user_id], (err, profileData) => {
        if (err) return res.send(result.createResult(err));
        if (profileData.length === 0)
            return res.send(result.createResult("Profile not found"));

        const receiver_profile_id = profileData[0].profile_id;

        const sql = `
            UPDATE requests 
            SET status = 'Rejected', responded_at = NOW() 
            WHERE request_id = ? AND receiver_id = ?
        `;

        pool.query(sql, [request_id, receiver_profile_id], (err2, data) => {
            if (err2) return res.send(result.createResult(err2));
            res.send(result.createResult(null, 'Request rejected'));
        });
    });
});



module.exports = router