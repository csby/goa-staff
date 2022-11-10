<template>
  <div class="root">
    <div class="item" v-for="(item, index) in menus" :key="index">
      <div class="button" @click="onMenuItemClick(item)">
        <span>{{item.title}}</span>
      </div>
      <div style="height: 4px;">
        <div class="selected" v-show="item.index === activeIndex"></div>
      </div>
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
class Index extends VueBase {
  activeIndex = ''

  handleInput (val) {
    this.$emit('input', val)
  }

  onInputChanged (val) {
    this.activeIndex = val
    this.handleInput(val)
  }

  onMenuItemClick (item) {
    if (!item) {
      return
    }

    this.to(item.index)
    this.activeIndex = item.index
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
  }

  .item {
    margin: 0px 5px;
    padding-top: 5px;
  }
  .item .button {
    cursor: pointer;
  }
  .item .button :hover {
    color: white;
  }

  .selected{
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0px 6px 6px 6px;
    border-color: transparent transparent #f8f8f8 transparent;
    margin-left: calc(50% - 8px);
  }
</style>
