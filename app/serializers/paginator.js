exports.paginatedResponse = ({ offset, limit, page, getFieldsFn }) => response => {
  const nextExists = offset + limit < response.count;
  return {
    total_count: response.count,
    // eslint-disable-next-line no-extra-parens
    count: (response.rows && response.rows.length) || 0,
    total_pages: response.count > 0 ? Math.ceil(response.count / limit) : 0,
    limit,
    offset,
    current_page: page,
    page: getFieldsFn(response.rows),
    previous_page: page > 1 ? page - 1 : null,
    next_page: nextExists ? page + 1 : null
  };
};
