import dotenv from "dotenv"
import {MongoClient}from "mongodb"
import express from "express"
dotenv.config();

const app = express()
const port = 3000
console.log(process.env.CONN)
const client = new MongoClient(process.env.CONN);

app.get('/',async (req, res) => {
  const database = client.db('Ornamental');
  const users=database.collection('users');
  res.send(await users.findOne({"name":"jer123se12"}))
})
app.post('/createRoom',async (req, res) => {
  let schema={"_id":{"$oid":"676144056bf927450093b5e4"},
    "code":{
      "$numberInt":"1234"
    },
    "name":"my secret santa",
    "ornaments":[
      {
        "id":"",
        "location":{
          "$numberInt":"1"
        },
        "custom data":"",
        "user":""
      }],
    "secret_santa":{
      "started":false,
      "end_date":"",
      "user_pair":[
        {
          "origin":"",
          "recipient":"",
          "bought":false
        }
      ]},
    "admin_id":"",
    "list_of_users":"",
    "gifts":[
      {
        "location":
          {
            "$numberInt":"0"
          },
        "shape":{
          "$numberInt":"2"
        },
        "origin":"",
        "target":""
      }]
    }
  const database = client.db('Ornamental');
  const rooms=database.collection('rooms');
  
  res.send(users.findOne({"name":"jer123se12"}))
})
app.post('/createUser', (req, res) => {
})
app.get('/user/:uid', (req, res) => {
})
app.get('/room/:rid', (req, res) => {
})
app.post('/room/:rid/addUser', (req, res) => {
})
app.post('/room/:rid/addUser', (req, res) => {
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

