<template>
  <div>
    <page v-model="menu.current"
          :menus="menu.items"
          :element-height="elementHeight">
      <template #button v-if="menu.current === '/resource/svn'">
        <div style="padding-right: 10px;">
          <el-button type="text" icon="el-icon-view" @click="svn.permission.visible = true">
            <span>我的权限列表</span>
          </el-button>
        </div>
      </template>
    </page>

    <drawer v-model="svn.permission.visible"
            icon="el-icon-lock"
            title="我的权限列表">
      <myPermission :element-height="elementHeight"/>
    </drawer>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import Page from '@/components/page/TopNavPage'
import Drawer from '@/components/Drawer'
import MyPermission from '@/views/authorized/resource/svn/MyPermission'

@Component({
  components: {
    page: Page,
    drawer: Drawer,
    myPermission: MyPermission
  }
})
class Index extends RouterPage {
  menu = {
    current: '/resource/share',
    items: [
      {
        index: '/resource/server',
        title: '服务器',
        disabled: false
      },
      {
        index: '/resource/share',
        title: '共享目录'
      },
      {
        index: '/resource/svn',
        title: 'SVN',
        disabled: false
      }
    ]
  }

  svn = {
    permission: {
      visible: false
    }
  }
}

export default Index
</script>

<style scoped>
  .menu {
  }
  .menu .el-menu-item {
    height: 29px;
    line-height: 29px;
  }
</style>
