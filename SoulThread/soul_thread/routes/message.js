const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const router = express.Router()


router.post('/message/send', (req, res) => {
  const user_id = req.user_id
  const sql = `select profile_id from profiles where user_id = ?`
  pool.query(sql, [user_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    if (data.length === 0)
      return res.send(result.createResult("Profile not found"));
    const sender_id = data[0].profile_id;

    const { receiver_id, message_text } = req.body;
    if (!receiver_id || !message_text) {
      return res.send(result.createResult("Invalid input"));
    }
    const matchSql = `SELECT * FROM matches
WHERE status = 'Active'
AND (
  (profile1_id = ? AND profile2_id = ?)
  OR
  (profile1_id = ? AND profile2_id = ?)
)
`

    pool.query(matchSql, [sender_id, receiver_id, receiver_id, sender_id], (err, data) => {
      if (err) return res.send(result.createResult(err));

      if (data.length === 0) {
        return res.send(result.createResult("Chat not allowed"));
      }
      const sql = `INSERT INTO messages (sender_id, receiver_id, message_text)VALUES (?, ?, ?)`;
      pool.query(sql, [sender_id, receiver_id, message_text], (err) => {
        if (err) {
          return res.send(result.createResult(err));
        }
        res.send(result.createResult(null, 'Message sent successfully'));
      });
    })
  })
});



router.post('/message/chat', (req, res) => {
  const user_id = req.user_id;
  const { receiver_id } = req.body;
  if (!receiver_id) {
    return res.send(result.createResult("Receiver ID required"));
  }

  const sql = `select profile_id from profiles where user_id = ?`
  pool.query(sql, [user_id], (err, data) => {
    if (err) return res.send(result.createResult(err));
    if (data.length === 0)
      return res.send(result.createResult("Profile not found"));
    const sender_id = data[0].profile_id;
    console.log("idddds", sender_id, receiver_id)

    const matchSql = `SELECT * FROM matches WHERE status = 'Active' AND (profile1_id = ? AND profile2_id = ?) OR (profile1_id = ? AND profile2_id = ?)`;

    pool.query(matchSql, [sender_id, receiver_id, receiver_id, sender_id], (err, data) => {
      if (err) return res.send(result.createResult(err));

      if (data.length === 0) {
        return res.send(result.createResult("Chat not allowed"));
      }
      const sql = "SELECT message_id, sender_id, receiver_id, message_text, sent_at FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at ASC"

      pool.query(sql, [sender_id, receiver_id, receiver_id, sender_id], (err, data) => {
        if (err) return res.send(result.createResult(err));
        res.send(result.createResult(null, data));
      })
    })
  })
})

module.exports = router