const db = require('../model/db')

class CommnetController {
  //------------------------------------------------------//
  //
  async getSpecified(req, res) {
    const id = req.params.id
    const specifiedComment = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )

    if (specifiedComment.rows[0]) {
      res.status(200)
      res.send(specifiedComment.rows[0])
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getSpecifiedLikes(req, res) {
    const id = req.params.id
    const specifiedComment = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )
    const specifiedLikes = await db.query(
      'SELECT * FROM likes WHERE comment_id=$1;',
      [id]
    )

    if (specifiedComment.rows[0] && specifiedLikes.rows[0]) {
      res.status(200).json(specifiedLikes.rows)
    } else if (specifiedComment.rows[0] && !specifiedLikes.rows[0]){
      res.status(200).json({likes: 0})
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async postLike(req, res) {
    const { selftype, author } = req.body
    const id = req.params.id
    const author_id = await db.query(
      'SELECT id FROM users WHERE login=$1;',
      [author]
    )
    const commentExist = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )
    await db.query(
      'DELETE FROM likes WHERE comment_id=$1 AND author=$2;',
      [id, author]
    )
    if (!!author_id.rows[0] && !!commentExist.rows[0]) {
      // const result =
      await db.query(
        'INSERT INTO likes(author, author_id, selftype, comment_id) VALUES($1,$2,$3,$4);',
        [author, author_id.rows[0].id, selftype, id]
      )
      res.status(200)
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async updateSpecified(req, res) {
    let { content, author } = req.body
    const id = req.params.id
    const checkAuth = await db.query(
      'SELECT id FROM users WHERE login=$1;',
      [author]
    )
    const checkId = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )

    if (
      !!checkAuth.rows[0] &&
      checkId.rows[0] &&
      checkId.rows[0].author_id === checkAuth.rows[0].id
    ) {
      await db.query(`UPDATE comments SET content=$1 WHERE id=$2;`, [
        content,
        id,
      ])
      res.status(200)
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecified(req, res) {
    const id = req.params.id
    const { author } = req.body
    const checkId = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )

    if (!!checkId.rows[0] || req.user.role == 'admin') {
      await db.query(
        'DELETE FROM comments WHERE id=$1 AND author=$2;',
        [id, author]
      )
      res.status(200)
    } else {
      res.status(400)
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecifiedLike(req, res) {
    const id = req.params.id
    const { author } = req.body
    const checkId = await db.query(
      'SELECT * FROM comments WHERE id=$1;',
      [id]
    )

    if (!!checkId.rows[0] || req.user.role == 'admin') {
      await db.query(
        'DELETE FROM likes WHERE comment_id=$1 AND author=$2;',
        [id, author]
      )
      res.status(200)
    } else {
      res.status(400)
    }

    res.end()
  }
  //------------------------------------------------------//
  //
}

module.exports = CommnetController
