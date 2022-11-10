<template>
  <div>
    <el-card :body-style="{ padding: '0px' }"
             shadow="hover"
             v-loading="info.loading"
             element-loading-text="加载中..."
             element-loading-spinner="el-icon-loading">
      <div slot="header" class="header">
        <span class="title">{{data.description}}</span>
        <el-badge type="info" :value="info.items.length" />
        <span class="remark" v-show="isNotNullOrEmpty(data.info)">({{data.info}})</span>
        <div style="flex: 1;" />
        <el-button type="text" size="small" icon="el-icon-circle-plus-outline" v-show="canAdd" @click="showAddMember">
          <span>添加</span>
        </el-button>
        <el-button type="text" size="small" icon="el-icon-refresh" :loading="info.loading" @click="doGetInfo">
          <span>刷新</span>
        </el-button>
      </div>
      <el-table :data="info.items" :show-header="false" size="small">
        <el-table-column type="index" align="right"/>
        <el-table-column>
          <template slot-scope="scope">
            <span>{{scope.row.name}} ({{scope.row.account}})</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="right">
          <template slot-scope="scope">
            <el-popconfirm v-show="canAdd" :title="'确定要删除【' + scope.row.name + '】吗？'" @confirm="doRemoveMember(scope.row.dn)">
              <el-button type="text" size="small" icon="el-icon-delete" slot="reference" style="color: #F56C6C;">删除</el-button>
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
    </el-card>

    <drawer v-model="add.visible"
            title="添加成员"
            icon="el-icon-edit-outline"
            size="420px"
            :modal="true">
      <el-form size="small" style="padding: 15px;">
        <el-form-item label="用户" :required="true">
          <userAccount v-model="add.args.memberDn"
                       value-type="dn"
                       style="width: 100%;"
                       :disable-item="isAddItemDisabled" />
        </el-form-item>
        <el-form-item>
          <el-alert v-show="add.error.code !== 0"
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
            <el-button type="primary"
                       :disabled="isNullOrEmpty(add.args.memberDn)"
                       :loading="add.submitting"
                       @click="doAddMember">
              <span>确 定</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </drawer>
  </div>
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
    data: {
      type: Object,
      default: function () {
        return {
          dn: '',
          account: '',
          description: '',
          info: '',
          role: 0
        }
      }
    },
    authAdmin: {
      type: Boolean,
      default: false
    }
  }
})
class Group extends VueBase {
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  add = {
    visible: false,
    submitting: false,
    args: {
      groupDn: '',
      memberDn: ''
    },
    error: {
      code: 0,
      summary: '',
      detail: ''
    }
  }

  get canAdd () {
    if (this.userRole === 1) {
      return true
    }

    if (this.data.role === 99) {
      return false
    }

    return this.authAdmin
  }

  checkAuthAdmin () {
    if (this.userRole === 1) {
      return
    }

    const account = this.$db.get(this.$db.keys.account)
    if (!account) {
      return
    }

    const items = this.info.items
    if (!items) {
      return
    }
    const accountVal = account.toLowerCase()
    const c = items.length
    for (let i = 0; i < c; i++) {
      const item = items[i]
      if (item.account.toLowerCase() === accountVal) {
        this.$emit('authAdminChanged', true)
        return
      }
    }
  }

  isAddItemDisabled (item) {
    if (!item) {
      return false
    }

    const c = this.info.items.length
    for (let i = 0; i < c; i++) {
      if (item.dn === this.info.items[i].dn) {
        return true
      }
    }

    return false
  }

  showAddMember () {
    this.add.args.groupDn = this.data.dn
    this.add.args.memberDn = ''
    this.add.error.code = 0
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.submitting = false
    this.add.visible = true
  }

  onRemoveMember (code, err, data) {
    if (code === 0) {
      this.doGetInfo()
    } else if (code !== 101) {
      this.error(err)
    }
  }

  doRemoveMember (memberDn) {
    if (this.isNullOrEmpty(memberDn)) {
      return
    }

    const argument = {
      groupDn: this.data.dn,
      memberDn: memberDn
    }
    this.post(this.$uris.adGroupMemberRemove, argument, this.onRemoveMember)
  }

  onAddMember (code, err, data) {
    this.add.submitting = false
    this.add.error.code = code

    if (code === 0) {
      this.doGetInfo()
      this.add.visible = false
    } else if (code !== 101) {
      this.add.error.summary = err.summary
      this.add.error.detail = err.detail
    }
  }

  doAddMember () {
    if (this.isNullOrEmpty(this.add.args.groupDn) || this.isNullOrEmpty(this.add.args.memberDn)) {
      return
    }
    if (this.add.submitting) {
      return
    }

    this.add.submitting = true
    this.add.error.code = 0
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.post(this.$uris.adGroupMemberAdd, this.add.args, this.onAddMember)
  }

  onGetInfo (code, err, data) {
    this.info.loading = false

    if (code === 0) {
      this.info.items = data
      if (this.data.role === 99) {
        this.checkAuthAdmin()
      }
    } else if (code !== 101) {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetInfo () {
    if (!this.data) {
      return
    }
    const argument = {
      dn: this.data.dn
    }
    if (this.isNullOrEmpty(argument.dn)) {
      return
    }
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.adGroupUserList, argument, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default Group
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
  }
  .header .remark {
    margin-left: 5px;
    color: #8492a6;
  }
  .header .el-button {
    padding: 1px 3px;
  }
  .el-card /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .el-card /deep/ .el-table__empty-block {
    min-height: 0;
    width: 96%;
  }
  .el-card /deep/ .el-table__empty-text {
    width: 100%;
  }
</style>
