const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const passport = require('passport')
const userRouter = require('./routes/users.routes')
const postRouter = require('./routes/posts.routes')
const commentRouter = require('./routes/comments.routes')
const categoryRouter = require('./routes/categories.routes')
const authRouter = require('./routes/auth.routes')
const PORT = process.env.PORT || 8080
const app = express()

const errorHandler = async (err, req, res, next) => {
    if(err) console.log(err);
    next();
};

app.use('/static',express.static('images'));
app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(morgan('dev')) // good logger
app.use(cors()) //CORS-enabled for all origins
app.use(express.json())

app.use('/api', userRouter, errorHandler)
app.use('/api', postRouter, errorHandler)
app.use('/api', commentRouter, errorHandler)
app.use('/api', categoryRouter, errorHandler)
app.use('/api', authRouter, errorHandler)


app.listen(PORT, () => console.log(`server started on port ${PORT}`))
