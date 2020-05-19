// 导入 Vue.js 和组件，进行测试
import Hello from "../../../src/pages/Hello.vue";
import { mount } from "@vue/test-utils";
import { expect } from "chai";

describe("Hello", () => {
  const wrapper = mount(Hello);

  // 评估原始组件选项中的函数的结果
  it("sets the correct default data", () => {
    expect(Hello.data).to.be.a("function");
    const defaultData = Hello.data();
    expect(defaultData.user).to.equal("FE");
  });

  // 创建一个实例并检查渲染输出
  it("renders the correct message", () => {
    expect(wrapper.find("h2").text()).to.equal("你好 FE ，欢迎使用项目模板！");
  });

  // 设置组件的data
  it("correctly sets the message", () => {
    wrapper.setData({ user: "front end" });
    expect(wrapper.vm.user).to.equal("front end");
  });
});
