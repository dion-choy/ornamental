"use server"
import clientPromise from "../../lib/mongodb";

export async function getUsers(){
  const client = await clientPromise;
  const db = client.db("Ornamental");
  const movies = await db
    .collection("users")
    .find({}).toArray()
  console.log(movies)
}
export async function checkCode(code){
  console.log(code)
  const client = await clientPromise;
  const db = client.db("Ornamental");
  const room = await db
    .collection("rooms")
    .findOne({"code":parseInt(code)})
  return (room!=null)
  
}
