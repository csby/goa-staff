<template>
  <page v-model="menu.current"
        :menus="menu.items"
        :element-height="elementHeight">
  </page>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import Page from '@/components/page/TopNavPage'

@Component({
  components: {
    page: Page
  }
})
class Index extends RouterPage {
  menu = {
    current: '/security/account',
    items: [
      {
        index: '/security/account',
        title: '用户帐号',
        disabled: false
      },
      {
        index: '/security/mail',
        title: '电子邮箱',
        disabled: false
      }
    ]
  }
}

export default Index
</script>

<style scoped>
</style>
