const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const passport = require('passport')
const userRouter = require('./routes/users.routes')
const postRouter = require('./routes/posts.routes')
const commentRouter = require('./routes/comments.routes')
const categoryRouter = require('./routes/categories.routes')
const authRouter = require('./routes/auth.routes')
const PORT = process.env.PORT || 3000
const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev')) // good logger
app.use(cors()) //CORS-enabled for all origins
app.use(express.json())

app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)
app.use('/api', categoryRouter)
app.use('/api', authRouter)


app.listen(PORT, () => console.log(`server started on port ${PORT}`))
