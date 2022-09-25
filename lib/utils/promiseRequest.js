const https = require('https');

/**
 * Promisify Node's native https request library.
 * @param {String} url The url to send to
 * @param {String} method The HTTP method (GET, POST, etc.)
 * @param {String} data The data to send. If JSON, this must be stringified first.
 * @returns {Promise} A promise that resolves or rejects depending on the state of the https request.
 */
function request(url, method, data){
    url = new URL(url);
    const options = {
        hostname:url.hostname,
        path:url.pathname,
        method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }
    return new Promise((resolve,reject) => {
        const req = https.request(options, (res)=> {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
        
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', err => {
            reject(err);
        })
        req.write(data),
        req.end();
    });
}

module.exports = request;