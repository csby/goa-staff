<template>
  <el-container>
    <el-aside :width="leftWidth">
      <el-menu :style="heightStyle"
               :default-active="activeIndex"
               @select="handleInput">
        <el-menu-item v-for="(item, index) in menus"
                      :key="index"
                      :index="item.index"
                      :disabled="item.disabled">
          <div slot="title">
            <div v-if="item.badge > 0" class="badge">
              <el-badge :value="item.badge">
                <span>{{item.title}}</span>
              </el-badge>
            </div>
            <div v-else>{{item.title}}</div>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main :style="heightStyle">
      <slot />
    </el-main>
  </el-container>
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
    leftWidth: {
      type: String,
      default: '180px'
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
class LeftNavPage extends VueBase {
  activeIndex = ''

  get heightStyle () {
    const minHeight = this.elementHeight + 'px'
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

  mounted () {
    this.activeIndex = this.value
  }
}

export default LeftNavPage
</script>

<style scoped>
  .el-container, .el-aside, .el-main {
    padding: 0;
  }

  .el-menu-item {
    height: 32px;
    line-height: 32px;
  }

  .badge {
  }
  .badge /deep/ .el-badge__content.is-fixed {
     right: -2px;
     transform: translateY(20%) translateX(100%);
   }
</style>
