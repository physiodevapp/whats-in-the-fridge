const nodemailer = require('nodemailer')

// Structure not implemented for deployment testing

const transporter = nodemailer
  .createTransport({
    service: "example",
    auth: {
      user: "example@example.com",
      pass: process.env.NODEMAILER_KEY || ''
    }
  });

module.exports.sendInvitationEmail = (invitation) => {
  transporter
    .sendMail({
      from: "What's in the fridge? <example@gexample.com>",
      to: `${invitation.guestEmail}`,
      subject: "New invitation",
      text: "New invitation to What's in the fridge? app :)",
      html: `<h2>New invitation to pantry waits for you <a href="${process.env.WEB_URL}/pantries/${invitation.pantryObjId}/join">here</a>!</h2><br>
          <h3>Use this code: ${invitation.token} to join.<br>Have a nice day.</h3>`
    })
    .then((info) => console.log(info))
    .catch((error) => console.lor(error))
}