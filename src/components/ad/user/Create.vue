<template>
  <el-row :gutter="0">
    <el-col :span="24" :md="{span: 18, offset: 0}">
      <div style="margin-bottom: 20px;">
        <el-form size="small" label-width="120px" >
          <el-form-item label="用户姓名" :required="true">
            <el-input v-model="info.args.name" :clearable="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="登录帐号" :required="true">
            <el-input v-model="info.args.account" :clearable="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="登录密码" :required="true">
            <el-input type="password" v-model="info.args.password" :clearable="true" :show-password="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="确认登录密码" :required="true">
            <el-input type="password" v-model="info.conformPassword" :clearable="true" :show-password="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="组织单位">
            <userUnit style="width: 100%;" v-model="info.args.parent" :clearable="true" @input="onInput" />
          </el-form-item>
          <el-form-item label="直接主管">
            <userAccount style="width: 100%;" v-model="info.args.manager" :clearable="true" @input="onInput" />
          </el-form-item>
        </el-form>

        <div style="padding: 2px 2px 2px 120px">
          <div v-if="info.user" style="margin-bottom: 20px;">
            <el-alert type="success"
                      title="新建用户成功"
                      :description="'登录帐号: ' + info.user.account + ';  用户姓名: ' + info.user.name"
                      :show-icon="false"
                      :closable="false"/>
          </div>
          <div v-if="isNotNullOrEmpty(info.error.summary)" style="margin-bottom: 20px;">
            <el-alert type="error"
                      :title="info.error.summary"
                      :description="info.error.detail"
                      :show-icon="false"
                      :closable="false"/>
          </div>
          <div>
            <el-button type="primary" :disabled="userRole !== 1" :loading="info.submitting" @click="doSave">提 交</el-button>
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
import UserUnit from '@/components/ad/user/OrgUnit'

@Component({
  components: {
    userAccount: UserAccount,
    userUnit: UserUnit
  },
  props: {
    showPasswordRole: {
      type: Boolean,
      default: false
    }
  }
})
class Create extends VueBase {
  info = {
    submitting: false,
    conformPassword: '',
    args: {
      name: '',
      account: '',
      password: '',
      manager: '',
      parent: ''
    },
    error: {
      summary: '',
      detail: ''
    },
    user: null
  }

  onInput () {
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.info.user = null
  }

  onSave (code, err, data) {
    this.info.submitting = false

    if (code === 0) {
      this.info.user = data
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doSave () {
    if (this.isNullOrEmpty(this.info.args.name)) {
      this.info.error.summary = '用户姓名为空'
      return
    }
    if (this.isNullOrEmpty(this.info.args.account)) {
      this.info.error.summary = '登录帐号为空'
      return
    }
    if (this.isNullOrEmpty(this.info.args.password)) {
      this.info.error.summary = '登录密码号为空'
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
    this.info.user = null
    this.post(this.$uris.adUserAccountCreate, this.info.args, this.onSave)
  }
}

export default Create
</script>

<style scoped>

</style>
