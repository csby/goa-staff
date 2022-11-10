<template>
  <div>
    <div class="table">
      <el-table :data="info.items"
                v-loading="info.loading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :border="true"
                :stripe="true"
                :height="elementHeight">
        <el-table-column type="index" align="right" width="60px">
          <template #header>
            <el-badge type="info" :value="info.items.length" />
          </template>
        </el-table-column>
        <el-table-column label="MAC地址" width="150px">
          <template slot-scope="scope" class="scope">
            <span style="font-family: monospace;">{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="userRole === 1" label="所有者" prop="owner" width="160px" :sortable="true"
                         :filters="[{text: '仅看我的设备', value: true}]"
                         :filter-method="filterOwner" />
        <el-table-column v-else label="所有者" prop="owner" width="160px" :sortable="true"
                         :filters="[{text: '仅看我的设备', value: true}]"
                         :filtered-value="[true]"
                         :filter-method="filterOwner" />
        <el-table-column label="设备类型" prop="type" width="130px" :sortable="true" />
        <el-table-column label="备注信息" prop="remark" :sortable="true" />
        <el-table-column width="120px" align="right">
          <template slot="header">
            <el-button type="text" size="mini" icon="el-icon-circle-plus-outline" @click="showAdd">添加</el-button>
            <el-button type="text" size="mini" icon="el-icon-refresh" @click="doGetList">刷新</el-button>
          </template>
          <template slot-scope="scope">
            <el-popconfirm v-show="userRole === 1 || user.name === scope.row.owner"
                           :title="'确定要删除[' + scope.row.address + ']吗?'"
                           @confirm="doDelete(scope.row)">
              <el-button slot="reference"
                         type="text"
                         size="mini"
                         icon="el-icon-remove-outline"
                         :disabled="false">
                <span>删除</span>
              </el-button>
            </el-popconfirm>
            <el-button v-show="userRole === 1 || user.name === scope.row.owner"
                       type="text"
                       size="mini"
                       icon="el-icon-edit-outline"
                       style="margin-left: 10px;"
                       @click="showMod(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <drawer v-model="add.visible"
            :modal="true"
            size="480px"
            icon="el-icon-circle-plus-outline"
            title="添加地址过滤" >
      <div style="padding: 5px 15px;">
        <el-form size="small">
          <el-form-item label="MAC地址 (格式: XX-XX-XX-XX-XX-XX)" :required="true">
            <el-input v-model="add.args.address" :clearable="true" @input="onAddInput"/>
          </el-form-item>
          <el-form-item label="所有者">
            <userAccount v-model="add.args.owner" :name="user.name" :read-only="userRole !== 1" style="width: 100%;" @input="onAddInput"/>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="add.args.type"
                       placeholder="请选择或输入"
                       style="width: 100%;"
                       :filterable="true"
                       :allow-create="true"
                       :clearable="true"
                       @input="onAddInput">
              <el-option value="手机" />
              <el-option value="平板" />
              <el-option value="笔记本" />
              <el-option value="台式机" />
              <el-option value="手持设备" />
              <el-option value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input  v-model="add.args.remark" :clearable="true" @input="onAddInput"/>
          </el-form-item>
        </el-form>
        <el-alert v-show="isNotNullOrEmpty(add.error.summary)"
                  type="error"
                  :closable="false"
                  :title="add.error.summary"
                  :description="add.error.detail" />
        <div style="text-align: right; margin-top: 10px;">
          <el-button type="primary" :plain="true" @click="add.visible = false">取 消</el-button>
          <el-button type="primary" :loading="add.submitting" @click="doAdd" >确 定</el-button>
        </div>
      </div>
    </drawer>

    <drawer v-model="mod.visible"
            :modal="true"
            size="480px"
            icon="el-icon-edit-outline"
            title="修改地址过滤" >
      <div style="padding: 5px 15px;">
        <el-form size="small">
          <el-form-item label="MAC地址 (格式: XX-XX-XX-XX-XX-XX)" :required="true">
            <el-input v-model="mod.args.filter.address" :clearable="true" @input="onAddInput"/>
          </el-form-item>
          <el-form-item label="所有者">
            <userAccount v-model="mod.args.filter.owner" :name="mod.owner" style="width: 100%;" @input="onAddInput"/>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="mod.args.filter.type"
                       placeholder="请选择或输入"
                       style="width: 100%;"
                       :filterable="true"
                       :allow-create="true"
                       :clearable="true"
                       @input="onAddInput">
              <el-option value="手机" />
              <el-option value="平板" />
              <el-option value="笔记本" />
              <el-option value="台式机" />
              <el-option value="手持设备" />
              <el-option value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input  v-model="mod.args.filter.remark" :clearable="true" @input="onAddInput"/>
          </el-form-item>
        </el-form>
        <el-alert v-show="isNotNullOrEmpty(mod.error.summary)"
                  type="error"
                  :closable="false"
                  :title="mod.error.summary"
                  :description="mod.error.detail" />
        <div style="text-align: right; margin-top: 10px;">
          <el-button type="primary" :plain="true" @click="mod.visible = false">取 消</el-button>
          <el-button type="primary" :loading="mod.submitting" @click="doMod" >确 定</el-button>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import Drawer from '@/components/Drawer'
import UserAccount from '@/components/ad/user/Account'

@Component({
  components: {
    drawer: Drawer,
    userAccount: UserAccount
  }
})
class AddressFilter extends RouterPage {
  user = {
    name: ''
  }

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
      address: '',
      owner: '',
      type: '',
      remark: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  mod = {
    visible: false,
    submitting: false,
    owner: '',
    args: {
      address: '',
      filter: {
        address: '',
        owner: '',
        type: '',
        remark: ''
      }
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  filterOwner (value, row, column) {
    if (value === true) {
      const property = column.property
      return row[property] === this.user.name
    } else {
      return true
    }
  }

  showAdd () {
    this.add.args.address = ''
    this.add.args.owner = ''
    this.add.args.type = ''
    this.add.args.remark = ''
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.visible = true
  }

  onAddInput () {
    this.add.error.summary = ''
    this.add.error.detail = ''
  }

  showMod (item) {
    if (!item) {
      return
    }
    this.mod.args.address = item.address
    this.mod.args.filter.address = item.address
    this.mod.args.filter.owner = ''
    this.mod.args.filter.type = item.type
    this.mod.args.filter.remark = item.remark
    this.mod.owner = item.owner
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.mod.visible = true
  }

  onAdd (code, err, data) {
    this.add.submitting = false

    if (code === 0) {
      this.add.visible = false
      this.doGetList()
      this.message('添加地址过滤成功', 'success')
    } else if (code !== 101) {
      this.add.error.summary = err.summary
      this.add.error.detail = err.detail
    }
  }

  doAdd () {
    if (this.add.submitting) {
      return
    }

    this.add.submitting = true
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.post(this.$uris.dhcpFilterAdd, this.add.args, this.onAdd)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.doGetList()
      this.message('删除地址过滤成功', 'success')
    } else if (code !== 101) {
      this.error(err)
    }
  }

  doDelete (item) {
    if (!item) {
      return
    }
    if (this.isNullOrEmpty(item.address)) {
      return
    }

    const argument = {
      address: item.address
    }

    this.post(this.$uris.dhcpFilterDel, argument, this.onDelete)
  }

  onMod (code, err, data) {
    this.mod.submitting = false

    if (code === 0) {
      this.mod.visible = false
      this.doGetList()
      this.message('修改地址过滤成功', 'success')
    } else if (code !== 101) {
      this.mod.error.summary = err.summary
      this.mod.error.detail = err.detail
    }
  }

  doMod () {
    if (this.mod.submitting) {
      return
    }

    this.mod.submitting = true
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.post(this.$uris.dhcpFilterMod, this.mod.args, this.onMod)
  }

  onGetList (code, err, data) {
    this.info.loading = false

    if (code === 0) {
      this.info.items = data
    } else if (code !== 101) {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetList () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.dhcpFilterList, null, this.onGetList)
  }

  mounted () {
    this.user.name = this.$db.get(this.$db.keys.name)
    this.doGetList()
  }
}

export default AddressFilter
</script>

<style scoped>
  .table {
  }
  .table /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
  }
  .table /deep/ .el-table--small tr th {
    padding: 0;
  }
</style>
