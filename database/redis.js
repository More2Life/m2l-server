var client = require('redis').createClient(process.env.REDIS_URL);

client.on('connect', () => {
    console.log('REDIS CONNECTED');
});

var RedisController = {
    setKeyValue : (key, value) => {
        client.set(key, value, (err, reply) => {
            if (err) console.log(err);
            console.log('REDIS PAIR SET: {' + key + ' : ' + value +'}');
            console.log(reply);
        });
    },
    getValueForKey : (key, callback) => {
        client.get(key, (err, reply) => {
            if (err) console.log(err);
            console.log('REDIS VALUE RETRIEVED');
            console.log(reply);
            callback(reply)
        });
    }
}


exports.RedisController = RedisController;