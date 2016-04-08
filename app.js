var https = require('https');

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var msg = event.result[0];
    var data = JSON.stringify({
      to: [msg.content.from.toString()],
      toChannel: 1383378250,
      eventType: "138311608800106203",
      content: msg.content
    });
    var url ='https://trialbot-api.line.me/v1/events';
    var opts = {
        host: 'trialbot-api.line.me',
        path: '/v1/events',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "X-Line-ChannelID": "1462107785",
            "X-Line-ChannelSecret": "b669d183696c3c503c533ab4bcf94e71",
            "X-Line-Trusted-User-With-ACL": "u5d5db3fd902b6c9a776d1fe8f8028317"
        },
        method: 'POST'
    }
    var req = https.request(opts, function(res){
        res.on('data', function(chunk){
            console.log(chunk.toString())
        }).on('error', function(e){
            console.log('ERROR: '+ e.stack);
        })
    })
    req.write(data)
    req.end();
};