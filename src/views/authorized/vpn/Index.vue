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
    current: '/vpn/pptp',
    items: [
      {
        index: '/vpn/pptp',
        title: 'PPTP',
        disabled: false
      },
      {
        index: '/vpn/openvpn',
        title: 'Open VPN',
        disabled: false
      }
    ]
  }
}

export default Index
</script>

<style scoped>
</style>
