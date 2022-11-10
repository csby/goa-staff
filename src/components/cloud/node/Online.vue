<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-place" ></i>
        <span>在线节点</span>
        <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      </div>
      <div >
        <el-tooltip placement="left">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-refresh" @click="doGetInfo"/>
        </el-tooltip>
      </div>
    </div>
    <el-table v-loading="info.loading"
              aelement-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              size="small"
              :data="info.items"
              :border="true"
              :stripe="true">
      <el-table-column
        label="序号"
        type="index"
        width="55"
        align="right" />
      <el-table-column
        label="名称"
        prop="name" />
      <el-table-column
        label="标识"
        prop="certificate" />
      <el-table-column
        label="实例"
        prop="instance"
        width="200px" />
      <el-table-column
        label="类型"
        prop="kind"
        width="110px" />
      <el-table-column
        label="版本号"
        prop="version"
        width="100px" />
      <el-table-column
        label="IP"
        prop="ip"
        width="115px" />
      <el-table-column
        label="上线时间"
        prop="loginTime"
        width="135px" />
    </el-table>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class Online extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  get itemCount() {
    if (this.info.items) {
      return this.info.items.length
    }

    return 0
  }

  onGetInfo (code, err, data) {
    this.info.loading = false
    const items = []
    if (code === 0) {
      const c = data.length
      for (let i = 0; i < c; i++) {
        const d = data[i]
        const item = {
          online: true,
          instance: d.id.instance,
          certificate: d.id.certificate,
          kind: d.kind,
          name: d.name,
          ip: d.ip,
          version: d.version,
          loginTime: d.loginTime
        }
        items.push(item)
      }
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }

    this.info.items = items
  }

  doGetInfo () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.cloudNodeListOnline, null, this.onGetInfo)
  }

  mounted() {
    this.doGetInfo()
  }
}

export default Online
</script>

<style scoped>
  .el-card /deep/ .el-card__header {
    background-color: #f8f8f8;
    padding: 1px 3px;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .header div {
    display: flex;
    align-items: center;
  }

  .header div:first-child {
    flex: 1;
  }
  .header div:first-child i {
    width: 30px;
    text-align: center;
  }

  .el-card /deep/ .el-table__header-wrapper tr th {
    background-color: #f8f8f8;
    padding: 2px 0px 1px 0px;
  }
  .el-card /deep/ .el-table--small td {
    padding: 1px 0px 0px 0px;
    margin: 0;
  }
</style>
