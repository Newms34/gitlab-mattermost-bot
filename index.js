const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const startTime = Date.now();

app.use(bodyParser.json());
app.use(auth, require('./lib/utils/auth.js'));
app.use('/', require('./lib/routes'));

/**
 * Convert a unix epoch timestamp into an ISO8601 format string
 * @param {Number} num The unix epoch timestamp 
 * @returns An ISO timestamp string representing the number
 */
function numToDateString(num){
    return new Date(num).toISOString();
}

/**
 * Simple route to ensure liveness for the bot
 * TOOD: Should we replace this with something else?
 */
app.get('/status', function(request,response){
    const now = Date.now();
    response.send(`Server status: Alive:
Started at: ${numToDateString(startTime)}
Current time: ${numToDateString(now)}
Time Elapsed (ms): ${now-startTime}`)
})

app.listen(port, function(){
    console.log(`App listening on port ${port}!`)
});