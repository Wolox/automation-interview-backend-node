const { extractFields, extractField } = require('./fieldExtractor');
const { paginatedResponse } = require('./paginator');
const { createURIsList } = require('./createURIsList');

module.exports = { extractField, extractFields, paginatedResponse, createURIsList };
