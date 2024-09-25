import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const port = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: "*",
        origin:process.env.CLIENT_URL,
        // origin: 'https://client-81zoz60wv-sijis-projects-7a83c409.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true
    })
)

app.use(express.json())

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("connected to MONGODB")
    }catch(err) {
        console.log(err)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLICKEY,
    privateKey: process.env.IMAGE_KIT_PRIVATECKEY
});

app.get("/", (req, res) => {
    console.log("Success")
    res.send("Success")
})

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
        // CREATE A NEW CHAT
        console.log(text)
        const newChat =new Chat({
            userId: userId,
            history: [{role:"user", parts: [{text}]}]
        });
        const savedChat = await newChat.save();    

        // check id userchat Exists
        const userChats = await UserChats.find({userId: userId})

        // IF DOESNOT EXISTS CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
        if(!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title:text.substring(0,40)
                    },
                ]
            });

            await newUserChats.save()

        } else {
            // IF EXISTS, PUSH THE CHAT TO THE EXISING ARRAY
            await UserChats.updateOne(
                { userId: userId }, 
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title:text.substring(0,40)
                        }
                    }
                }
            );

            res.status(201).send(newChat._id);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat");
    }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });

        res.status(200).send(userChats[0].chats);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });

        res.status(200).send(chat);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching Chat!");
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    const {question, answer, img} = req.body;

    const newItems = [
        ...(question
          ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
          : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {

        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
              $push: {
                history: {
                  $each: newItems,
                },
              },
            }
        );

        res.status(200).send(updatedChat);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error Adding convesation!");
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
});

app.listen(port, () => {
    connect()
    console.log("Server is running on 3000");
});