<template>
  <div class="root">
    <img class="logo" alt="logo" src="../../../assets/logo.png"/>
    <span class="title">办公系统</span>
    <navMenu v-model="activeIndex" :menus="menus" />
    <div style="flex: 1;" />
    <slot />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import NavMenu from '@/components/nav/head/menu/Index'

@Component({
  components: {
    navMenu: NavMenu
  },
  props: {
    value: {
      type: String,
      default: ''
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
    },
    activeIndex: {
      handler: 'handleInput'
    }
  }
})
class Index extends VueBase {
  activeIndex = ''

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

export default Index
</script>

<style scoped>
  .root {
    display: flex;
    align-items: center;
    padding: 0px 15px;
  }
  .root .logo {
    width: 24px;
    height: 24px;
  }
  .root .title {
    margin: 0px 8px;
    font-size: large;
  }
</style>
