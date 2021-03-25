const db = require('../model/db')

class PostController {
  //------------------------------------------------------//
  //
  async getAll(req, res) {
    let { rows } = await db.query('SELECT * FROM posts;');
    let likes = await db.query('SELECT * FROM likes;');

    likes = likes.rows;
    if (!likes) likes = [];
    res.status(200)
    //if u ain't admin u weill get only active posts
    if (req.user && req.user.role !== 'admin') rows = rows.filter(elem.status)
    res.send({rows, likes})
    res.end()
  }
  //------------------------------------------------------//
  //
  async createNewOne(req, res) {
    let { title, content, category, author, id } = req.body

    if (category) {
      category = '{' + category.join() + '}'
      await db.query(
        `INSERT INTO posts (title, content, author, author_id, category)
         VALUES($1, $2, $3, $4, $5);`,
        [title, content, author, id, category]
      )
      res.status(200)
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getSpecified(req, res) {
    const id = req.params.id
    const result = await db.query(
      'SELECT * FROM posts WHERE id=$1;',
      [id]
    )

    if (!!result.rows[0]) {
      res.status(200)
      res.send(result.rows[0])
    } else {
      res.status(400)
      res.send('err, id not found')
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getAllComments(req, res) {
    const id = req.params.id
    const result = await db.query(
      'SELECT * FROM comments WHERE post_id=$1;',
      [id]
    )

    if (!!result.rows[0]) {
      res.status(200)
      res.send(result.rows)
    } else {
      res.status(400)
      res.send('err, id not found')
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getAllCategories(req, res) {
    const id = req.params.id
    const result = await db.query(
      'SELECT category FROM posts WHERE id=$1;',
      [id]
    )

    if (!!result.rows[0]) {
      res.status(200)
      res.send(result.rows[0].category)
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getAllLikes(req, res) {
    const id = req.params.id
    const result = await db.query(
      'SELECT * FROM likes WHERE post_id=$1;',
      [id]
    )

    if (!!result.rows[0]) {
      res.status(200).json(result.rows)
    } else {
      res.status(200).json({likes: 0})
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async createNewComment(req, res) {

    const { author, content } = req.body
    const id = req.params.id
    const author_id = await db.query(
      'SELECT id FROM users WHERE login=$1;',
      [author]
    )
    const checkId = await db.query(
      'SELECT * FROM posts WHERE id=$1;',
      [id]
    )

    if (!!author_id.rows[0].id && !!checkId.rows[0]) {
      // const result =
      await db.query(
        `INSERT INTO comments(author, author_id, content, post_id)
         VALUES($1,$2,$3,$4) RETURNING *;`,
        [author, author_id.rows[0].id, content, id]
      )
      res.status(200)
      // res.send(result.rows[0])
    } else {
      res.status(400)
      // res.send('err, id not found')
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async createNewLike(req, res) {
    const { selftype, author } = req.body
    const id = req.params.id
    const author_id = await db.query(
      'SELECT id FROM users WHERE login=$1;',
      [author]
    )
    const postExist = await db.query(
      'SELECT * FROM posts WHERE id=$1;',
      [id]
    )

    await db.query(
      'DELETE FROM likes WHERE post_id=$1 AND author=$2;',
      [id, author]
    )
    if (!!author_id.rows[0] && !!postExist.rows[0]) {
      // const result =
      await db.query(
        `INSERT INTO likes(author, author_id, selftype, post_id)
         VALUES($1,$2,$3,$4);`,
        // 'RETURNING *;' for getting inserted like back
        [author, author_id.rows[0].id, selftype, id]
      )
      res.status(200)
      // res.send(result.rows[0])
    } else {
      res.status(400)
      // res.send('err, id not found')
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async updateSpecified(req, res) {
    let { title, content, category } = req.body
    const id = req.params.id

    try {
      category = '{' + category.join() + '}'
      await db.query(
        `UPDATE posts SET title=$1, content=$2, category=$3
         WHERE id=$4;`,
        [title, content, category, id]
      )
      res.status(200)
    } catch(err) {
      // res.send('err, id not found')
      res.status(400).json({message: err})
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecified(req, res) {
    const id = req.params.id
    const { author } = req.body
    const checkId = await db.query(
      'SELECT * FROM posts WHERE id=$1;',
      [id]
    )

    if (!!checkId.rows[0] || req.user.role == 'admin') {
      await db.query(
        `DELETE FROM posts
         WHERE id=$1 AND author=$2;`,
        [id, author]
      )
      res.status(200)
    } else {
      res.status(400)
      // res.send('err, id not found!')
    }

    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecifiedLike(req, res) {
    const id = req.params.id
    const { author } = req.body
    const checkId = await db.query(
      'SELECT * FROM posts WHERE id=$1;',
      [id]
    )

    if (!!checkId.rows[0] || req.user.role == 'admin') {
      await db.query(
        'DELETE FROM likes WHERE post_id=$1 AND author=$2;',
        [id, author]
      )
      res.status(200)
    } else {
      res.status(400)
      // res.send('err, id not found!')
    }
    res.end()
  }
  //------------------------------------------------------//
  //
}

module.exports = PostController
