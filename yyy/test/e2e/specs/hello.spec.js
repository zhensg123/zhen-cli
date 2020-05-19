module.exports = {
  "对hello.vue进行功能测试": function(browser) {
    browser.url(`http://localhost:3000`).waitForElementVisible("#app", 1000);
    browser.expect.element(".title").to.be.present;
    browser.expect
      .element(".title")
      .text.to.equal("你好 FE ，欢迎使用项目模板！");
    browser.end();
  }
};
