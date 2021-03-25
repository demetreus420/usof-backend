const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'usofbetadgorkavyi@gmail.com',
      pass: '1488Siegheil',
    },
  },
  {
    from: 'Юсоф Юсофович <usofbetadgorkavyi@gmail.com>',
  }
)

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) console.log(err)
    console.log('Emmail sent: ', info)
  })
}

module.exports = mailer
