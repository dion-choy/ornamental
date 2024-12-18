"use server"
import clientPromise from "../../lib/mongodb";


export async function checkCode(code){
  console.log(code)
  const client = await clientPromise;
  const db = client.db("Ornamental");
  const room = await db
    .collection("rooms")
    .findOne({"code":parseInt(code)})
  return (room!=null)

}
export async function createRoom(code, name, endDate, budget, description, maxQ, questions){
  let schema={"code":{
    "$numberInt":code
  },
    "name":name,
    "ornaments":[],
    "secret_santa":{
      "description":description,
      "budget":budget,
      "started":false,
      "end_date":endDate,
      "user_pair":[
      ]
    },
    "admin_id":"",
    "max_questions":maxQ,
    "current_question":0,
    "questions":questions,
    "list_of_users":[],
    "gifts":[],

  }
  const client = await clientPromise;
  const db = client.db("Ornamental");
  return await db
    .collection("rooms")
    .insertOne(schema)

}
export async function createUser(password, room, name, isAdmin){
  let schema={
    "room": room,
    "name": name,
    "password": password,
    "target": "" ,
    "general_information": "",
    "giftbought": false,
    "is_admin": isAdmin,
    "answers":[]
  }
  const client = await clientPromise;
  const db = client.db("Ornamental");
  return await db
    .collection("users")
    .insertOne(schema)

}
export async function addPlayer(playerid, roomcode){
  const client = await clientPromise;
  const db = client.db("Ornamental");
  user=await db
    .collection("users")
    .updateOne({ _id: playerid },
  { $set: { 'room': roomcode } })
}
