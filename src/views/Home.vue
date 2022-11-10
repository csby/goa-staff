<template>
  <el-container>
    <el-header height="auto" ref="top">
      <topHeader v-model="menu.currentItem" :menus="menu.items">
        <div>
          <loginUser v-if="isAuthorized" />
          <div v-else class="button" @click="toLoginPage">
            <span >登 录</span>
          </div>
        </div>

      </topHeader>
    </el-header>
    <el-main :style="mainStyle">
      <router-view :element-height="mainHeight" @changeIndex="onMenuIndexChanged"/>
    </el-main>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Component from 'vue-class-component'
import TopHeader from '@/components/nav/head/Index'
import LoginUser from '@/components/auth/LoginUser'

@Component({
  components: {
    topHeader: TopHeader,
    loginUser: LoginUser
  }
})
class Home extends Vue {
  menu = {
    currentItem: '/',
    items: [
      {
        title: '主页',
        index: '/'
      },
      {
        title: '公共资源',
        index: '/resource/share'
      },
      {
        title: '无线设备',
        index: '/wireless/filter'
      },
      {
        title: 'VPN',
        index: '/vpn/pptp'
      },
      {
        title: '安全',
        index: '/security/account'
      }
    ]
  }

  mainHeight = 0

  get mainStyle () {
    const minHeight = this.mainHeight + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  get isAuthorized () {
    return this.$db.authorized()
  }

  toLoginPage () {
    this.$router.push({ path: '/login' })
  }

  getMenuItem (path) {
    const c = this.menu.items.length
    for (let i = c - 1; i >= 0; i--) {
      const item = this.menu.items[i]
      if (item.index === path) {
        return item
      }
    }

    return null
  }

  onSizeChanged () {
    const top = this.$refs.top
    if (!top) {
      return
    }

    const clientHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    let topHeight = top.offsetHeight
    if (top.$el) {
      topHeight = top.$el.offsetHeight
    }
    const marginHeight = 0
    const paddingHeight = 1
    this.mainHeight = clientHeight - topHeight - marginHeight - paddingHeight
  }

  onMenuIndexChanged (val) {
    const matchedItems = this.$route.matched
    if (matchedItems) {
      const c = matchedItems.length
      for (let i = c - 1; i >= 0; i--) {
        const matched = matchedItems[i]
        const item = this.getMenuItem(matched.path)
        if (item) {
          this.menu.currentItem = item.index
          return
        }
      }
    }

    this.menu.currentItem = val
  }

  mounted () {
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Home
</script>

<style scoped>
  .el-container, .el-header, .el-main  {
    padding: 0;
  }

  .el-header {
    background-color: #222222;
    color: #999999;
  }

  .button {
    cursor: pointer;
    padding: 0px 2px;
  }
  .button :hover {
    color: white;
  }
</style>
