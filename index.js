const express = require('express')
const app = express()
const port = 5000
var rp = require('request-promise');
const cors = require('cors');
const bodyParser = require("body-parser");
var Twit = require('twit')
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var T = new Twit({
    consumer_key:         process.env.APIKEY,
    consumer_secret:      process.env.APIKEYSECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.TOKEN_SECRET,
    timeout_ms:           60*1000,  
});

T.get('account/verify_credentials', {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated)

function onAuthenticated(err, res) {
    if (err) {
        throw err
    }

    console.log('Authentication successful. Running Application...\r\n')
}

// app.get('/getUser', (req, res) => {
//     var data = {result: {}}
//     T.get('statuses/user_timeline', { screen_name: req.query.username, count: req.query.count }, 
//         function(err, data, response) {
//             return res.sendStatus(200).send(data);
//         })
// });

app.get('/getUser', (req, res) => {
    const fetchUserURL = new URL(
        "https://api.twitter.com/2/users/by/username/" + req.query.username
    );
    const requestConfig = {
        url: fetchUserURL,
        headers: {
            authorization: 'Bearer ' + req.headers.authorization
        },
        json: true,
    };

    rp.get(requestConfig) 
        .then(response => {
            res.status(200).send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

app.get('/getTweets', (req, res) => {
    const fetchTweetURL = new URL(
        `https://api.twitter.com/2/users/${req.query.id}/tweets?max_results=${req.query.count}`
    );

    const requestConfig = {
        url: fetchTweetURL,
        headers: {
            authorization: 'Bearer ' + req.headers.authorization
        },
        json: true,
    };

    rp.get(requestConfig) 
        .then(response => {
            res.status(200).send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

app.listen(port, () => {
  console.log(`Twitter app listening at http://localhost:${port}`)
})