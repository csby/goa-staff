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
        <el-table-column label="帐号" prop="account" :sortable="true" />
        <el-table-column label="姓名" prop="name" :sortable="true" />
        <el-table-column width="120px">
          <template slot="header">
            <el-button type="text" size="mini" icon="el-icon-circle-plus-outline" @click="showAdd">添加</el-button>
            <el-button type="text" size="mini" icon="el-icon-refresh" @click="doGetList">刷新</el-button>
          </template>
          <template slot-scope="scope">
            <el-popconfirm v-show="userRole === 1"
                           :title="'确定要禁用[' + scope.row.account + ']吗?'"
                           @confirm="doDisable(scope.row)">
              <el-button slot="reference"
                         type="text"
                         size="mini"
                         icon="el-icon-remove-outline"
                         :disabled="false">
                <span>禁用</span>
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class EnableList extends VueBase {
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  showAdd () {

  }

  doDisable (row) {

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
    this.post(this.$uris.adUserVpnEnableList, null, this.onGetList)
  }

  mounted () {
    this.doGetList()
  }
}

export default EnableList
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
