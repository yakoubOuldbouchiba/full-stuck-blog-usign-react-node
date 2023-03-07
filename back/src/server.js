import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import express, { json } from "express";
import 'dotenv/config'
import { db, connectToDb } from "./db.js";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const credentials = JSON.parse(
    fs.readFileSync('./credentienls.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname , '../build')));

app.get(/^(?!\/api)'=.+/, (req , res)=>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
})


app.use(async (req, res, next) => {
    const { authtoken } = req.headers;
    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (error) {
            return res.sendStatus(400)
        }

    }
    req.user = req.user || {};
    next();
});

app.get('/api/articles/:name', async (req, res) => {

    const articleName = req.params.name;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name: articleName });
    if (article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        return res.json(article);
    } else {
        return res.sendStatus(404).send('Article not found!');
    }

});

app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }

});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;
    const { uid } = req.user;
    const article = await db.collection('articles').findOne({ name: articleName });
    if (article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = article.canUpvote = uid && !upvoteIds.includes(uid);
        if (canUpvote) {
            await db.collection('articles').updateOne({ name: articleName }, {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid }
            });
        }
    }
    const updatedArticle = await db.collection('articles').findOne({ name: articleName })
    if (updatedArticle) {
        res.json(updatedArticle);
    } else {
        return res.sendStatus(404).send('Article not found!');
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const articleName = req.params.name;
    const {text} = req.body;
    const {email} =req.user;
    await db.collection('articles').updateOne({ name: articleName }, {
        $push: { comments: {postedBy : email , text} }
    });
    const article = await db.collection('articles').findOne({ name: articleName });
    if (article) {
        res.json(article);
    } else {
        return res.sendStatus(404).send('Article not found!');
    }

});

const PORT = process.env.PORT || 8089;
connectToDb(() => {
    console.log("db connect");
    app.listen(PORT, () => {
        console.log("You are listing on port : ", PORT);
    });
});
