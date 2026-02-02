const express = require("express");
const pool = require("../utils/db");
const result = require("../utils/result");
const multer = require("multer"); // for file uploads
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/photos");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
   
    const ext = path.extname(file.originalname);
    cb(null, `${req.user_id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ---------- Upload / Update Photo ----------
router.post("/photo", upload.single("photo"), (req, res) => {
  const user_id = req.user_id;

  if (!req.file) return res.send(result.createResult("No photo uploaded"));

  const photo_url = `/uploads/photos/${req.file.filename}`;

  // Get profile_id
  const getProfileSql = "SELECT profile_id FROM profiles WHERE user_id = ?";
  pool.query(getProfileSql, [user_id], (err, profileData) => {
    if (err) return res.send(result.createResult(err));
    if (profileData.length === 0) return res.send(result.createResult("Profile not found"));

    const profile_id = profileData[0].profile_id;

    // Check if photo exists
    const checkSql = "SELECT photo_id FROM photos WHERE profile_id = ?";
    pool.query(checkSql, [profile_id], (err2, data) => {
      if (err2) return res.send(result.createResult(err2));

      if (data.length > 0) {
        // Update existing photo
        const updateSql = "UPDATE photos SET photo_url = ?, uploaded_at = NOW() WHERE profile_id = ?";
        pool.query(updateSql, [photo_url, profile_id], (err3) => {
          if (err3) return res.send(result.createResult(err3));
          return res.send(result.createResult(null, { photo_url, message: "Photo updated successfully" }));
        });
      } else {
        // Insert new photo
        console.log("data",profile_id,photo_url)
        const insertSql = "INSERT INTO photos (profile_id, photo_url, uploaded_at) VALUES (?, ?, NOW())";
        pool.query(insertSql, [profile_id, photo_url], (err3) => {
          if (err3) return res.send(result.createResult(err3));
          return res.send(result.createResult(null, { photo_url, message: "Photo uploaded successfully" }));
        });
      }
    });
  });
});

// ---------- Get Photo by Profile ----------
router.get("/photo/:profile_id", (req, res) => {
  const { profile_id } = req.params;

  const sql = `
    SELECT p.profile_id, ph.photo_url
    FROM profiles p
    LEFT JOIN photos ph ON ph.profile_id = p.profile_id
    WHERE p.profile_id = ?
  `;

  pool.query(sql, [profile_id], (err, data) => {
    console.log(profile_id)
    if (err) return res.send(result.createResult(err));
    if (data.length === 0){
      return res.send(result.createResult("No profile found"));
    }
    // console.log("dataaaa",data[0])

    res.send(result.createResult(null, data[0]));
  });
});


module.exports = router;
