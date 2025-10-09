export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'short',
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

// --- 🖼️ nieuwe functie: tabel-previews automatisch genereren ---
export function initTablePreviews({
    basePath = '/src/assets/lamy-studio/',
    ext = '.webp',
    overrides = {},
  } = {}) {
    const slugifyLocal = (s) =>
      s
        .toString()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // diacritics weg
        .replace(/&/g, 'and')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
  
    const tables = document.querySelectorAll('.table-wrap table');
    tables.forEach((table) => {
      const rows = table.tBodies[0] ? Array.from(table.tBodies[0].rows) : [];
      rows.forEach((tr) => {
        const cells = Array.from(tr.children);
        if (cells.length < 2) return;
  
        const yearCell = cells[0];
        const nameCell = cells[1];
        const yearText = yearCell.textContent.trim();
        const nameText = nameCell.textContent.trim();
        if (!yearText || !nameText) return;
  
        // bepaal bestandsnaam
        let file = overrides[nameText];
        if (!file) file = `${yearText}-${slugifyLocal(nameText)}${ext}`;
        const src = file.startsWith('/') ? file : basePath + file;
  
        // maak popover
        const details = document.createElement('details');
        details.className = 'pop';
        const summary = document.createElement('summary');
        summary.textContent = yearText;
  
        const card = document.createElement('div');
        card.className = 'popcard';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = `${nameText} (${yearText})`;
        img.src = src;
  
        card.appendChild(img);
        details.appendChild(summary);
        details.appendChild(card);
        yearCell.textContent = '';
        yearCell.appendChild(details);
      });
    });
  }