<template>
  <el-select v-model="val"
             :clearable="clearable"
             placeholder="请选择"
             @change="handleInput">
    <el-option v-for="item in info.items" :key="item.dn" :value="item.dn" :label="item.name"/>
  </el-select>
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
    clearable: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: {
      handler: 'onInputChanged'
    }
  }
})
class OrgUnit extends VueBase {
  val = ''

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  handleInput () {
    this.$emit('input', this.val)
  }

  onInputChanged (val) {
    this.val = val
  }

  onGetInfo (code, err, data) {
    this.info.loading = false

    if (code === 0) {
      this.info.items = data
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetInfo () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.adUserOrgUnitList, null, this.onGetInfo)
  }

  mounted () {
    this.val = this.value
    this.doGetInfo()
  }
}

export default OrgUnit
</script>

<style scoped>

</style>
