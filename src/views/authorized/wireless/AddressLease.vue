<template>
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
      <el-table-column label="IP地址" prop="ipV4" width="150px" :sortable="true" />
      <el-table-column label="MAC地址" width="150px" >
        <template slot-scope="scope" class="scope">
          <span style="font-family: monospace;">{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comment">
        <div slot="header" class="header">
          <div style="flex: 1;">描述信息</div>
          <div>
            <el-button type="text" size="mini" icon="el-icon-refresh" @click="doGetList">刷新</el-button>
          </div>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'

@Component
class AddressLease extends RouterPage {
  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
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
    this.post(this.$uris.dhcpLeaseList, null, this.onGetList)
  }

  mounted () {
    this.doGetList()
  }
}

export default AddressLease
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

  .header {
    display: flex;
    align-items: center;
  }
  .header div .el-button {
    padding: 1px 3px;
  }
</style>
