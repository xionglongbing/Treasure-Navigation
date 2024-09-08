function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
console.log(isNumeric('123.12')); // true
console.log(isNumeric('123abc')); // false
console.log(isNumeric('')); // false
console.log(isNumeric(Number(Infinity))); // true
