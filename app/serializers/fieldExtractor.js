exports.extractFields = (schema, skip) => rawData => {
  const fields = skip ? Object.keys(schema).filter(field => field !== skip) : Object.keys(schema);
  const transform = dataItem => fields.reduce((user, field) => ({ ...user, [field]: dataItem[field] }), {});

  if (Array.isArray(rawData)) {
    return rawData.map(transform);
  }

  return transform(rawData);
};

exports.extractField = field => rawData => {
  if (Array.isArray(rawData)) {
    return rawData.map(dataItem => dataItem[field]);
  }
  return rawData && rawData[field];
};
