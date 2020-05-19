// 匹配工具。可以将glob转成js的正则表达式。
const match = require("minimatch");
const evaluate = require("./eval");
/**
 * 根据用户回答的问题，来决定删除哪些文件
 *
 * @param {Object} files
 * @param {Array} filters
 * @param {Object} Data
 * @param {Function} done
 */
module.exports = (files, filters, data, done) => {
  if (!filters) {
    return done();
  }
  const fileNames = Object.keys(files);
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob];
        if (!evaluate(condition, data)) {
          delete files[file];
        }
      }
    });
  });
  done();
};
