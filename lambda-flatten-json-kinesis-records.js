'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    /* Process the list of records and transform them */
    const output = event.records.map((record) => {
        const entry = (new Buffer(record.data, 'base64')).toString('utf8');
        let ttn_json = JSON.parse(entry);
        let ttnDeviceTime = ttn_json.metadata.time
        let year = new Date(ttnDeviceTime).getUTCFullYear();
        let month = new Date(ttnDeviceTime).getUTCMonth()+1;
        let day = new Date(ttnDeviceTime).getUTCDate();
        let hours = new Date(ttnDeviceTime).getUTCHours();
        let minutes = new Date(ttnDeviceTime).getUTCMinutes();
        let seconds = new Date(ttnDeviceTime).getUTCSeconds();
        let date = year + "-" + month + "-" + day + " " + hours + ":" + minutes +":" + seconds
        
        let flat_json = {
            time: date,
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

