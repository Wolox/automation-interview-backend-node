exports.extractField = field => rawData => {
  if (Array.isArray(rawData)) {
    return rawData.map(dataItem => dataItem[field]);
  }
  return rawData && rawData[field];
};
