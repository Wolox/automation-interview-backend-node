exports.matchInArray = (arr, value) =>
  arr.reduce((result, format) => {
    if (!value.match(format)) {
      return false;
    }
    return result;
  }, true);
