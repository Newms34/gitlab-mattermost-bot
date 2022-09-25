const router = require('express').Router();
const {merges} = require('../../utils/parser.js');
const promiseRequest = require('../../utils/promiseRequest.js');

/**
 * Route to receive merge-request data, parse it, and send out the appropriate mattermost message(s)
 */
router.post('/',async function(request,response){
    let mergeData = merges(request);
    if(mergeData){
        let {name, description, url, target, source, title} = mergeData;
        let mattermostPostText = `
User ${name} created merge request "${title}" to merge "${source}" into "${target}": 

[link](${url})
        `;
        let mattermostPost = {
            text:mattermostPostText,
            channel: '#merge-request-bot',
            username: 'merge-request-bot'
        }
        let mattermostRequest = await promiseRequest('https://healytest.cloud.mattermost.com/hooks/f4ssjhfbf3da8gjwo66yet5jby', 'POST', JSON.stringify(mattermostPost));
        let tags = description.match(/@\w+/g);
        if(tags && tags.length){
            for(let tag of tags){
                //send out a notif per tagged user
                let tagPost = {
                    text: `Someone tagged you in a merge request on [${title}](${mergeUrl}).`,
                    channel: tag,
                    username: 'merge-request-bot'
                }
                await promiseRequest('https://healytest.cloud.mattermost.com/hooks/f4ssjhfbf3da8gjwo66yet5jby', 'POST', JSON.stringify(tagPost));
            }
        }
        return response.send(mattermostRequest);
    }
    response.send(false);
});

/**
 * Test route to ensure that merge-request routing is accessible
 * TODO: Remove this!
 */
router.get('/',function(request,response){
    response.end('Test route for MRs!');
});

module.exports = router;