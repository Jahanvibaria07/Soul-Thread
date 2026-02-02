const express = require('express')
const pool=require('../utils/db')
const result=require('../utils/result')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const router = express.Router()


router.get('/matches-suggestions', (req, res)=>{
    const user_id = req.user_id;

    const sql = `SELECT DISTINCT p.profile_id,p.user_id,p.full_name,p.gender, p.height, p.religion,p.caste, p.education, p.occupation, p.city FROM profiles p JOIN partner_preferences pref ON pref.user_id = ? WHERE p.user_id != ? AND p.gender = pref.gender AND p.height BETWEEN pref.height_min AND pref.height_max AND ( pref.religion IS NULL OR pref.religion = " " OR p.religion = pref.religion )`
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
router.get("/matches", (req, res) => {
  const user_id = req.user_id

  const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?"
  pool.query(getProfileSql, [user_id], (err, profileData) => {
    if (err) return res.send(result.createResult(err))
    if (profileData.length === 0)
      return res.send(result.createResult("Profile not found"))

    const my_profile_id = profileData[0].profile_id

    const sql = `
      SELECT 
  p.profile_id,
  p.full_name,
  p.gender,
  p.city,
  p.education,
  p.occupation
FROM matches m
JOIN profiles p
  ON (
    (m.profile1_id = ? AND p.profile_id = m.profile2_id)
    OR
    (m.profile2_id = ? AND p.profile_id = m.profile1_id)
  )
    LEFT JOIN photos ph
  ON ph.profile_id = p.profile_id
  AND ph.is_primary = 1
WHERE m.status = 'Active';

    `

    pool.query(sql, [my_profile_id, my_profile_id], (err2, data) => {
      if (err2) return res.send(result.createResult(err2))
      res.send(result.createResult(null, data))
    })
  })
})

router.get('/match/status/:receiver_id', (req, res) => {
  const userId = req.user_id;
  const receiver_id = req.params.receiver_id;

  const profileSql = `SELECT profile_id FROM profiles WHERE user_id = ?`;
  pool.query(profileSql, [userId], (err, rows) => {
    if (err) return res.send(result.createResult(err));
    if (rows.length === 0)
      return res.send(result.createResult("Profile not found"));

    const myProfileId = rows[0].profile_id;

    const matchSql = `
      SELECT match_id FROM matches
      WHERE status = 'Active'
        AND profile1_id IN (?, ?)
        AND profile2_id IN (?, ?)
    `;

    pool.query(
      matchSql,
      [myProfileId, receiver_id, myProfileId, receiver_id],
      (err, matchRows) => {
        if (err) return res.send(result.createResult(err));

        if (matchRows.length === 0) {
          return res.send(
            result.createResult(null, { matched: false })
          );
        }

        res.send(
          result.createResult(null, {
            matched: true,
            match_id: matchRows[0].match_id,
          })
        );
      }
    );
  });
});

module.exports = router