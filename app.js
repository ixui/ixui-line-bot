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

        console.log("*********************************************************************")
        console.log(msg.content.text)
        console.log("*********************************************************************")
        console.log(msg.content)
        console.log("*********************************************************************")

        request
            .post('https://chatbot-api.userlocal.jp/api/chat')
            .send({
                key: process.env.USER_LOCAL_API_KEY,
                message: encodeURIComponent(msg.content),
                bot_name: "めぐみん",
                platform: "line",
                user_id: msg.content.from.toString()
            })
            .end(function(err, res){
                if (err || !res.ok) {
                    console.error(err);
                } else {
                    //console.log(res)

                    request
                        .post('https://trialbot-api.line.me/v1/events')
                        .proxy(process.env.FIXIE_URL) // IPの固定化
                        .send({
                            to: [msg.content.from.toString()],
                            toChannel: 1383378250,
                            eventType: "138311608800106203",
                            content: {
                                contentType:　1,
                                toType:　1,
                                text:　res.body.result
                            }
                        })
                        .set('Content-Type', 'application/json; charset=UTF-8')
                        .set('X-Line-ChannelID', process.env.CHANNEL_ID)
                        .set('X-Line-ChannelSecret', process.env.SECRET)
                        .set('X-Line-Trusted-User-With-ACL', process.env.MID)
                        .end(function(err, res){
                            if (err || !res.ok) {
                                console.error(err);
                            } else {
                                // Nothing
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
