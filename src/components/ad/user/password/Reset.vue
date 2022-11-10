<template>
  <el-row :gutter="0">
    <el-col :span="24" :md="{span: 18, offset: 0}">
      <div style="margin-bottom: 20px;">
        <el-form size="small" label-width="120px" >
          <el-form-item label="用户帐号" :required="true">
            <userAccount style="width: 100%;"
                         v-model="info.args.account"
                         value-type="account"
                         :clearable="true"
                         :visible-item="isUserVisible"
                         @input="onInput" />
          </el-form-item>
          <el-form-item label="密码" :required="true">
            <el-input type="password" v-model="info.args.password" :clearable="true" :show-password="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="确认密码" :required="true">
            <el-input type="password" v-model="info.conformPassword" :clearable="true" :show-password="true" @input="onInput" />
          </el-form-item>
        </el-form>

        <div style="padding: 2px 2px 2px 120px">
          <div v-if="isNotNullOrEmpty(info.success.summary)" style="margin-bottom: 20px;">
            <el-alert type="success"
                      :title="info.success.summary"
                      :show-icon="false"
                      :closable="false"/>
          </div>
          <div v-else-if="isNotNullOrEmpty(info.error.summary)" style="margin-bottom: 20px;">
            <el-alert type="error"
                      :title="info.error.summary"
                      :description="info.error.detail"
                      :show-icon="false"
                      :closable="false"/>
          </div>
          <div v-else />
          <div>
            <el-button type="primary" :disabled="isNullOrEmpty(info.args.account)" :loading="info.submitting" @click="doSave">提 交</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="24" :md="{span: 5, offset: 0}">
      <div v-show="showPasswordRole" style="margin-left: 20px;">
        <div style="font-style: italic;">密码规则说明</div>
        <pre style="font-weight: lighter; line-height: 20px; color: #2c3e50;">
#、 不能包含登录帐号，不能包含用户姓名中超过两个连续字符的部分
#、 至少包含以下四类字符中的三类字符:
    (1) 英文大写字母(A 到 Z)
    (2) 英文小写字母(a 到 z)
    (3) 10 个基本数字(0 到 9)
    (4) 非字母字符(例如 !、$、#、%、@)
#、 密码长度不少于7 个字符
      </pre>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import UserAccount from '@/components/ad/user/Account'

@Component({
  components: {
    userAccount: UserAccount
  },
  props: {
    showPasswordRole: {
      type: Boolean,
      default: false
    }
  }
})
class Reset extends VueBase {
  info = {
    submitting: false,
    conformPassword: '',
    args: {
      account: '',
      password: ''
    },
    error: {
      summary: '',
      detail: ''
    },
    success: {
      summary: ''
    }
  }

  subordinate = {
    loading: false,
    args: {
      account: ''
    },
    items: [
    //  {
    //    dn: '',
    //    sid: '',
    //    account: '',
    //    name: '张三'
    //  }
    ],
    error: {
      code: 0,
      summary: '',
      detail: ''
    }
  }

  onInput () {
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.info.success.summary = ''
  }

  isUserVisible (item) {
    if (!item) {
      return true
    }
    if (this.userRole === 1) {
      return true
    }

    const c = this.subordinate.items.length
    for (let i = 0; i < c; i++) {
      if (item.dn === this.subordinate.items[i].dn) {
        return true
      }
    }

    return false
  }

  onGetSubordinates (code, err, data) {
    this.subordinate.loading = false
    this.subordinate.error.code = code

    if (code === 0) {
      this.subordinate.items = data
    } else if (code !== 101) {
      this.subordinate.items = []
      this.subordinate.error.summary = err.summary
      this.subordinate.error.detail = err.detail
    }
  }

  doGetSubordinates () {
    if (this.subordinate.loading) {
      return
    }

    this.subordinate.loading = true
    this.subordinate.error.code = 0
    this.subordinate.error.summary = ''
    this.subordinate.error.detail = ''
    this.post(this.$uris.adUserSubordinateList, this.subordinate.args, this.onGetSubordinates)
  }

  onSave (code, err, data) {
    this.info.submitting = false

    if (code === 0) {
      this.info.success.summary = '密码重置成功'
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doSave () {
    if (this.isNullOrEmpty(this.info.args.account)) {
      this.info.error.summary = '用户帐号为空'
      return
    }
    if (this.isNullOrEmpty(this.info.args.password)) {
      this.info.error.summary = '密码号为空'
      return
    }
    if (this.info.args.password !== this.info.conformPassword) {
      this.info.error.summary = '两次输入密码不一致'
      return
    }

    if (this.info.submitting) {
      return
    }

    this.info.submitting = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.info.success.summary = ''
    this.post(this.$uris.adUserAccountPasswordReset, this.info.args, this.onSave)
  }

  mounted () {
    if (this.userRole !== 1) {
      this.doGetSubordinates()
    }
  }
}

export default Reset
</script>

<style scoped>

</style>
