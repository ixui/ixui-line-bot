var _ = require('lodash');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser());
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/callback', function(req, res) {

    // console.log("----------------------------------");
    // console.log(req.body);
    // console.log("----------------------------------");

    var results = req.body.result;
    _.each(results, function(msg){
        console.log(msg.content.text);
        console.log(msg.from);

        var request = require('superagent');
        require('superagent-proxy')(request);

        console.log(JSON.stringify({
                to: [msg.from.toString()],
                toChannel: 1383378250,
                eventType: "138311608800106203",
                content: msg.content.text
            })

        request
            .post('https://trialbot-api.line.me/v1/events')
            .proxy(process.env.FIXIE_URL)
            .send({
                to: [msg.from.toString()],
                toChannel: 1383378250,
                eventType: "138311608800106203",
                content: msg.content.text
            })
            .set('Content-Type', 'application/json; charset=UTF-8')
            .set('X-Line-ChannelID', process.env.CHANNEL_ID)
            .set('X-Line-ChannelSecret', process.env.SECRET)
            .set('X-Line-Trusted-User-With-ACL', process.env.MID)
            .end(function(res){
                console.log(res);
            });

    })

  res.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
