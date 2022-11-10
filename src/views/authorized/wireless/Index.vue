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
    current: '/wireless/filter',
    items: [
      {
        index: '/wireless/filter',
        title: 'MAC地址过滤',
        disabled: false
      },
      {
        index: '/wireless/lease',
        title: 'IP地址租用',
        disabled: false
      }
    ]
  }
}

export default Index
</script>

<style scoped>

</style>
