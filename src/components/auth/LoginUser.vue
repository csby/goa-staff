<template>
  <div class="root">
    <div class="button" @click="info.visible = true">
      <span>{{displayName}}</span>
    </div>

    <div>
      <el-drawer class="drawer"
                 direction="rtl"
                 size="300px"
                 :modal="false"
                 :visible.sync="info.visible"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :show-close="false" >
        <template #title>
          <div class="title">{{displayName}}</div>
        </template>
        <div class="body">
          <div class="header">
            <el-avatar icon="el-icon-user-solid" />
            <div class="info">
              <div>{{displayName}}</div>
              <div>{{account}}</div>
            </div>
          </div>
          <div>
            <div class="row">
              <div class="label">登录时间:</div>
              <div>{{loginTime}}</div>
            </div>
            <div class="row">
              <div class="label">登录地址:</div>
              <div>{{loginIp}}</div>
            </div>
          </div>
          <el-divider />
          <div class="button">
            <el-button type="text" icon="el-icon-lock" @click="showChangePassword">修改密码</el-button>
          </div>
          <div class="button">
            <el-button type="text" icon="el-icon-switch-button" @click="logout">注销</el-button>
          </div>
        </div>
      </el-drawer>

      <drawer class="change-password"
              key="change-password"
              v-model="changePassword.visible"
              icon="el-icon-edit-outline"
              title="修改密码"
              size="460px"
              :modal="true">
        <div style="margin: 10px 10px 20px 0px;">
          <el-form size="small" label-width="120px" >
            <el-form-item label="原密码" :required="true">
              <el-input type="password" v-model="changePassword.args.oldPassword" :clearable="true" :show-password="true" @input="onChangePasswordInput" />
            </el-form-item>
            <el-form-item label="新密码" :required="true">
              <el-input type="password" v-model="changePassword.args.newPassword" :clearable="true" :show-password="true" @input="onChangePasswordInput" />
            </el-form-item>
            <el-form-item label="确认新密码" :required="true">
              <el-input type="password" v-model="changePassword.conformPassword" :clearable="true" :show-password="true" @input="onChangePasswordInput" />
            </el-form-item>
          </el-form>

          <div style="padding: 2px 2px 2px 10px">
            <div v-if="isNotNullOrEmpty(changePassword.success.summary)" style="margin-bottom: 20px;">
              <el-alert type="success"
                        :title="changePassword.success.summary"
                        :show-icon="false"
                        :closable="false"/>
            </div>
            <div v-else-if="isNotNullOrEmpty(changePassword.error.summary)" style="margin-bottom: 20px;">
              <el-alert type="error"
                        :title="changePassword.error.summary"
                        :description="changePassword.error.detail"
                        :show-icon="false"
                        :closable="false"/>
            </div>
            <div v-else />
            <div style="text-align: right;">
              <el-button :disabled="changePassword.submitting" @click="changePassword.visible = false">关 闭</el-button>
              <el-button type="primary" :disabled="isNullOrEmpty(changePassword.args.newPassword)" :loading="changePassword.submitting" @click="doChangePassword">提 交</el-button>
            </div>
            <div style="margin: 10px;">
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
          </div>
        </div>

      </drawer>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import LogoutBase from '@/components/LogoutBase'
import ErrorMessage from '@/components/Error'
import Drawer from '@/components/Drawer'

@Component({
  components: {
    errorMessage: ErrorMessage,
    drawer: Drawer
  }
})
class LoginUser extends LogoutBase {
  account = ''
  displayName = ''
  loginTime = ''
  loginIp = ''
  notifySocket = null

  info = {
    visible: false
  }

  changePassword = {
    visible: false,
    submitting: false,
    args: {
      oldPassword: '',
      newPassword: ''
    },
    conformPassword: '',
    error: {
      summary: '',
      detail: ''
    },
    success: {
      summary: ''
    }
  }

  showChangePassword () {
    this.info.visible = false
    this.changePassword.args.oldPassword = ''
    this.changePassword.args.newPassword = ''
    this.changePassword.conformPassword = ''
    this.changePassword.error.summary = ''
    this.changePassword.error.detail = ''
    this.changePassword.success.summary = ''
    this.changePassword.submitting = false
    this.changePassword.visible = true
  }

  onChangePasswordInput () {
    this.changePassword.error.summary = ''
    this.changePassword.error.detail = ''
    this.changePassword.success.summary = ''
  }

  onChangePassword (code, err, data) {
    this.changePassword.submitting = false

    if (code === 0) {
      this.changePassword.success.summary = '密码修改成功'
    } else if (code !== 101) {
      this.changePassword.error.summary = err.summary
      this.changePassword.error.detail = err.detail
      if (this.changePassword.error.detail === '密码错误') {
        this.changePassword.error.detail = '原密码不正确'
        this.changePassword.error.summary = '输入错误'
      }
    }
  }

  doChangePassword () {
    if (this.changePassword.submitting) {
      return
    }
    if (this.isNullOrEmpty(this.changePassword.args.oldPassword)) {
      this.changePassword.error.summary = '原密码不能为空'
      return
    }
    if (this.isNullOrEmpty(this.changePassword.args.newPassword)) {
      this.changePassword.error.summary = '新密码不能为空'
      return
    }
    if (this.changePassword.args.newPassword !== this.changePassword.conformPassword) {
      this.changePassword.error.summary = '两次输入新密码不一致'
      return
    }

    this.changePassword.error.summary = ''
    this.changePassword.error.detail = ''
    this.changePassword.success.summary = ''
    this.changePassword.submitting = true

    this.post(this.$uris.adUserAccountPasswordChange, this.changePassword.args, this.onChangePassword)
  }

  onGetLoginAccount (code, err, data) {
    if (code === 0) {
      this.account = data.account
      this.displayName = data.name
      if (this.isNullOrEmpty(this.displayName)) {
        this.displayName = data.account
      }
      this.loginTime = data.loginTime
      this.loginIp = data.loginIp
      this.$db.set(this.$db.keys.role, data.role)
      this.openNotifySocket()
    }
  }

  getLoginAccount () {
    this.post(this.$uris.getLoginAccount, null, this.onGetLoginAccount)
  }

  onOtherUserLogin (data) {
    const msg = '<div>用户账号：' + data.userAccount + '</div>' +
      '<div>用户姓名：' + data.userName + '</div>' +
      '<div>登陆时间：' + data.loginTime + '</div>' +
      '<div>IP地址：' + data.loginIp + '</div>'

    this.$notify({
      title: '用户登陆',
      dangerouslyUseHTMLString: true,
      message: msg,
      type: 'info'
    })
  }

  onNotifyOpen () {
    this.$evt.fire(this.$evt.local.login)
    // console.log("websocket notify subscribe opened");
  }

  onNotifyMessage (evt) {
    if (!evt.data) {
      return
    }

    try {
      const msg = JSON.parse(evt.data)
      this.$evt.fire(this.$evt.websocket.notify, msg.id, msg.data)
      // console.log('onNotifyMessage(id =', msg.id, ', data =', msg.data, ')')
      if (msg.id === this.$evt.id.wsOptUserLogin) {
        // this.onOtherUserLogin(msg.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  onNotifyClose () {
    // console.log("websocket notify subscribe closed");
    this.notifySocket = null
    this.$evt.fire(this.$evt.websocket.notify, this.$evt.id.wsOptUserLogout, null)
  }

  onNotifyError (evt) {
    // console.log("onNotifyError(", evt, ")");
  }

  openNotifySocket () {
    this.notifySocket = this.$net.createSocket(this.$uris.websocketNotify,
      this.onNotifyMessage,
      this.onNotifyOpen,
      this.onNotifyClose,
      this.onNotifyError)
  }

  closeNotifySocket () {
    if (this.notifySocket) {
      try {
        this.notifySocket.close()
      } catch (e) {
        console.log(e)
      }
    }
  }

  onSendSocketNotify (id, data) {
    if (this.notifySocket) {
      try {
        const msg = {
          id: id,
          data: data
        }
        this.notifySocket.send(JSON.stringify(msg))
      } catch (e) {
        console.log(e)
      }
    } else {
      this.$evt.fire(this.$evt.websocket.notify, this.$evt.id.wsOptUserLogout, null)
    }
  }

  mounted () {
    this.getLoginAccount()
    this.$evt.on(this.$evt.local.socket, this.onSendSocketNotify)
  }

  beforeDestroy () {
    this.$evt.off(this.$evt.local.socket, this.onSendSocketNotify)
    this.closeNotifySocket()
  }
}

export default LoginUser
</script>

<style scoped>
  .root {
    padding: 0px 2px;
  }
  .root .button {
    cursor: pointer;
  }
  .root .button :hover {
    color: white;
  }

  .drawer {
  }
  .drawer /deep/ .el-drawer__header{
    background-color: #222222;
    color: white;
    height: 28px;
    padding: 2px 15px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .drawer /deep/ .el-drawer__body{
    margin: 0;
    padding: 0;
  }
  .drawer .title {
    text-align: right;
    color: #999999;
  }
  .drawer .body {
    padding: 5px 10px;
    font-size: small;
  }
  .drawer .body .header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .drawer .body .header .info {
    margin-left: 5px;
  }
  .drawer .body .header .info :last-child {
    color: #8492a6;
    font-size: x-small;
  }
  .drawer .body .button {
    padding: 0px;
    margin: 0px;
  }
  .drawer .body .button .el-button {
    padding: 0px;
    margin: 10px 0px 0px 0px;
  }
  .drawer .body .el-divider--horizontal {
    margin: 10px 0px 0px 0px;
  }

  .change-password /deep/ .el-drawer__header {
    background-color: #0078D7;
  }

  .row {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }
  .row .label {
    padding-right: 5px;
    font-weight: lighter;
    color: #909399;
  }
</style>
