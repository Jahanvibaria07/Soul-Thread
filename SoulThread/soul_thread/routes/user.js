const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  pool.query(sql, [email], (err, data) => {
    if (err)
      return res.send(result.createResult(err));

    if (data.length === 0)
      return res.send(result.createResult("Invalid Email"));

    const user = data[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err)
        return res.send(result.createResult(err));

      if (!match)
        return res.send(result.createResult("Invalid Password"));

      const token = jwt.sign({ user_id: user.user_id }, config.Secret);

      console.log("Token:", token)


      return res.send(result.createResult(null, {
        token,
        user_id: user.user_id,
        email: user.email
      }));
    });
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


router.post('/profile', (req, res) => {
  console.log("HEADERS:", req.headers);
  console.log("USER ID:", req.user_id);
  console.log("BODY:", req.body);
  const user_id = req.user_id;
  const { full_name, gender, height, religion, caste, mother_tongue, education, occupation, income, marital_status, hobbies, about_me, address, city, state, country, age } = req.body

  const sql = 'Insert into profiles(user_id,full_name,gender,height,religion,caste,mother_tongue,education,occupation,income,marital_status,hobbies,about_me,address,city,state,country,age) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name),gender = VALUES(gender), height = VALUES(height), marital_status = VALUES(marital_status) '
  pool.query(sql, [user_id, full_name, gender, height, religion, caste, mother_tongue, education, occupation, income, marital_status, hobbies, about_me, address, city, state, country, age], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

router.get('/profile', (req, res) => {
  const user_id = req.user_id;
  const sql = `SELECT 
  u.user_id,
  u.email,
  p.profile_id,
  p.full_name,
  p.gender,
  p.age,
  p.height,
  p.religion,
  p.caste,
  p.mother_tongue,
  p.education,
  p.occupation,
  p.income,
  p.marital_status,
  p.hobbies,
  p.about_me,
  p.address,
  p.city,
  p.state,
  p.country,
  ph.photo_id,
  ph.photo_url
FROM users u
LEFT JOIN profiles p 
  ON p.profile_id = (
      SELECT profile_id 
      FROM profiles 
      WHERE user_id = u.user_id
      ORDER BY updated_at DESC
      LIMIT 1
  )
LEFT JOIN photos ph 
  ON ph.profile_id = p.profile_id
WHERE u.user_id = ?;
`
  pool.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.send(result.createResult(err))
    }
    if (data.length == 0) {
      return res.send(result.createResult("Profile not found"))
    }
    res.send(result.createResult(null, data[0]))
  })
})



router.put('/profile/update', (req, res) => {
  const user_id = req.user_id;
  const {
    full_name,
    height,
    religion,
    caste,
    mother_tongue,
    education,
    occupation,
    income,
    marital_status,
    hobbies,
    about_me,
    address,
    city,
    state,
    country
  } = req.body;
  const sql = `
UPDATE profiles 
SET 
  full_name = ?,
  height = ?,
  religion = ?,
  caste = ?,
  mother_tongue = ?,
  education = ?,
  occupation = ?,
  income = ?,
  marital_status = ?,
  hobbies = ?,
  about_me = ?,
  address = ?,
  city = ?,
  state = ?,
  country = ?
WHERE user_id = ?
`;
  pool.query(sql, [
    full_name,
    height,
    religion,
    caste,
    mother_tongue,
    education,
    occupation,
    income,
    marital_status,
    hobbies,
    about_me,
    address,
    city,
    state,
    country,
    user_id,
  ], (err, data) => {
    console.log("data", data)
    console.log("err", err)
    res.send(result.createResult(err, data))
  })
})

router.put('/profile', (req, res) => {
  const user_id = req.user_id;

  // 1. Get whatever fields frontend sends
  const data = req.body;

  // 2. If nothing is sent
  if (Object.keys(data).length === 0) {
    return res.send(result.createResult("No data to update"));
  }

  // 3. Build SQL parts
  const fields = Object.keys(data);      // ["education", "occupation"]
  const values = Object.values(data);    // ["BTech", "Engineer"]

  const setQuery = fields.map(field => `${field} = ?`).join(', ');

  const sql = `UPDATE profiles SET ${setQuery} WHERE user_id = ?`;

  // 4. Run query
  pool.query(sql, [...values, user_id], (err, resultData) => {
    res.send(result.createResult(err, resultData));
  });
});

router.get('/profile/status', (req, res) => {
  const user_id = req.user_id


  const sql = 'SELECT profile_id FROM profiles WHERE user_id = ?';

  pool.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.send(result.createResult(err));
    }

    if (data.length === 0) {
      return res.send(result.createResult(null, { profileCompleted: false }));
    }

    res.send(result.createResult(null, { profileCompleted: true }));
  });
});


router.delete('/profile', (req, res) => {
  const user_id = req.user_id;
  const sql = 'Delete from profiles where user_id=?'
  pool.query(sql, [user_id], (err, data) => {
    res.send(result.createResult(err, data))
  })
})



module.exports = router