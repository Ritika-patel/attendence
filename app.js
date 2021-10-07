const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
const port = process.env.port || 3000
const users= [];
var http = require('http');
const { json } = require('express');
var requests = require('requests');

app.use(express.urlencoded({ extended: false }))

app.get('/error', (req, res) => {
  res.render('error.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register',  async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      password: req.body.password
    })
    
    res.redirect('/data')
  } catch {
    res.redirect('/error')
  }

  // console.log(users[0].password)
// const username='11156925207'
const username = users[0].name
const password=users[0].password

requests('https://newlnct.herokuapp.com/?username=' + username + '&password=' + password)
.on('data', function (chunk) {
  const data = JSON.parse(chunk);
  app.get('/data', (req, res) => {
    res.render('index.ejs', {
       present: data['Present '],
       Lectures: data['Total Lectures'],
       percentage: data.Percentage
      })
  })

})
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
  console.log('end');
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



