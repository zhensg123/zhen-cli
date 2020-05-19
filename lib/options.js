const exists = require("fs").existsSync;
const path = require("path");

module.exports = function options(name, dir) {
  const opts = getMetadata(dir);
  // 设置默认的项目名
  setDefault(opts, "name", name);
  return opts;
};

/**
 * Gets the metadata from either a meta.json or meta.js file.
 *
 * @param  {String} dir
 * @return {Object}
 */

function getMetadata(dir) {
  const js = path.join(dir, "meta.js"); // 获取meta.js的信息 也就是交互信息
  let opts = {};
  if (exists(js)) {
    const req = require(path.resolve(js));
    if (req !== Object(req)) {
      throw new Error("meta.js needs to expose an object");
    }
    opts = req;
  }

  return opts;
}
/**
 * Set the default value for a prompt question
 *
 * @param {Object} opts
 * @param {String} key
 * @param {String} val
 */

function setDefault(opts, key, val) {
  const prompts = opts.prompts || (opts.prompts = {});
  if (!prompts[key] || typeof prompts[key] !== "object") {
    prompts[key] = {
      type: "string",
      default: val
    };
  } else {
    prompts[key]["default"] = val;
  }
}
