'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var quiz = require('./quiz');
var welcomeIndex = require('./welcomeIndex');

function sendTextMessage(sender, text) {
	let messageData = {text: text}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
        recipient: {id:sender},
        message: messageData,
    }
	}, function(error, response, body) {
		if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
	});
}

function sendGenericMessage(sender, type) {
	var messageData;

	if (type==="generic") {
		messageData = {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "generic",
					"elements": [{
						"title": "First card",
						"subtitle": "Element #1 of an hscroll",
						"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
						"buttons": [{
							"type": "web_url",
							"url": "https://www.messenger.com",
							"title": "web url"
						}, {
							"type": "postback",
							"title": "Postback",
							"payload": "Payload for first element in generic bubble"
						},{
							"type": "postback",
							"title": "Quiz of Thing",
							"payload": "quiz"
						}] 
					}, {
						"title": "Second card",
						"subtitle": "Element #2 of hscroll",
						"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
						"buttons": [{
							"type": "postback",
	            "title": "Postback",
	            "payload": "Payload for second element in a generic bubble",
						}]
					}]
				}
			}
		}
	}

	if (type==="test") {
		messageData = {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "generic",
					"elements": [
						{
							"title": "Test title",
							"subtitle": "Test subtitle",
							"buttons": [{
								"type": "postback",
								"title": "Red<http://www.redcross.org/images/MEDIA_CustomProductCatalog/m14540077_donor-thank-a-thon_phone-icon_40x40.jpg>",
								"payload": "red"
							}, {
								"type": "postback",
								"title": "Blue",
								"payload": "blue"
							},{
								"type": "postback",
								"title": "Cancel",
								"payload": "cancel"
							}] 
						}, 
						{
							"title": "Second card",
							"subtitle": "Element #2 of hscroll",
							"buttons": [{
								"type": "postback",
		            "title": "Postback",
		            "payload": "Payload for second element in a generic bubble",
							}]
						}
					]
				}
			}
		}
	}

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: token},
		method: 'POST',
		json: {
			recipient: {id: sender},
			message: messageData,
		}
	}, function(err, res, body) {
			if (err) {
				console.log('Error sending messages: ', err)
			} else if (res.body.error) {
				console.log('Error', res.body.error);
			}
	})
}

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send(welcomeIndex())
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// test post api
app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      // user sends message
      if (event.message && event.message.text) {
          let text = event.message.text.toLowerCase()

          if (text === 'generic') {
          	sendGenericMessage(sender, 'generic')
          	continue
          }
           // TODO: look for word combos or regex i.e. "i want to take test. can i take test? take quiz"
          if (text === 'quiz') {
          	sendTextMessage(sender, 'prompt quiz', token)
          	continue
          }

          // Use to test structure
          if (text === 'test') {
          	sendGenericMessage(sender, 'test')
          	continue
          }
          sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      // we send payload back
      if (event.postback) {
      	let postbackVal = event.postback.payload.toLowerCase();

      	if (postbackVal ==="quiz") {
      		sendTextMessage(sender, "TODO: QUIZ " + quiz, token)
      		continue
      	}
      	if (postbackVal ==="cancel") {
      		sendTextMessage(sender, "cancel quiz", token)
      		continue
      	}
      	let text = JSON.stringify(event.postback)
      	sendTextMessage(sender, "Postbakc received: "+text.substring(0,200), token)
      	continue
      }
  }
  res.sendStatus(200)
}); 

const token = process.env.FB_PAGE_ACCESS_TOKEN;

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
