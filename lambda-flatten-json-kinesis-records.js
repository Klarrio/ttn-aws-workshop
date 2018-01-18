'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    /* Process the list of records and transform them */
    const output = event.records.map((record) => {
        const entry = (new Buffer(record.data, 'base64')).toString('utf8');
        let ttn_json = JSON.parse(entry); 
        
        let flat_json = {
            time: ttn_json.metadata.time,
            battery: ttn_json.payload_fields.battery,
            light: ttn_json.payload_fields.light,
            temperature: ttn_json.payload_fields.temperature
        }
        const payload = (new Buffer(JSON.stringify(flat_json), 'utf8')).toString('base64');
        return {
            recordId: record.recordId,
            result: 'Ok',
            data: payload,
        };
        
    });
    console.log(`Processing completed.  Successful records ${output.length}.`);
    callback(null, { records: output });
};

