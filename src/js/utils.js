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