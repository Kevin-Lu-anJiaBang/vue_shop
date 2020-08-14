<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '60px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu unique-opened background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单的模板区域 -->
            <el-menu-item :index="item1.id + ''" v-for="item1 in item.children" :key="item1.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面内容主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user-group',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpingouwudai2',
        '102': 'iconfont icon-danju-tianchong',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const {data: res} = await this.$http.get('menus');
      // console.log(res)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    this.getMenuList()
  },
  mounted() {
    
  },
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .toggle-button{background: #4a5064;font-size: 10px;line-height: 24px;color: #fff;text-align: center;letter-spacing: 0.2em;cursor: pointer;}
  .el-menu{border-right: none;}
}
.el-main {
  background: #eaedf1;
}

.iconfont{margin-right: 10px;}
</style>