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

    console.log("----------------------------------");
    console.log(req.body);
    console.log("----------------------------------");
    var results = req.body.result;
    _.each(results, function(msg){
        console.log(msg.content.text);
    })

    // var request = require('superagent');
    // request
    //     .post('https://trialbot-api.line.me/v1/events')
    //     .end(function(res){
    //       if (res.ok) {
    //         console.log(res.body.name);
    //       } else {
    //             console.log('error');
    //       }
    //     });

  res.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
