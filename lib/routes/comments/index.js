const router = require('express').Router();
const {comments} = require('../../utils/parser.js');

/**
 * Route to receive comment data, parse it, and send out the appropriate mattermost message(s)
 */
router.post('/', async function(request,response){
    let commentData = comments(request);
    if(commentData){
        let {name, description, mergeUrl, target, source, title, commentUrl} = commentData;
        let mattermostPostText = `
Someone left a comment on your merge request [${title}](${mergeUrl}), seeking to merge ${source} into ${target}.
        `;
        let mattermostPost = {
            text:mattermostPostText,
            channel: `@${name}`,
            username: 'merge-request-bot'
        }
        let mattermostRequest = await promiseRequest('https://healytest.cloud.mattermost.com/hooks/f4ssjhfbf3da8gjwo66yet5jby', 'POST', JSON.stringify(mattermostPost));
        let tags = description.match(/@\w+/g);
        if(tags && tags.length){
            for(let tag of tags){
                //send out a notif per tagged user
                let tagPost = {
                    text: `Someone tagged you in a comment on [${title}](${mergeUrl}) (Comment url [link](${commentUrl})).`,
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
 * Test route to ensure that comments routing is accessible
 * TODO: Remove this!
 */
router.get('/',function(request,response){
    response.end('Test route for comments!');
});

module.exports = router;