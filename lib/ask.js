const async = require("async");
const inquirer = require("inquirer");
const evaluate = require("./eval");

/**
 * Ask questions, return results.
 *
 * @param {Object} prompts questions数组对象
 * @param {Object} data metalsmith的metadata对象
 * @param {Function} done metalsmith的done回调
 */

module.exports = function ask(prompts, data, done) {
  async.eachSeries(
    Object.keys(prompts),
    (key, next) => {
      prompt(data, key, prompts[key], next);
    },
    done
  );
};

/**
 * Inquirer prompt wrapper.
 *
 * @param {Object} data
 * @param {String} key
 * @param {Object} prompt
 * @param {Function} done
 */
// 将用户的输入信息添加到metadata上，用来渲染handlebars模板。
function prompt(data, key, prompt, done) {
  // skip prompts whose when condition is not met
  if (prompt.when && !evaluate(prompt.when, data)) {
    return done();
  }

  // 如果默认值是函数类型，将函数执行结果返回。
  let promptDefault = prompt.default;
  if (typeof prompt.default === "function") {
    promptDefault = function() {
      return prompt.default.bind(this)(data);
    };
  }

  inquirer
    .prompt([
      {
        type: prompt.type,
        name: key,
        message: prompt.message || key,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
      }
    ])
    .then(answers => {
      if (Array.isArray(answers[key])) {
        data[key] = {};
        answers[key].forEach(multiChoiceAnswer => {
          data[key][multiChoiceAnswer] = true;
        });
      } else if (typeof answers[key] === "string") {
        data[key] = answers[key].replace(/"/g, '\\"');
      } else {
        data[key] = answers[key];
      }
      done();
    })
    .catch(done);
}
