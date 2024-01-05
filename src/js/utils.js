export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}

export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function orderBlogPosts(posts, {
    filterOutDrafts = true,
    filterOutFuturePosts = true,
    sortByDate = true, 
    limit = undefined,
} = {}) {
    const filteredPosts = posts.reduce((acc, post) => {
        const { date, draft } = post.frontmatter; 
        //filter out drafts
        if(filterOutDrafts == true && draft==true) return acc;

        //filter out future
        if(filterOutFuturePosts == true && new Date(date) > new Date()) return acc;

        // add post to acc
        acc.push(post);
        return acc;

    }, [])

    // sort by date or else randomize posts..
    if(sortByDate){
        filteredPosts.sort((a,b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
    } else {
        filteredPosts.sort(() => Math.random() - 0.5)
    }

    //limit if number is defined
    if(typeof limit === "number") {
        return filteredPosts.slice(0, limit);
    } else {
        return filteredPosts;
    }
}