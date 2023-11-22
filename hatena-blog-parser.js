function parse(rssUrl, onSuccess, onFailure) {
    const request = new XMLHttpRequest();
    request.open('GET', rssUrl);
    request.addEventListener('load', (event) => {
        if (event.target.status !== 200) {
            onFailure(event.target.status + ' : ' + event.target.statusText);
            return;
        }

        const result = event.target.responseText;
        const blogTitle = result.split('<title>')[1].split('</title>')[0];
        const blogDescription = result.split('<description>')[1].split('</description>')[0];
        let data = [];

        result.split('<item>').forEach(element => {
            if (element.includes('<enclosure')) {
                const postTitle = element.split('<title>')[1].split('</title>')[0];
                const postLink = element.split('<link>')[1].split('</link>')[0];
                const postEnclosureUrl = element.split('<enclosure url="')[1].split('"')[0];
                const date = element.split('<pubDate>')[1].split('</pubDate>')[0];

                let post = {};
                post.blogTitle = blogTitle;
                post.blogDescription = blogDescription;
                post.postTitle = postTitle;
                post.postLink = postLink;
                post.postEnclosureUrl = postEnclosureUrl;
                post.date = new Date(date);
                data.push(post);
            }
        });

        onSuccess(data);
    });
    request.send();
}