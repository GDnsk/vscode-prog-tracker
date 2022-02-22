/** Check a TextDocument, Is it a ignore document(null/'inmemory') */
const isIgnoreDocument = (doc) => {
    return !doc || doc.uri.scheme == 'inmemory';
}

module.exports = {
    isIgnoreDocument
}