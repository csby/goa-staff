<template>
  <el-drawer class="drawer"
             :wrapperClosable="!modal"
             :with-header="withHeader"
             :show-close="showClose"
             :direction="direction"
             :size="size"
             :append-to-body="true"
             :destroy-on-close="true"
             :visible.sync="visible"
             @closed="handleInput(false)">
    <div slot="title" class="drawer-header">
      <div>
        <slot name="title">
          <i :class="icon"></i>
          <span>{{title}}</span>
        </slot>
      </div>
      <div style="flex: 1;" />
      <div>
        <slot name="button" />
      </div>
    </div>
    <div>
      <slot />
    </div>
  </el-drawer>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '680px'
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class Drawer extends VueBase {
  visible = false

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.visible = val
  }
}

export default Drawer
</script>

<style scoped>
  .drawer {
  }
  .drawer /deep/ .el-drawer__header{
    background-color: #0078D7;
    color: white;
    height: 28px;
    padding: 2px 10px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .drawer /deep/ .el-drawer__body{
    margin: 0;
    padding: 0;
  }
  .drawer /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .drawer /deep/ .el-table--small tr th {
    padding: 0;
  }
  .drawer-header {
    height: 26px;
    display: flex;
    align-items: center;
  }
  .drawer-header /deep/ .el-button {
    padding: 0px 3px;
    font-size: medium;
    color: #f2f2f2;
  }
  .drawer-header i{
    padding-right: 5px;
  }
</style>
