let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'mpKvhp+3vEC4kvAtpZcAeW7uHfrVU3cpazh/4crKmr8h5AsT0bUfWaNss5ALvz2gNKeMFngzWG0eQdE9dNWN5OuGAdgF2Gzj7LaGM4T/qqxuvCnmsbD0Mm+eXICXfQPqDJSd8KjKoAd0WL1xjC3MEgdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body, null, 2))

    let events = req.body.events
    events.forEach((event) => {
        let replyToken = event.replyToken
        let type = event.message.type
        if (type === 'text') {
            let text = event.message.text
            sendMessage(replyToken, text)
        } else {
            sendMessage(replyToken, type)            
        }
    })
    res.send()
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
