<template>
  <div id="app" :class="[isCollapse ? 'iscollapse-style' : '']">
    <div class="header">
      <div @click="isCollapse = !isCollapse" class="handle-btn">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>
      <div class="user-name">
        <i class="iconfont icon-yonghu" style="color: #409eff"></i
        ><span>剑客</span>
        <i class="iconfont icon-tuichu" @click="loginOut"></i>
      </div>
    </div>
    <div class="left">
      <div class="title">
        <p>
          <svg aria-hidden="false">
            <use xlink:href="#icon-chanxianxiaoshuaitisheng"></use>
          </svg>
        </p>
        <p class="title-name" v-show="!isCollapse">海贼王</p>
      </div>
      <el-menu
        router
        :collapse-transition="false"
        :default-active="$route.path"
        unique-opened
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        active-text-color="#1e80ff"
      >
        <el-submenu
          :index="String(index)"
          :key="String(index)"
          v-for="(item, index) in menuList"
        >
          <template slot="title">
            <i :class="[item.icon, 'iconfont']"></i><span>{{ item.menu }}</span>
          </template>
          <template v-for="(subMenu, subIndex) in item.children">
            <el-menu-item
               class="sub-item"
              :key="index + '' + subIndex"
              :index="subMenu.path"
            >
              <span>{{ subMenu.title }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right">
      <router-view />
    </div>
    <back-top></back-top>
  </div>
</template>

<script>
import menuList from '@/config/nav'
export default {
  data () {
    return {
      isCollapse: false,
      menuList,
      breadcrumb: [],
      titleShow: true
    }
  },
  methods: {
    handleOpen () {},
    handleClose () {},
    loginOut () {
      this.$confirm('确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
        })
        .catch(() => {})
    }
  },
  watch: {
    $route: {
      handler (route) {
        const obj = menuList.find((item) => {
          return item.children.find((child) => child.path === route.path)
        })
        if (obj) {
          const childObj = obj.children.find(
            (child) => child.path === route.path
          )
          this.breadcrumb = [
            {
              menu: obj.menu
            },
            {
              menu: childObj.menu,
              path: childObj.path
            }
          ]
        } else {
          this.breadcrumb = [
            {
              menu: '臣妾找不到路径……'
            }
          ]
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
#app.iscollapse-style {
  .header {
    left: 64px;
  }

  .left {
    width: 64px;
  }

  .right {
    padding-left: 69px;
  }
}
::v-deep .el-submenu.is-active > .el-submenu__title {
  color: #1e80ff !important;
  i {
    color: #1e80ff;
  }
  span {
    color: #1e80ff;
  }
}
::v-deep .el-menu-item.is-active {
  color: #1e80ff;
  background: #ecf5ff !important;
}
::v-deep .el-submenu__title:hover {
  color: #1e80ff !important;
  background: #ecf5ff;
  i {
    color: #1e80ff;
  }
  span {
    color: #1e80ff;
  }
}
::v-deep .el-submenu__title {
  height: 48px;
  line-height: 48px;
}
::v-deep .el-menu-item {
  color: #82848a;
}
::v-deep .el-menu-item:hover {
  color: #82848a;
  background: #ecf5ff !important;
  span {
    color: #1e80ff;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  padding-bottom: 1000px;
  .left {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transition: all 0.5s;
    z-index: 100;
    width: 188px;
    background: #fff;
    .title {
      font-size: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      background: linear-gradient(
        to right,
        rgba(30,128,255, 1),
        rgba(30,128,255, 0.6)
      );
      color: #fff;
      padding-left: 8px;
      display: flex;
      align-items: center;
      height: 48px;
      svg {
        height: 30px;
        width: 30px;
        margin-right: 2px;
      }
      .title-name {
        font-size: 16px;
        white-space: nowrap;
        font-weight: bold;
      }
    }

    ::v-deep > ul {
      height: 100%;
      border: none;
      overflow: auto;
      margin-bottom: 48px;
      background-color: #fff;
      li {
        background-color: #fff;
      }
      li.sub-item {
        padding-left: 48px !important;
      }
      .sub-submenu > .el-submenu__title {
        padding-left: 48px !important;
      }
      .el-submenu__title {
        font-size: 12px;
        color: #82848a;
        i.iconfont {
          width: 24px;
          font-size: 18px;
          margin-right: 11px;
        }
      }
    }
  }

  .header {
    position: fixed;
    top: 0;
    left: 188px;
    height: 48px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    right: 0;
    transition: all 0.5s;
    z-index: 100;
    border: 1px solid #efeaed;

    .handle-btn {
      height: 100%;
      width: 40px;
      display: flex;
      align-items: center;
      margin-left: 5px;
      cursor: pointer;

      i {
        font-size: 18px;
        margin-left: 10px;
        color: #82848a;
      }
      &:hover {
        background: #ecf5ff;
      }
    }

    .user-name {
      height: 100%;
      display: flex;
      align-items: center;
      padding-right: 10px;
      color: #000;

      i {
        padding-right: 5px;
        font-size: 18px;
      }
      i.icon-tuichu {
        margin-left: 15px;
        color: #82848a;
        padding-right: 0px;
        cursor: pointer;
      }
    }
  }

  .right {
    margin-top: 53px;
    padding-left: 193px;
    transition: all 0.5s;
    margin-bottom: 80px;

    .breadcrumb {
      background-color: #fff;
      padding: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
