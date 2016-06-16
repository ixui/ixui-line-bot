var _ = require('lodash');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser());
app.set('port', (process.env.PORT || 5000));

// 生きてるか確認するためのHello World
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// LineからのコールバックURL
app.post('/callback', function(req, res) {

    var results = req.body.result;
    _.each(results, function(msg){

        var request = require('superagent');
        require('superagent-proxy')(request);

        request
            .post('https://chatbot-api.userlocal.jp/api/chat')
            .proxy(process.env.FIXIE_URL)
            .send({
                key: process.env.USER_LOCAL_API_KEY,
                message: msg.content
            })
            .end(function(err, res){
                if (err || !res.ok) {
                    console.error(err);
                } else {

                    request
                        .post('https://trialbot-api.line.me/v1/events')
                        .proxy(process.env.FIXIE_URL)
                        .send({
                            to: [msg.content.from.toString()],
                            toChannel: 1383378250,
                            eventType: "138311608800106203",
                            content: res.body.message
                        })
                        .set('Content-Type', 'application/json; charset=UTF-8')
                        .set('X-Line-ChannelID', process.env.CHANNEL_ID)
                        .set('X-Line-ChannelSecret', process.env.SECRET)
                        .set('X-Line-Trusted-User-With-ACL', process.env.MID)
                        .end(function(err, res){
                            if (err || !res.ok) {
                                console.error(err);
                            } else {
                                // No Error
                            }
                        });

                }
            });

    })

    res.status(200).send("ok")
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
