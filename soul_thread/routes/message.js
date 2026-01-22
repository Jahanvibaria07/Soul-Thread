const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()


router.post('/message/send', (req, res) => {
    const sender_id = req.user_id; 
    const { receiver_id, message_text } = req.body; 
      const sql = `INSERT INTO messages (sender_id, receiver_id, message_text)VALUES (?, ?, ?)`;
  pool.query(sql, [sender_id, receiver_id, message_text], (err) => {
    if (err) {
      return res.send(result.createResult(err));
    }

    res.send(result.createResult(null, 'Message sent successfully'));
  });
});

router.post('/message/chat', (req, res) => {
    const sender_id = req.sender_id;  
    const { receiver_id } = req.body;

    const sql = "SELECT message_id, sender_id, receiver_id, message_text, sent_at FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at ASC"

    pool.query(sql,[sender_id, receiver_id, receiver_id, sender_id],(err, data) => {
            if (err) return res.send(result.createResult(err));
            res.send(result.createResult(null, data));
        }
    )
})


module.exports = router