<template>
  <el-alert v-show="code !== 0"
            type="error"
            :closable="false"
            :title="summary"
            :description="detail" />
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    summary: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    },
    code: {
      type: Number,
      default: 0
    }
  }
})
class Error extends Vue {
}

export default Error
</script>

<style scoped>
</style>
