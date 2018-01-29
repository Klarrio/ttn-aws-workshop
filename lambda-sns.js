console.log('Loading function');

// FILL IN YOUR SNS TOPIC ARN HERE
var topicArn = "";

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

exports.handler = function(event, context) {
    var sns = new AWS.SNS();
    
    let ttnMessage = event;
    let light = ttnMessage.payload_fields.light;
    let ttnEvent = ttnMessage.payload_fields.event;

    console.log("light value detected of " + light);
    if(ttnEvent == "motion" && light < 35) {
        sns.publish({
            Message: 'A burglar was detected at your doorstep',
            TopicArn: topicArn
        }, function(err, data) {
            if (err) {
                console.log(err.stack);
                return;
            }
            console.log('alarm notification send');
            console.log(data);
            context.done(null, 'Function Finished!');
        });
    }
};
