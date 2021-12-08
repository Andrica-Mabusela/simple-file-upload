const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')


// connect to the database
mongoose.connect('mongodb://localhost/fileuploads')
mongoose.connection.once('open', () => {
  console.log('database connection established')
})

mongoose.connection.on('error', () => {
  console.log(error)
})

// load user model
const User = require('./models/User')

const app = express()

// EJS SETUP
app.set('view engine', 'ejs')

// serve static files
app.use(express.static('public'))

// parse post requests
app.use( express.urlencoded({extended: false}) )


app.get('/single', (req, res) => {
  res.render('single')
})

app.get('/multiple', (req, res) => {
  res.render('multiple')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/users', (req, res) => {
  User.find({}).then(users => {
    if(users) {
      res.render('users', {users: users})
    }
  })
  .catch(error => console.log(error))
})



// create a storage engine
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    cb(null,  file.originalname)
  }
})

const upload = multer({storage: fileStorageEngine})

app.post('/single', upload.single('image'), (req, res) => {
    res.send('Single file uploaded')
})

app.post('/multiple', upload.array('images', 3) ,(req, res) => {
  res.send('multiple files uploaded')
})

// register post handle
app.post('/register', upload.single('image') ,(req, res) => {
    const {username, email, password, image} = req.body

    User.create({username, email, password, image: 'images/' + req.file.filename})
    .then(user => {
      console.log(req.file)
      res.send('user created')
    })
    .catch(error => {
      console.log(error)
    })

})


app.listen(3000, () => console.log('Server listening on port 3000'))