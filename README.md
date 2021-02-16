# USOF REST API

My challenge was to create a REST API for my implementation of Stack Overflow.

###**What's done?**:<br/>

- User and Admin access rights
- User Authentication
- User Login, Logout options
- User Registration
- Functionality to reset password and verify user email
- CRUD operations for Posts, Comments, Categories, Likes, Users

##**Authentication module**:<br/>
'
- [x] GET - /api/auth/email-confirmation/<confirm_token> - sets the confirmed status to user in database
- [x] POST - /api/auth/register - registration of a new user, required parameters are [login, password, password confirmation, email]<br/>
- [x] POST - /api/auth/login - log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in<br/>
- [x] POST - /api/auth/logout - log out authorized user<br/>
- [x] POST - /api/auth/password-reset - send a reset link to user email, requiredparameter is [email]<br/>
- [x] POST - /api/auth/password-reset/<confirm_token> - confirm new password with a token from email, required parameter is a [new password]<br/>

##**User module**:<br/>

- [x] GET - /api/users - get all users<br/>
- [x] GET - /api/users/<user_id> - get specified user data<br/>
- [x] POST - /api/users - create a new user, required parameters are [login, password,password confirmation, email, role]. This feature must be accessible only for admins<br/>
- [x] POST - /api/users/avatar - let an authorized user upload his/her avatar. Theuser will be designated by his/her access token<br/>
- [x] - /api/users/<user_id> - update user data<br/>
- [x] DELETE - /api/users/<user_id> - delete user<br/>

##**Post module**:<br/>

- [x] GET - /api/posts- get all posts.This endpoint doesn't require any role, it ispublic. If there are too many posts, you must implement pagination. Page size isup to you<br/>
- [x] GET - /api/posts/<post_id> - get specified post data.Endpoint is public<br/>
- [x] GET - /api/posts/<post_id>/comments - get all comments for the specified post.Endpoint is public<br/>
- [x] POST - /api/posts/<post_id>/comments - create a new comment, required parameteris [content, author]<br/>
- [x] GET - /api/posts/<post_id>/categories - get all categories associated with thespecified post<br/>
- [x] GET - /api/posts/<post_id>/like - get all likes under the specified post<br/>
- [x] POST - /api/posts/- create a new post, required parameters are [title, content, categories, author]<br/>
- [x] POST - /api/posts/<post_id>/like - create a new like under a post<br/>
- [x] PATCH - /api/posts/<post_id> - update the specified post (its title, body orcategory). It's accessible only for the creator of the post<br/>
- [x] DELETE - /api/posts/<post_id> - delete a post<br/>
- [x] DELETE - /api/posts/<post_id>/like - delete a like under a post<br/>

##**Categories module**:<br/>

- [x] GET - /api/categories- get all categories<br/>
- [x] GET - /api/categories/<category_id> - get specified category data<br/>
- [x] GET - /api/categories/<category_id>/posts - get all posts associated with thespecified category<br/>
- [x] POST - /api/categories - create a new category, required parameter is [title]<br/>
- [x] PATCH - /api/categories/<category_id> - update specified category data<br/>
- [x] DELETE - /api/categories/<category_id> - delete a category<br/>

##**Comments module**:<br/>

- [x] GET - /api/comments/<comment_id> - get specified comment data<br/>
- [x] GET - /api/comments/<comment_id>/like - get all likes under the specified comment<br/>
- [x] POST - /api/comments/<comment_id>/like - create a new like under a comment<br/>
- [x] PATCH - /api/comments/<comment_id> - update specified comment data<br/>
- [x] DELETE - /api/comments/<comment_id> - delete a comment<br/>
- [x] DELETE - /api/comments/<comment_id>/like - delete a like under a comment<br/>

##**Database tables**:<br/>

- Users<br/>
- Posts<br/>
- Comments<br/>
- Categories<br/>
- Likes<br/>

#installation:

- Before start you need to install PostgreSQL and check the pg_hba.conf.
- You should change a "peer" to "trust" and past:

```md
> sudo service postgresql restart
```

- And then install all dependencies of project:

```md
> npm install
```

#usage:

```md
> npm run start
```

- If you fant to develop something you should use "dev" instead of "start".

```md
> npm run dev
```

#dependencies:<br/>

```md
    "@prettier/plugin-pug": "^1.13.2",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.2",
    "nodemailer": "^6.4.17",
    "nodemon": "^2.0.7",
    "passport": "^0.4.1",
    "passport-jwt": "^4.0.0",
    "pg": "^8.5.1"
```

##Author:<br/>
**Dmytro Gorkavyi** :bowtie:
