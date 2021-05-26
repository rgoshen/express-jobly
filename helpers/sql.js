const { BadRequestError } = require("../expressError");

/**
 * Helper in making update queries.
 *
 * This can be used by a function to make the SET clause of
 * an SQL UPDATE query.
 *
 * @param dataToUpdate {Object} {field1: newVal1, field2: newVal2, ...}
 * @param jsToSql {Object} maps JS style data fields to database column names,
 *   like {firstName: "first name", age: "age"} => ['"first_name"=$1', '"age"=$2']
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age:32} =>
 *   { setCols: '"first_name"=$1', '"age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
