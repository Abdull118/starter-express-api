const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mailjet = require('node-mailjet').apiConnect(
    'f4a0f153f4d1bf28b57b1fcbe1ead5c1',
  'b92df3a4e7866ddf9372a1a80b50fa04'
)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/send-email', (req, res) => {
  const { name, email, service, phone, customService, description } = req.body
  const serviceRequested = service === 'Other' ? customService : service
  const recipientEmail = process.env.RECIPIENT_EMAIL || 'naimi.airsh@gmail.com'

  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: email,
            Name: name,
          },
          To: [
            {
              Email: 'naimi.airsh@gmail.com',
              Name: 'You',
            },
          ],
          Subject: `Lead: ${serviceRequested}`,
          TextPart: `Name: ${name}\nEmail: naimi.airsh@gmail.com\nService Requested: ${serviceRequested}\nPhone: ${phone}`,
          HTMLPart: `
            <h3>Service Request</h3>
            <p>Name: ${name}</p>
            <p>Email: naimi.airsh@gmail.com</p>
            <p>Service Requested: ${serviceRequested}</p>
            <p>Description: ${description}
            <p>Phone: ${phone}</p>
          `,
        },
      ],
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      res.status(500).send({ message: 'Error sending email' })
      console.log(err)
    })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
