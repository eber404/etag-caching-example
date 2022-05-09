const { randomUUID, createHash } = require('crypto')
const express = require('express')

const app = express()

app.use(express.json())

let etag

const users = [
  { name: 'fulano', email: 'fulano@email.com' },
  { name: 'ciclano', email: 'ciclano@email.com' },
]

app.get('/api/users', (req, res) => {
  const ifNoneMatch = req.header('If-None-Match')
  const etag = createHash('sha256', users)
    .update(JSON.stringify(users))
    .digest('hex')

  res.setHeader('ETag', etag)

  if (ifNoneMatch === etag) {
    return res.send().status(304)
  }

  res.status(200).json(users)
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body

  const user = { name, email }

  users.push(user)

  res.status(201).send()
})

const PORT = 3000

app.listen(3000, () => console.log('listen to port', PORT))
