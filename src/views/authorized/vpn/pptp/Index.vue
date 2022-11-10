<template>
  <div>
    <leftNavPage v-model="info.index"
                 :element-height="elementHeight"
                 left-width="120px"
                 :menus="info.menus">
      <div>
        <div v-if="info.index === '0'" >
          <span>使用说明说</span>
        </div>
        <div v-else-if="info.index === '1'" >
          <span>帐号状态</span>
        </div>
        <div v-else-if="info.index === '3'" >
          <enableList :element-height="elementHeight" />
        </div>
      </div>
    </leftNavPage>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import LeftNavPage from '@/components/page/LeftNavPage'
import EnableList from '@/views/authorized/vpn/pptp/EnableList'

@Component({
  components: {
    leftNavPage: LeftNavPage,
    enableList: EnableList
  }
})
class Index extends RouterPage {
  info = {
    index: '0',
    menus: [
      {
        index: '0',
        title: '使用说明',
        disabled: false
      },
      {
        index: '1',
        title: '我的帐号',
        disabled: false
      },
      {
        index: '2',
        title: '开通申请',
        disabled: false,
        badge: 0
      },
      {
        index: '3',
        title: '开通帐号',
        disabled: false
      }
    ]
  }
}

export default Index
</script>

<style scoped>

</style>
