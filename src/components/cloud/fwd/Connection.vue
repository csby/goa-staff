<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-sort" ></i>
        <span>连接列表</span>
        <div style="width: 105px;">
          <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
        </div>
      </div>
      <div class="filter">
        <el-input v-model="info.args.sourceName" placeholder="发起节点名称" size="mini" :clearable="true" @input="doGetInfo"/>
        <el-input v-model="info.args.sourceIp" placeholder="发起节点IP" size="mini" :clearable="true" @input="doGetInfo"/>
        <el-input v-model="info.args.targetName" placeholder="目标节点名称" size="mini" :clearable="true" @input="doGetInfo"/>
        <el-input v-model="info.args.targetIp" placeholder="目标节点IP" size="mini" :clearable="true" @input="doGetInfo"/>
        <el-input v-model="info.args.targetHost" placeholder="目标主机" size="mini" :clearable="true" @input="doGetInfo"/>
      </div>
      <div >
        <el-tooltip placement="left">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetInfo"/>
        </el-tooltip>
      </div>
    </div>
    <el-table v-loading="info.loading"
              aelement-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              size="small"
              :max-height="minHeight"
              :data="info.items"
              :border="true"
              :stripe="true">
      <el-table-column
        label="序号"
        type="index"
        width="75"
        align="right" />
      <el-table-column
        label="开始时间"
        prop="time"
        width="135px" />
      <el-table-column
        label="发起节点">
        <template slot-scope="scope">
          <span>{{scope.row.sourceNode.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="目标节点">
        <template slot-scope="scope">
          <span>{{scope.row.targetNode.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="目标主机"
        prop="targetHost"
        width="205px" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <div class="instance">
              <el-card :body-style="{padding: '5px 0px 6px 0px'}">
                <div slot="header" class="header">
                  <span>发起节点信息</span>
                </div>
                <div>
                  <div class="item">
                    <span class="label">名称:</span>
                    <span class="text">{{props.row.sourceNode.name}}</span>
                  </div>
                  <div class="item">
                    <span class="label">标识:</span>
                    <span class="text">{{props.row.sourceNode.id.certificate}}</span>
                  </div>
                  <div class="item">
                    <span class="label">实例:</span>
                    <span class="text">{{props.row.sourceNode.id.instance}}</span>
                  </div>
                  <div class="item">
                    <span class="label">类型:</span>
                    <span class="text">{{props.row.sourceNode.kind}}</span>
                  </div>
                  <div class="item">
                    <span class="label">版本:</span>
                    <span class="text">{{props.row.sourceNode.version}}</span>
                  </div>
                  <div class="item">
                    <span class="label">IP:</span>
                    <span class="text">{{props.row.sourceNode.ip}}</span>
                  </div>
                </div>
              </el-card>
              <div style="font-size: xxx-large; padding-left: 5px;">
                <i class="el-icon-right" />
              </div>
              <el-card :body-style="{padding: '5px 0px 6px 0px'}">
                <div slot="header" class="header">
                  <span>目标节点信息</span>
                </div>
                <div>
                  <div class="item">
                    <span class="label">名称:</span>
                    <span class="text">{{props.row.targetNode.name}}</span>
                  </div>
                  <div class="item">
                    <span class="label">标识:</span>
                    <span class="text">{{props.row.targetNode.id.certificate}}</span>
                  </div>
                  <div class="item">
                    <span class="label">实例:</span>
                    <span class="text">{{props.row.targetNode.id.instance}}</span>
                  </div>
                  <div class="item">
                    <span class="label">类型:</span>
                    <span class="text">{{props.row.targetNode.kind}}</span>
                  </div>
                  <div class="item">
                    <span class="label">版本:</span>
                    <span class="text">{{props.row.targetNode.version}}</span>
                  </div>
                  <div class="item">
                    <span class="label">IP:</span>
                    <span class="text">{{props.row.targetNode.ip}}</span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class Connection extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  minHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 60

  info = {
    loading: false,
    args: {
      sourceName: "",
      sourceIp: "",
      targetName: "",
      targetIp: "",
      targetHost: ""
    },
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

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    this.minHeight = clientHeight - 60
  }

  isMatch(item) {
    if (!item) {
      return false
    }

    const args = this.info.args
    if (args.sourceName.length > 0) {
      if (item.sourceNode.name.indexOf(args.sourceName) === - 1) {
        return false
      }
    }
    if (args.sourceIp.length > 0) {
      if (item.sourceNode.ip.indexOf(args.sourceIp) === - 1) {
        return false
      }
    }
    if (args.targetName.length > 0) {
      if (item.targetNode.name.indexOf(args.targetName) === - 1) {
        return false
      }
    }
    if (args.targetIp.length > 0) {
      if (item.targetNode.ip.indexOf(args.targetIp) === - 1) {
        return false
      }
    }
    if (args.targetHost.length > 0) {
      if (item.targetHost.indexOf(args.targetHost) === - 1) {
        return false
      }
    }

    return true
  }

  onGetInfo (code, err, data) {
    this.info.loading = false
    let items = []
    if (code === 0) {
      items = data
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

    const argument = this.info.args

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.cloudNodeFwdConnList, argument, this.onGetInfo)
  }

  onSocketMessage(id, data) {
    if (!data) {
      return
    }

    const items = this.info.items
    if (!items) {
      return
    }

    if (id === this.$evt.id.wsNodeForwardTcpStart) {
      if (this.isMatch(data)) {
        items.unshift(data)
      }
    } else if (id === this.$evt.id.wsNodeForwardTcpEnd) {
      const count = items.length
      for (let index = 0; index < count; index++) {
        const item = items[index]
        if (item) {
          if (item.id === data.id) {
            items.splice(index, 1)
            break
          }
        }
      }
    }
  }

  mounted() {
    this.doGetInfo()

    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Connection
</script>

<style scoped>
  .el-card /deep/ .el-card__header {
    background-color: #f8f8f8;
    padding: 1px 3px;
  }
  .header {
    display: flex;
    align-items: center;
    height: 23px;
  }
  .header div {
    display: flex;
    align-items: center;
  }
  .header div:first-child i {
    width: 30px;
    text-align: center;
  }
  .header /deep/ .el-button {
    padding: 2px 5px;
  }

  .filter {
    flex: 1;
    padding-right: 18px;
  }
  .filter .el-input {
    margin-left: 10px;
  }
  .filter /deep/ .el-input__inner {
    padding: 0 5px;
    height: 23px;
    line-height: 23px;
  }

  .el-card /deep/ .el-table__header-wrapper tr th {
    background-color: #f8f8f8;
    padding: 2px 0px 1px 0px;
  }
  .el-card /deep/ .el-table--small td {
    padding: 1px 0px 0px 0px;
    margin: 0;
  }

  .el-table /deep/ .el-button {
    padding: 0;
  }
  .el-table /deep/ .el-popconfirm {
    padding: 0;
  }

  .item {
    display: flex;
    align-items: center;
    font-size: 12px;
    padding-left: 3px;
  }
  .item:not(:first-child) {
    margin-top: 3px;
  }

  .label {
    width: 50px;
    text-align: right;
    margin-right: 5px;
  }
  .text {
    font-weight: bold;
  }

  .instance {
    display: flex;
    align-items: center;
    padding: 5px 10px 5px 90px ;
  }
  .instance .el-card {
    width: 300px;
    margin-left: 11px;
  }
  .instance .el-card /deep/ .el-card__header {
    background-color: #66B1FF;
    padding: 1px 3px;
  }
  .instance .el-card /deep/ .el-card__body {
    background-color: #C6E2FF;
  }
  .instance .el-card .header {
    color: #FFFFFF;
    font-weight: bold;
  }
</style>
