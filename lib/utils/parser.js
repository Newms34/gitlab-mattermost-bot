function general(body) {
    let {
        object_attributes: {
            description,
            created_at: created,
        },
        merge_request: {
            url: mergeUrl,
            title,
            iid: id
        },
        user: {
            name
        }

    } = body;
    return {
        name,
        description,
        created,
        mergeUrl,
        title,
        id
    }
}

function comments(data) {
    const { body } = data.body;
    let { name, description: text, created, mergeUrl, title, id } = general(body);
    let { object_attributes: { url: commentUrl } } = body;
    let newCommentData = {
        created,
        text,
        commentUrl,
        source,
        target,
        mergeUrl,
        title,
        id,
        name
    }
    return newCommentData;
}

function merges(data) {
    const { body } = data.body;
    let { object_attributes: { action, description, source_branch: source, target_branch: target, title, url }, user: { name } } = body;
    if (action !== 'open') {
        console.log('Just an update; ignore message');
        return false;
    }
    let newMergeData = {
        name,
        description,
        source,
        target,
        title,
        url
    };
    return newMergeData;
}

module.exports = {
    comments,
    merges
}