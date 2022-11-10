<template>
  <el-select v-model="val"
             :filterable="true"
             :clearable="clearable"
             :disabled="readOnly"
             placeholder="请选择(可输入关键字进行过滤)"
             @change="handleInput">
    <el-option-group class="group" v-for="group in info.items" :key="group.dn" :label="group.name">
      <template v-for="item in group.users">
        <el-option v-if="isVisibleItem(item)"
                   :key="item.dn"
                   :label="item.name + ' (' + item.account + ')'"
                   :value="getItemValue(item)"
                   :disabled="isDisableItem(item)">
          <span style="float: left; padding-left: 32px;">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.account }}</span>
        </el-option>
        <template v-else />
      </template>
    </el-option-group>
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
    valueType: {
      type: String,
      default: 'dn'
    },
    name: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    visibleItem: {
      type: Function,
      default: function (item) {
        return true
      }
    },
    disableItem: {
      type: Function,
      default: function (item) {
        return false
      }
    }
  },
  watch: {
    value: {
      handler: 'onInputChanged'
    }
  }
})
class Account extends VueBase {
  val = ''

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  getUser (name) {
    if (this.isNullOrEmpty(name)) {
      return null
    }

    const gc = this.info.items.length
    for (let gi = 0; gi < gc; gi++) {
      const g = this.info.items[gi]
      if (g) {
        const uc = g.users.length
        for (let ui = 0; ui < uc; ui++) {
          const u = g.users[ui]
          if (u) {
            if (name === u.name) {
              return u
            }
          }
        }
      }
    }

    return null
  }

  handleInput () {
    this.$emit('input', this.val)
  }

  onInputChanged (val) {
    this.val = val
  }

  getItemValue (item) {
    if (this.valueType === 'sid') {
      return item.sid
    } else if (this.valueType === 'account') {
      return item.account
    } else if (this.valueType === 'name') {
      return item.name
    } else {
      return item.dn
    }
  }

  isVisibleItem (item) {
    if (this.visibleItem) {
      return this.visibleItem(item)
    }
    return true
  }

  isDisableItem (item) {
    if (this.disableItem) {
      return this.disableItem(item)
    }
    return false
  }

  onGetInfo (code, err, data) {
    this.info.loading = false

    if (code === 0) {
      this.info.items = data

      const user = this.getUser(this.name)
      if (user) {
        this.val = this.getItemValue(user)
        this.handleInput()
      } else {
        if (this.isNotNullOrEmpty(this.value)) {
          this.val = this.value
        }
      }
    } else if (code !== 101) {
      this.info.items = []
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
    this.post(this.$uris.adUserAccountTree, null, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default Account
</script>

<style scoped>
  .group {
  }
  .group /deep/ .el-select-group__title {
    font-style: italic;
    font-size: 16px;
    border-color: #E4E7ED;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    color: #C0C4CC;
  }
  .group:not(:last-of-type)::after {
    background-color: transparent;
  }
</style>
