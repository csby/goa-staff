<template>
  <el-card :body-style="{ padding: '0px' }"
           shadow="hover"
           v-loading="info.loading"
           element-loading-text="加载中..."
           element-loading-spinner="el-icon-loading">
    <div slot="header" class="header">
      <span class="title">访问权限</span>
      <el-badge type="info" :value="info.items.length" />
    </div>
    <el-table :data="info.items" size="small" :border="true">
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
          <span v-show="isNotNullOrEmpty(scope.row.account)"  style="color: gray; margin-left: 3px;">({{scope.row.account}})</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 0">拒绝</span>
          <span v-else-if="scope.row.level === 1">只读</span>
          <span v-else-if="scope.row.level === 2">读写</span>
          <span v-else></span>
          <span v-show="scope.row.inherited" style="color: gray; margin-left: 3px;">(继承)</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="right">
        <template #header>
          <el-button type="text"
                     size="small"
                     icon="el-icon-circle-plus-outline"
                     v-show="userRole === 1 || authAdmin"
                     @click="showPermissionAdd">添加</el-button>
          <el-button type="text"
                     size="small"
                     icon="el-icon-refresh"
                     :loading="info.loading"
                     @click="doGetInfo">刷新</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     icon="el-icon-edit-outline"
                     v-show="userRole === 1 || authAdmin"
                     @click="showPermissionMod(scope.row)">修改</el-button>
          <el-popconfirm v-show="scope.row.inherited === false"
                         :title="'确定要删除[' + scope.row.name + ']吗？'"
                         @confirm="doDeletePermission(scope.row)">
            <el-button slot="reference"
                       type="text"
                       size="small"
                       v-show="userRole === 1 || authAdmin"
                       style="color: #F56C6C;"
                       icon="el-icon-remove-outline">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-alert v-show="isNotNullOrEmpty(info.error.summary)" type="error"
                  :title="info.error.summary"
                  :description="info.error.detail"
                  :closable="false" />
      </template>
    </el-table>

    <drawer v-model="add.visible"
            title="添加访问权限"
            icon="el-icon-circle-plus-outline"
            :modal="true">
      <el-form label-width="80px" size="small" style="padding: 15px;">
        <el-form-item label="存储库">
          <el-input v-model="add.args.repository" :disabled="true"/>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="add.args.path" :disabled="true"/>
        </el-form-item>
        <el-form-item label="用户" :required="true">
          <userAccount v-model="add.args.accountId"
                       value-type="sid"
                       style="width: 100%;"
                       :disable-item="isAddItemDisabled"
                       @input="onAddInput"/>
        </el-form-item>
        <el-form-item label="权限" :required="true">
          <el-radio-group v-model="add.args.accessLevel" @change="onAddInput">
            <el-radio-button :label="0">拒 绝</el-radio-button>
            <el-radio-button :label="1">只 读</el-radio-button>
            <el-radio-button :label="2">读 写</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-alert v-show="isNotNullOrEmpty(add.error.summary)"
                    type="error"
                    :title="add.error.summary"
                    :description="add.error.detail"
                    :closable="false" />
        </el-form-item>
        <el-form-item>
          <div style="text-align: right;">
            <el-button :disabled="add.submitting" @click="add.visible = false">
              <span>取 消</span>
            </el-button>
            <el-button type="primary" :loading="add.submitting" @click="doAddPermission">
              <span>确 定</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </drawer>

    <drawer v-model="mod.visible"
            title="修改访问权限"
            icon="el-icon-edit-outline"
            :modal="true">
      <el-form label-width="80px" size="small" style="padding: 15px;">
        <el-form-item label="存储库">
          <el-input v-model="mod.args.repository" :disabled="true"/>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="mod.args.path" :disabled="true"/>
        </el-form-item>
        <el-form-item label="用户">
          <userAccount v-model="mod.args.accountId"
                       value-type="sid"
                       style="width: 100%;"
                       :read-only="true"
                       :disable-item="isAddItemDisabled" />
        </el-form-item>
        <el-form-item label="权限" :required="true">
          <el-radio-group v-model="mod.level" @change="onModInput">
            <el-radio-button :label="-1" v-if="mod.inherited">
              <span>继 承 (</span>
              <span v-if="mod.args.accessLevel === 0">拒绝</span>
              <span v-else-if="mod.args.accessLevel === 1">只读</span>
              <span v-else>读写</span>
              <span>)</span>
            </el-radio-button>
            <el-radio-button :label="0">拒 绝</el-radio-button>
            <el-radio-button :label="1">只 读</el-radio-button>
            <el-radio-button :label="2">读 写</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-alert v-show="isNotNullOrEmpty(mod.error.summary)"
                    type="error"
                    :title="mod.error.summary"
                    :description="mod.error.detail"
                    :closable="false" />
        </el-form-item>
        <el-form-item>
          <div style="text-align: right;">
            <el-button :disabled="mod.submitting" @click="mod.visible = false">
              <span>取 消</span>
            </el-button>
            <el-button type="primary"
                       :disabled="mod.level === -1 || (mod.inherited === false && mod.level === mod.args.accessLevel)"
                       :loading="mod.submitting"
                       @click="doModPermission">
              <span>确 定</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </drawer>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Drawer from '@/components/Drawer'
import UserAccount from '@/components/ad/user/Account'

@Component({
  components: {
    drawer: Drawer,
    userAccount: UserAccount
  },
  props: {
    repository: {
      type: Object,
      default: null
    },
    users: {
      type: Array,
      default: null
    },
    authAdmin: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    repository: {
      handler: 'onRepositoryChanged'
    }
  }
})
class Permission extends VueBase {
  info = {
    loading: false,
    items: [
      // {
      //  id: '',
      //  account: '',
      //  name: '',
      //  level: 0,
      //  inherited: false
      // }
    ],
    error: {
      summary: '',
      detail: ''
    }
  }

  add = {
    visible: false,
    submitting: false,
    args: {
      repository: '',
      path: '',
      accountId: '',
      accessLevel: 2
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  mod = {
    visible: false,
    submitting: false,
    inherited: false,
    level: 0,
    args: {
      repository: '',
      path: '',
      accountId: '',
      accessLevel: 0
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  getUser (id) {
    if (!this.users) {
      return null
    }

    const c = this.users.length
    for (let i = 0; i < c; i++) {
      const user = this.users[i]
      if (user) {
        if (user.sid === id) {
          return user
        }
      }
    }

    return null
  }

  showPermissionAdd () {
    if (!this.repository) {
      return
    }

    this.add.args.repository = this.repository.repository
    this.add.args.path = this.repository.path
    this.add.args.accountId = ''
    this.add.args.accessLevel = 2
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.submitting = false
    this.add.visible = true
  }

  showPermissionMod (row) {
    if (!this.repository) {
      return
    }
    if (!row) {
      return
    }

    this.mod.args.repository = this.repository.repository
    this.mod.args.path = this.repository.path
    this.mod.args.accountId = row.id
    this.mod.args.accessLevel = row.level
    this.mod.level = row.level
    this.mod.inherited = row.inherited
    if (row.inherited) {
      this.mod.level = -1
    }
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.mod.submitting = false
    this.mod.visible = true
  }

  onAddInput () {
    this.add.error.summary = ''
    this.add.error.detail = ''
  }

  onModInput () {
    this.mod.error.summary = ''
    this.mod.error.detail = ''
  }

  isAddItemDisabled (item) {
    if (!item) {
      return false
    }

    const c = this.info.items.length
    for (let i = 0; i < c; i++) {
      if (item.sid === this.info.items[i].id) {
        return true
      }
    }

    return false
  }

  onRepositoryChanged (val) {
    if (!val) {
      return
    }

    this.doGetInfo()
  }

  onDeletePermission (code, err, data) {
    if (code === 0) {
      this.doGetInfo()
      this.message('删除成功', 'success')
    } else {
      this.error(err)
    }
  }

  doDeletePermission (row) {
    if (!this.repository) {
      return
    }
    if (!row) {
      return
    }

    const argument = {
      repository: this.repository.repository,
      path: this.repository.path,
      accountId: row.id
    }

    this.post(this.$uris.svnPermissionItemDel, argument, this.onDeletePermission)
  }

  onAddPermission (code, err, data) {
    this.add.submitting = false

    this.info.items = []
    if (code === 0) {
      this.doGetInfo()
      this.add.visible = false
    } else if (code !== 101) {
      this.add.error.summary = err.summary
      this.add.error.detail = err.detail
    }
  }

  doAddPermission () {
    if (this.add.submitting) {
      return
    }
    const argument = this.add.args
    if (this.isNullOrEmpty(argument.accountId)) {
      this.add.error.summary = '用户不能为空'
      return
    }

    this.add.submitting = true
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.post(this.$uris.svnPermissionItemAdd, argument, this.onAddPermission)
  }

  onModPermission (code, err, data) {
    this.mod.submitting = false

    this.info.items = []
    if (code === 0) {
      this.doGetInfo()
      this.mod.visible = false
    } else if (code !== 101) {
      this.mod.error.summary = err.summary
      this.mod.error.detail = err.detail
    }
  }

  doModPermission () {
    if (this.mod.submitting) {
      return
    }
    if (this.mod.level === -1) {
      return
    }
    const argument = this.mod.args
    if (this.isNullOrEmpty(argument.accountId)) {
      this.mod.error.summary = '用户不能为空'
      return
    }
    argument.accessLevel = this.mod.level
    let uri = this.$uris.svnPermissionItemMod
    if (this.mod.inherited) {
      uri = this.$uris.svnPermissionItemAdd
    }

    this.mod.submitting = true
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.post(uri, argument, this.onModPermission)
  }

  onGetInfo (code, err, data) {
    this.info.loading = false

    this.info.items = []
    if (code === 0) {
      const items = data
      const c = items.length
      for (let i = 0; i < c; i++) {
        const item = items[i]
        const user = this.getUser(item.accountId)
        if (user) {
          this.info.items.push({
            id: user.sid,
            account: user.account,
            name: user.name,
            level: item.accessLevel,
            inherited: item.inherited
          })
        } else {
          this.info.items.push({
            id: item.accountId,
            account: '',
            name: item.accountName,
            level: item.accessLevel,
            inherited: item.inherited
          })
        }
      }
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetInfo () {
    if (!this.repository) {
      return
    }
    const argument = {
      name: this.repository.repository,
      path: this.repository.path
    }
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.svnPermissionItemList, argument, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default Permission
</script>

<style scoped>
  .el-card /deep/ .el-card__header {
    background-color: #f5f7fa;
    padding: 3px 6px;
  }
  .el-card:hover /deep/ .el-card__header {
    background-color: #D9ECFF;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header .title {
    margin-right: 5px;
  }
  .header .remark {
    margin-left: 5px;
    color: #8492a6;
  }
  .el-card /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .el-card /deep/ .el-table--small tr th {
    padding: 0;
    background-color: #F2F6FE;
  }
  .el-card /deep/ .el-table__empty-block {
    min-height: 0;
    width: 96%;
  }
  .el-card /deep/ .el-table__empty-text {
    width: 100%;
  }
  .el-card /deep/ .el-button, .el-popconfirm {
    margin: 0px 6px;
    padding: 1px;
  }
</style>
