<template>
  <div>
    <h2 class="title">你好 {{user}} ，欢迎使用项目模板！</h2>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: "FE"
    };
  }
};
</script>
<style lang="scss">
h2 {
  font-size: 20px;
  color: #000;
  background: #ff0;
  text-align: center;
}
</style>