CREATE EXTERNAL TABLE ttn_iot_flat_data (
    battery int,
    light int,
    temperature float,
    time timestamp)
ROW FORMAT  serde 'org.apache.hive.hcatalog.data.JsonSerDe'
with serdeproperties( 'ignore.malformed.json' = 'true')
LOCATION 's3://ttn-workshop-<YOUR-UNIQUE-BUCKET-ID>/iot-to-bi-example/'