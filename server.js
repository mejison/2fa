const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const app = express()
const QRCode = require('qrcode')
const speakeasy = require('speakeasy')
app.use(cors())

const mongoClient = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
let dbClient;

app.use(bodyParser.json({ type: 'application/json' }))

const auth = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
};

app.post('/generate', auth, async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: '2FA'
  });

  const collection = req.app.locals.collection;
  const qrcodeBase64 = await QRCode.toDataURL(secret.otpauth_url);
  await collection.findOneAndUpdate({ email: req.user.email }, { $set: { qrSecret: secret.ascii, enable2FA: true }});

  return res.json({
    qr: qrcodeBase64,
    type: 'success',
    message: 'Successfuly generated.'
  });
});

app.get('/me', auth, async (req, res) => {
    const collection = req.app.locals.collection;
    let user = await collection.findOne({ email: req.user.email });
    return res.json({
        type: 'success',
        user,
    })
});

app.post('/check-2fa', auth, async (req, res) => {
  const collection = req.app.locals.collection;
  let user = await collection.findOne({ email: req.user.email });

  const verified = speakeasy.totp.verify({
    secret: user.qrSecret,
    encoding: 'ascii',
    token: req.body.code
  });

  return res.json({
    verified: verified
  });
});

app.put('/update', auth, async (req, res) => {
  const collection = req.app.locals.collection;
  await collection.findOneAndUpdate({ email: req.user.email }, { $set: { ...req.body }});

  return res.json({
      type: 'success',
      message: 'Successfuly updated.'
  })
});

app.post('/login', async (req, res) => {
    const { data } = req.body

    const collection = req.app.locals.collection;
    let user = await collection.findOne({google_id: data.id});

    if ( ! user) {
        await collection.insertOne({
            name: data.name,
            email: data.email,
            avatar: data.image_url,
            google_id: data.id,
            token: '',
            qrSecret: '',
            enable2FA: false,
        });

        user = await collection.findOne({google_id: data.id});
    }

    const token = await jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
    );

    user.token = token

    await collection.findOneAndUpdate({ google_id: user.google_id }, { $set: { token: token }});

    return res.json({
        type: 'success',
        message: 'Successfully logged in.',
        user,
    })
});

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("dbUser").collection("users");
    app.listen(process.env.API_PORT, () => {
        console.log(`Example app listening at http://localhost:${process.env.API_PORT}`)
    })
});


