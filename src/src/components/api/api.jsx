"use server";
import clientPromise from "../../lib/mongodb";
import { BSON, EJSON, ObjectId } from "bson";

export async function listener(code) {
    console.log(code);
    const client = await clientPromise;
    const db = client.db("Ornamental");

    let change = false;
    let done = false;
    const changeStream = db.collection("rooms").watch([], { fullDocument: "updateLookup" });
    changeStream
        .on("change", (next) => {
            // process next document
            change = next;
            console.log(next);
            done = true;
        })
        .once("error", (error) => {
            // handle error
        });

    return change;
}

export async function checkCode(code) {
    console.log(code);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    const room = await db.collection("rooms").findOne({ code: code.toString() });
    return room != null;
}
export async function createRoom(code, name, endDate, budget, description, maxQ, questions) {
    let schema = {
        code: code.toString(),
        name: name,
        ornaments: [],
        secret_santa: {
            description: description,
            budget: budget,
            started: false,
            end_date: endDate,
            user_pair: [],
        },
        admin_id: "",
        max_questions: maxQ,
        current_question: 0,
        questions: questions,
        list_of_users: [],
        gifts: [],
    };
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let bxon = EJSON.stringify(await db.collection("rooms").insertOne(schema));
    console.log(bxon);
    return bxon;
}
export async function createUser(password, name, admin = false) {
    let schema = {
        room: 0,
        name: name,
        password: password,
        target: "",
        general_information: "",
        nose_color: 0.5,
        giftbought: false,
        has_seen_onboarding: false,
        is_admin: admin,
        has_seen_celebration: false,
        answers: [],
        hasDoneQuiz: false,
    };
    const client = await clientPromise;
    const db = client.db("Ornamental");
    return EJSON.stringify(await db.collection("users").insertOne(schema));
}
export async function getUser(userid) {
    userid = EJSON.parse(userid);
    console.log(userid);

    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").findOne({ _id: userid });
    user = EJSON.stringify(user);
    return user;
}
export async function getUsers(userids) {
    userids = EJSON.parse(userids);

    const useridsList = userids.map((id) => new ObjectId(id));

    const client = await clientPromise;
    const db = client.db("Ornamental");
    let users = await db
        .collection("users")
        .find({ _id: { $in: useridsList } })
        .toArray();
    // console.log("THE USERS", users)
    users = EJSON.stringify(users);
    return users;
}
export async function getRoom(roomid) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let room = await db.collection("rooms").findOne({ code: roomid.toString() });
    console.log(room);
    let roomstr = EJSON.stringify(room);
    console.log(roomstr);
    return roomstr;
}
export async function addPlayer(playerid, roomcode) {
    playerid = EJSON.parse(playerid);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").updateOne(
        { _id: playerid },
        {
            $set: { room: roomcode.toString() },
        }
    );
    return await db.collection("rooms").updateOne(
        { code: roomcode.toString() },
        {
            $push: { list_of_users: playerid },
        }
    );
}

export async function getNoPlayers(roomcode) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("rooms").findOne({
        code: roomcode.toString(),
    });
    return user["list_of_users"].length;
}
export async function checkPlayer(username, password, roomId) {
    console.log("called");
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let users = await db.collection("users").find({ name: username });
    if (users == null) return false;
    while (await users.hasNext()) {
        let user = await users.next();
        if (user["password"] != password || user.room != roomId.toString()) {
        } else {
            users.close();
            return EJSON.stringify(user);
        }
    }
    users.close();
    return false;
}
export async function checkPlayerId(userId, roomId) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").findOne({ _id: userId });
    if (user === null || user.room != roomId.toString()) {
        return false;
    } else {
        return EJSON.stringify(user);
    }
}

export async function addOrnament(roomcode, author, position, ornamentId) {
    author = EJSON.parse(author);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    return await db.collection("rooms").updateOne(
        { code: roomcode.toString() },
        {
            $push: {
                ornaments: {
                    authorid: author,
                    position: position,
                    ornament_id: ornamentId,
                },
            },
        }
    );
}

export async function addGift(roomcode, author, position, rotation, shape, size) {
    author = EJSON.parse(author);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let room = await db.collection("rooms").findOne({
        code: roomcode.toString(),
    });

    let index = room.secret_santa.user_pair.findIndex((o) => {
        return o.author.equals(author);
    });
    console.log(index);

    console.log(
        await db.collection("rooms").updateOne(
            { code: roomcode.toString() },
            {
                $push: {
                    gifts: {
                        authorid: author,
                        recepient: room.secret_santa.user_pair[index].target,
                        position: position,
                        rotation: rotation,
                        shape: shape,
                        size: size,
                    },
                },
            }
        )
    );
    let stri = `secret_santa.user_pair.${index}.has_been_bought`;
    console.log(stri);
    console.log(stri);
    return await db
        .collection("rooms")
        .updateOne(
            { code: roomcode.toString(), "secret_santa.user_pair.author": author },
            { $set: { "secret_santa.user_pair.$.has_been_bought": true } }
        );
}
export async function startSecretSanta(roomCode) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let room = await db.collection("rooms").findOne({
        code: roomCode.toString(),
    });
    let users = room.list_of_users;
    let pairs = [];
    let used = [];
    for (let i = 0; i < users.length; i++) {
        let index = Math.floor(Math.random() * users.length);
        while (used.includes(index) || index == i) {
            index = Math.floor(Math.random() * users.length);
        }
        used.push(index);
        pairs.push({
            author: users[i],
            target: users[index],
            has_been_bought: false,
        });
        console.log(
            await db.collection("users").updateOne(
                { _id: users[i] },
                {
                    $set: { target: users[index] },
                }
            )
        );
    }
    console.log(pairs);
    return await db.collection("rooms").updateOne(
        { code: roomCode.toString() },
        {
            $set: { "secret_santa.user_pair": pairs, "secret_santa.started": true },
        }
    );
}
export async function hasSecretSantaStarted(roomcode) {
    const client = await clientPromise;
    const db = client.db("Ornamental");

    let room = await db.collection("rooms").findOne({
        code: roomcode.toString(),
    });
    return room["secret_santa"]["started"];
}

export async function hasQuizStarted(roomcode) {
    const client = await clientPromise;
    const db = client.db("Ornamental");

    let room = await db.collection("rooms").findOne({
        code: roomcode.toString(),
    });
    return room["current_question"] == 1 ? true : false;
}
export async function getQuestions(roomCode, userid) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let room = await db.collection("rooms").findOne({
        code: roomCode.toString(),
    });
    let users = room.list_of_users;
    let recepients = room.secret_santa.user_pair;
    let questions = room["questions"];
    let userId = EJSON.parse(userid);
    let correctuser = null;
    for (let i = 0; i < recepients.length; i++) {
        console.log(recepients[i].author);
        console.log(userId);
        console.log("next");
        if (recepients[i].author.toString() == userId.toString()) {
            correctuser = recepients[i].target;
        }
    }
    let rName = (await db.collection("users").findOne({ _id: correctuser })).name;
    let answers = {};
    for (let i = 0; i < users.length; i++) {
        let user = await db.collection("users").findOne({ _id: users[i] });
        answers[user["_id"]] = user["answers"];
    }
    let qna = [];
    for (let i = 0; i < questions.length; i++) {
        let questObj = {};
        let ures = {};
        let j = 0;
        questObj["answer"] = "";
        for (let user in answers) {
            console.log(user);
            console.log(correctuser);
            console.log(userId.equals(correctuser));
            if (user == correctuser.toString()) {
                questObj["answer"] = j;
            }
            j += 1;
            ures[user] = answers[user][i];
        }
        questObj["responses"] = ures;
        questObj["question"] = questions[i].replace("your", `${rName}'s`).replace("you", rName).replace("do", "does");

        qna.push(questObj);
    }
    return qna;
}
// TODO: add a function to update users answers to the questions
export async function updateAnswers(userid, answers) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").updateOne(
        { _id: userid },
        {
            $set: { answers: answers },
        }
    );
}
export async function hasSeenOnboarding(userId, answers) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let formattedAnswers = [];
    for (let i = 0; i < answers.length; i++) {
        formattedAnswers.push(answers[i]["value"]);
    }
    updateAnswers(userId, formattedAnswers);
    let user = await db.collection("users").updateOne(
        { _id: userId },
        {
            $set: { has_seen_onboarding: true },
        }
    );
}
export async function startQuiz(roomCode) {
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let room = await db.collection("rooms").findOne({
        code: roomCode.toString(),
    });
    let users = room.list_of_users;
    let pairs = [];
    let used = [];
    for (let i = 0; i < users.length; i++) {
        let index = Math.floor(Math.random() * users.length);
        while (used.includes(index) || index == i) {
            index = Math.floor(Math.random() * users.length);
        }
        used.push(index);
        pairs.push({
            author: users[i],
            target: users[index],
            has_been_bought: false,
        });
        console.log(
            await db.collection("users").updateOne(
                { _id: users[i] },
                {
                    $set: { target: users[index] },
                }
            )
        );
    }
    console.log(pairs);
    return await db.collection("rooms").updateOne({ code: roomCode.toString() }, { $set: { current_question: 1 } });
}
export async function seenCelebration(userId) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").updateOne(
        { _id: userId },
        {
            $set: { has_seen_celebration: true },
        }
    );
}
export async function doneQuiz(userId) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").updateOne(
        { _id: userId },
        {
            $set: { hasDoneQuiz: true },
        }
    );
}
export async function hasSeenCelebration(userId) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").findOne({ _id: userId });
    return user["has_seen_celebration"];
}
export async function hasDoneQuiz(userId) {
    userId = EJSON.parse(userId);
    const client = await clientPromise;
    const db = client.db("Ornamental");
    let user = await db.collection("users").findOne({ _id: userId });
    return user["hasDoneQuiz"];
}
export async function getReceiverFromSanta(authorid) {
    authorid = EJSON.parse(authorid);
    const authorOid = new ObjectId(authorid);

    const client = await clientPromise;
    const db = client.db("Ornamental");
    let result = await db.collection("rooms").findOne({
        "secret_santa.user_pair.author": authorid,
    });

    if (result) {
        const userPair = result.secret_santa.user_pair.find((pair) => pair.author.equals(authorOid));

        return getUser(EJSON.stringify(userPair.target)).then((strUser) => {
            let user = EJSON.parse(strUser);
            return user.name;
        });
    } else {
        return "ERROR";
    }
}
