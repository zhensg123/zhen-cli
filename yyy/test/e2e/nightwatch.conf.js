const chromedriver = require("chromedriver");
const geckodriver = require("geckodriver");
module.exports = {
  src_folders: ["test/e2e/specs"],
  output_folder: "test/e2e/reports",
  globals_path: "globalsModule.js",
  webdriver: {
    start_process: true
  },
  test_settings: {
    default: {
      webdriver: {
        server_path: chromedriver.path,
        port: 9515
      },
      desiredCapabilities: {
        browserName: "chrome"
      }
    },
    chrome: {
      webdriver: {
        server_path: chromedriver.path,
        port: 9515
      },
      desiredCapabilities: {
        browserName: "chrome"
      }
    },
    firefox: {
      webdriver: {
        server_path: geckodriver.path,
        port: 4444
      },
      desiredCapabilities: {
        browserName: "firefox"
      }
    }
  }
};
