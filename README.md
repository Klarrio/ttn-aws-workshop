# The Things Network AWS Workshop
This workshop will help you get a Things Node connected to the AWS Cloud, where we'll use the power of AWS services to quickly query the activity of your alarm and notify you when there's a burglar at your doorstep!

## AWS Architecture
During the workshop, we will use multiple AWS services and combine them in a data workflow. The workflow will branch out into:  
- a flow which will detect motion while it's dark and send out a SNS notification to your mailbox.
- a flow which will store the messages into S3's object storage (after a small transformation) and make the data queryable via AWS Athena.
![architecture](/assets/workshop.png)

### Components
**The Things Network AWS Integration:**  We will use this integration as a bridge between The Things Network and AWS IoT. To set this up we'll follow the [quick start guide](https://www.thethingsnetwork.org/docs/applications/aws/quick-start.html) provided by The Things Network.  
**AWS IoT:** The IoT solution of AWS. This is were we'll see our devices and can subscribe/publish messages.  
**AWS Lambda:** small code blocks or functions which act on or transform data, without having to manage servers.  
**AWS SNS:** AWS simple notification service, which allows you to send notifications to a mobile device, e-mail account, http endpoint etc.  
**AWS Kinesis:** AWS message log, which can be used to buffer data and deliver it to various endpoints (such as S3).  
**AWS S3:** AWS object storage which allows you to store files of data, video, images,...  
**AWS Athena:** interactive query service that makes it easy to analyse data in AWS S3 using standard SQL.  

## Workshop resources
We will be using various code snippets during the workshop, which you can simply copy-paste from this repo.  

[TTN CloudFormation template](ttn-cloudformation-template): We made a small change to the default AWS CloudFormation template provided by The Things Network. Therefore you are advised to use this template during the workshop.  
[Lambda to SNS notification](lambda-sns.js): We'll use this Javascript snippet for an AWS Lambda function. It will send out a notification to your email inbox via SNS when it detects movement at night.
[Lambda to flatten json](lambda-flatten-json-kinesis-records.js): We'll use this Javascript snippet for an AWS Lambda function. It will take multiple records from a Kinesis stream and transform the json message of the TTN Node to a flat json with only the fields we require.  
[Lambda test record](lambda-test-record.json): You can use this sample Kinesis record to test your "flatten json" lambda.  
[Athena create table statement](athena-create-table.sql): We'll use this "create table" statement to create a table in Athena, which maps on the data we stored in S3.  

Athena query statement: 
```
select from_iso8601_timestamp(time) as time, battery, light, temperature from ttn_iot_flat_data order by time asc;
```

## Workshop log
This log will guide you through the steps of the workshop.

## Generic setup

### 1. Setting up the TTN Integration with AWS
First, you'll have to setup the integration between The Things Network and AWS IoT. For this you can use the Quick Start guide provided by The Things Network:
https://www.thethingsnetwork.org/docs/applications/aws/quick-start.html

However, you need to take one small change into account. Instead of using their S3 template URL link, you should use [our template](ttn-cloudformation-template), and upload it during the "select template" step of the guide.

### 2. Verify the IoT data of your Things Node in AWS IoT.
Once you've got the integration up-and-running, it will automatically sync the devices of The Things Network to AWS IoT. It will also make sure that the messages 
published by your Things Node end up in AWS IoT.

1.1 open AWS IoT in the AWS Management Console: https://console.aws.amazon.com/iot/home  
1.2 in the menu on the left, go to Manage -> Things. Here you should see your TTN things now.  
1.3 in the menu on the left, go to Test. Here we'll try to subscribe on the MQTT messages published by your TTN Node.  
1.4 in the "subscription topic" field, enter `<ttn-app-name>/devices/<ttn-node-name>/up`, were you'll have to replace the placeholders with their actual values.  
1.5 click on the "Subscribe to topic" button. When you interact with your Things Node (by moving with it, clicking the button, etc), you should see your messages in AWS IoT.

## SNS notification flow
### 1. Setup SNS
Now we'll setup an SNS topic and subscription, to send out the notifications.

1.1 Go to SNS in the AWS Management console: https://console.aws.amazon.com/sns/v2/home  
1.2 In the menu on the left, select "Topics". A SNS topic is a communication channel to send messages and subscribe to notifications.
1.3 Click the "Create new topic" button, with name "ttn_alarm_notification". Confirm with "Create topic".  
1.4 Your SNS topic is now created. Note the ARN for your SNS topic, as you'll need this in the next step.
1.5 In the menu on the left, select "Subscriptions".    
1.6 Click the "Create subscription" button. Enter the topic ARN, select "Email" as the protocol, fill in your email address as the endpoint and confirm with "create subscription".  
1.7 SNS will now send you an email to confirm your SNS subscription. Confirm it by clicking on the link in this email.

SNS is now setup to handle notifications.

### 2. Setup lambda
We'll now setup a lambda function, which will send out a notification to your SNS topic when it detects movement while dark.
As a trigger for this lambda, we'll use AWS IoT, so that it gets triggered on every AWS IoT message of your Things Node.

1.1 Go to the Lambda service in the AWS Management console: https://console.aws.amazon.com/lambda/home  
1.2 In the menu on the left, go to "Functions".  
1.3 Click the "Create function" button.  
1.4 Select "Author from scratch".
1.5 Fill in the basic information by providing a name to your lambda function and role.  
1.6 The role is used to provide your Lambda function with certain permissions. In the role dropdown, choose "create new role from template".  
1.7 In the "policy templates" dropdown, search for the "SNS publish policy".  
1.8 finalize your lambda function creation with clicking on the "Create function" button.  
1.9 Now your enter the main screen of your Lambda function. At the top you have the "Designer panel", at the bottom the "Function code" panel.  
1.10 In the Designer panel, click on the AWS IoT trigger in the left menu. The trigger will be added and you'll have to setup the MQTT topic to listen to.  
1.10 In the "Configure triggers" panel, select "Custom IoT rule" for the IoT type.  
1.11 From the Rule dropdown, select "create a new rule". Also enter a name for your rule.  
1.12 As the Rule query statement, enter: `select * from <ttn_app_name>/devices/<ttn_node_name>/up`  
1.13 Finally, in the code section, copy-paste the code from our [Lambda to SNS notification](lambda-sns.js) code snippet.  
1.14 Finalize the lambda by clicking on the "save" button at the top.  

### Testing the flow
Now, when you move the Things Node, while keeping it concealed from any light, an email should drop in your inbox.

