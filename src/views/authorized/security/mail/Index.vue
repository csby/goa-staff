<template>
  <leftNavPage v-model="info.index"
               :element-height="elementHeight"
               left-width="100px"
               :menus="info.menus">
    <div v-if="info.index === '0'">
      <block name="发件人地址"
             :key="0"
             :elementHeight="elementHeight"
             :page-uri="this.$uris.mailSenderBlockAddressPage"
             :add-uri="this.$uris.mailSenderBlockAddressAdd"
             :del-uri="this.$uris.mailSenderBlockAddressDel"/>
    </div>
    <div v-else-if="info.index === '1'">
      <block name="收件人地址"
             :key="1"
             :elementHeight="elementHeight"
             :page-uri="this.$uris.mailReceiverBlockAddressPage"
             :add-uri="this.$uris.mailReceiverBlockAddressAdd"
             :del-uri="this.$uris.mailReceiverBlockAddressDel"/>
    </div>
    <div v-else-if="info.index === '2'">
      <block :elementHeight="elementHeight"
             :key="2"
             :page-uri="this.$uris.mailSenderBlockIpPage">
        <template slot="columns">
          <el-table-column label="IP地址" prop="ip" width="125px"/>
          <el-table-column label="IP地址归属地" prop="ipLocator"/>
          <el-table-column label="首次阻止时间" prop="firstRejectDateTime" width="155px"/>
          <el-table-column label="最后阻止时间" prop="lastRejectDateTime" width="155px"/>
          <el-table-column label="阻止次数" prop="rejectCount" width="105px" align="right"/>
        </template>
      </block>
    </div>
  </leftNavPage>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import LeftNavPage from '@/components/page/LeftNavPage'
import Block from '@/views/authorized/security/mail/Block'

@Component({
  components: {
    leftNavPage: LeftNavPage,
    block: Block
  }
})
class Index extends RouterPage {
  info = {
    index: '0',
    menus: [
      {
        index: '0',
        title: '阻止发件人',
        disabled: false
      },
      {
        index: '1',
        title: '阻止收件人',
        disabled: false
      },
      {
        index: '2',
        title: '阻止IP地址',
        disabled: false
      }
    ]
  }
}

export default Index
</script>

<style scoped>

</style>
