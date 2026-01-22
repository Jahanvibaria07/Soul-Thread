const express=require('express')
const cors = require('cors')

const userRouter=require('./routes/user')
const preferenceRouter=require('./routes/preferences')
const matchRouter=require('./routes/match')
const requestRouter = require('./routes/request')
const messageRouter = require('./routes/message')
const adminRouter = require('./routes/admin')
const authorizeUser=require('./utils/auth')
 
const app=express()

app.use(cors())
app.use(express.json())
app.use(authorizeUser)
app.use('/user', userRouter)
app.use('/user',preferenceRouter)
app.use('/user',matchRouter)
app.use('/user', requestRouter)
app.use('/user', messageRouter)
app.use('/user', adminRouter)

app.listen(5000,'0.0.0.0',()=>{
    console.log('Server started at port 5000')
})