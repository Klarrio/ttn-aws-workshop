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
[Lambda to flatten json](lambda-flatten-json-kinesis-records.js): We'll use this Javascript snippet for an AWS Lambda function. It will take multiple records from a Kinesis stream and transform the json message of the TTN Node to a flat json with only the fields we require.  
[Lambda test record](lambda-test-record.json): You can use this sample Kinesis record to test your "flatten json" lambda.  
[Athena create table statement](athena-create-table.sql): We'll use this "create table" statement to create a table in Athena, which maps on the data we stored in S3.  

Athena query statement: 
```
select from_iso8601_timestamp(time) as time, battery, light, temperature from ttn_iot_flat_data order by time asc;
```



