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

    console.log(req);
    console.log(req.body);
    var result = req.body.result;
    console.log(result);

    _.each(result, function(msg){
        console.log(msg);
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

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
