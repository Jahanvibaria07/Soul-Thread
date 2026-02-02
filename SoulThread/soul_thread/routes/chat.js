// const {Server} = require("socket.io")
// const jwt = require('jsonwebtoken')
// const config = require('../utils/config')
// const pool = require('../utils/db')

// function initChat(server) {
//   const io = new Server(server, {
//     cors: { origin: "*" },
//   });

//   io.use((socket, next) => {
//     const token = socket.handshake.auth?.token;
//     if (!token) return next(new Error("Authentication error"));
//     try {
//       const payload = jwt.verify(token, config.Secret);
//       socket.user_id = payload.user_id;
//       next();
//     } catch (err) {
//       next(new Error("Authentication error"));
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.user_id);
//     socket.join(socket.user_id.toString());

//     socket.on("sendMessage", ({ receiver_id, message_text }) => {
//       const sql =
//         "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)";
//       pool.query(sql, [socket.user_id, receiver_id, message_text], (err, data) => {
//         if (err) return console.log("DB Error:", err);

//         const message = {
//           message_id: data.insertId,
//           sender_id: socket.user_id,
//           receiver_id,
//           message_text,
//           sent_at: new Date(),
//         };

//         io.to(receiver_id.toString()).emit("receiveMessage", message);
//         socket.emit("receiveMessage", message);
//       });
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.user_id);
//     });
//   });
// }

// module.exports = initChat;