<template>
  <div>
    <div class="top">
      <el-menu class="menu"
               mode="horizontal"
               :router="router"
               :default-active="activeIndex"
               @select="handleInput">
        <el-menu-item v-for="(item, index) in menus"
                      :key="index"
                      :index="item.index">
          <span>{{item.title}}</span>
        </el-menu-item>
      </el-menu>
      <div class="button">
        <slot name="button" />
      </div>
    </div>
    <div class="body" :style="bodyStyle">
      <router-view  :elementHeight="elementHeight - menuHeight" @changeIndex="changeIndex"/>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    value: {
      type: String,
      default: ''
    },
    router: {
      type: Boolean,
      default: true
    },
    menus: {
      type: Array,
      default: function () {
        return [
          // {
          //  index: '',
          //  title: ''
          // }
        ]
      }
    }
  },
  watch: {
    value: {
      handler: 'onInputChanged'
    }
  }
})
class TopNavPage extends VueBase {
  activeIndex = ''
  menuHeight = 31

  get bodyStyle () {
    const minHeight = this.elementHeight - this.menuHeight + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  handleInput (val) {
    this.$emit('input', val)
  }

  onInputChanged (val) {
    this.activeIndex = val
  }

  changeIndex (val) {
    this.activeIndex = val
    this.handleInput(val)
  }

  mounted () {
    this.activeIndex = this.value
  }
}

export default TopNavPage
</script>

<style scoped>
  .top {
    display: flex;
    align-items: center;
  }
  .top .menu {
    flex: 1;
  }
  .top .menu .el-menu-item {
    height: 29px;
    line-height: 29px;
  }
  .top .button {
    display: flex;
    align-items: center;
    height: 29px;
    line-height: 29px;
    border-style: solid;
    border-width: 0px 0px 1px 0px;
    border-color: #E6E6E6;
  }

  .body {
    overflow: auto;
  }
</style>
