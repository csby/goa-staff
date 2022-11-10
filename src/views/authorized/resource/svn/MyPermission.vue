<template>
  <el-table :data="info.items"
            :border="true"
            :height="elementHeight"
            size="small"
            v-loading="info.loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading">
    <el-table-column label="存储库" prop="repository" width="180px" />
    <el-table-column label="路径" prop="path"/>
    <el-table-column width="100px">
      <template #header>
        <div style="display: flex; align-items: center">
          <span>权限</span>
          <div style="flex: 1;" />
          <el-button type="text" icon="el-icon-refresh" style="padding: 0px 7px 0px 0px;" @click="doGetInfo" />
        </div>
      </template>
      <template slot-scope="scope">
        <span v-if="scope.row.accessLevel === 0">拒绝</span>
        <span v-else-if="scope.row.accessLevel === 1">只读</span>
        <span v-else-if="scope.row.accessLevel === 2">读写</span>
        <span v-else></span>
      </template>
    </el-table-column>
    <template #empty>
      <el-alert v-if="isNotNullOrEmpty(info.error.summary)" type="error"
                :title="info.error.summary"
                :description="info.error.detail"
                :closable="false" />
      <span v-else>暂无数据</span>
    </template>
  </el-table>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class MyPermission extends VueBase {
  info = {
    loading: false,
    items: [
      // {
      //  repository: '',
      //  path: '',
      //  accessLevel: 0
      // }
    ],
    error: {
      summary: '',
      detail: ''
    }
  }

  onGetInfo (code, err, data) {
    this.info.loading = false

    if (code === 0) {
      this.info.items = data
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
    this.post(this.$uris.svnPermissionUserList, null, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default MyPermission
</script>

<style scoped>

</style>
