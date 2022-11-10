<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-share" ></i>
        <span>端口转发</span>
      </div>
      <div>
        <el-tooltip placement="left">
          <div slot="content">
            <span>监听端口</span>
          </div>
          <el-button type="text" icon="el-icon-s-opportunity" @click="port.visible = true"/>
        </el-tooltip>
      </div>
      <div >
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-refresh" @click="doRefresh"/>
        </el-tooltip>
      </div>
    </div>
    <div>
      <div class="item">
        <span>启用状态:</span>
        <div>
          <template v-if="info.enable">
            <span>已启用</span>
            <el-button size="small" type="primary" :plain="true" :loading="act.enable.submitting" @click="doSetEnableState(false)">禁 用</el-button>
          </template>
          <template v-else>
            <span style="color: #909399;">已禁用</span>
            <el-button size="small" type="primary" :plain="true" :loading="act.enable.submitting" @click="doSetEnableState(true)">启 用</el-button>
          </template>
        </div>
      </div>
      <div class="item">
        <span>运行状态:</span>
        <div>
          <template v-if="info.running">
            <span style="color: #67C23A;">运行中</span>
            <el-button size="small" type="primary" :plain="true" :loading="act.running.submitting" @click="doStop">停 止</el-button>
          </template>
          <template v-else>
            <span style="color: #909399;">已停止</span>
            <el-button size="small" type="primary" :plain="true" :loading="act.running.submitting" @click="doStart">启 动</el-button>
          </template>
        </div>
      </div>
      <div class="item">
        <span>条目列表:</span>
        <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      </div>
      <el-table v-loading="info.loading"
                aelement-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :data="info.items"
                :border="true"
                :stripe="true">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="padding-left: 50px;">
              <div v-show="isNotNullOrEmpty(props.row.remark)">
                <pre style="color: #909399;">{{props.row.remark}}</pre>
              </div>
              <div v-show="isNotNullOrEmpty(props.row.error)">
                <span style="color: #F56C6C;">{{props.row.error}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50"
          align="right" />
        <el-table-column
          label="名称"
          prop="name"  />
        <el-table-column
          label="协议"
          prop="protocol"
          width="65px"  />
        <el-table-column
          label="监听地址"
          prop="listenAddress"
          width="95px"
          align="right" />
        <el-table-column
          label="监听端口"
          prop="listenPort"
          width="80px" />
        <el-table-column
          label="目标节点"
          prop="targetNodeName"
          width="205px"
          align="right"/>
        <el-table-column
          label="目标地址"
          prop="targetAddress"
          width="155px"
          align="right" />
        <el-table-column
          label="目标端口"
          prop="targetPort"
          width="75px" />
        <el-table-column
          label="启用状态"
          width="75px" >
          <template slot-scope="scope">
              <span v-if="scope.row.enable">已启用</span>
              <span v-else style="color: #909399;">已禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运行状态"
          width="75px" >
          <template slot-scope="scope">
            <span v-if="scope.row.running" style="color: #67C23A;">运行中</span>
            <span v-else style="color: #909399;">已停止</span>
          </template>
        </el-table-column>
        <el-table-column width="105px">
          <template slot="header" slot-scope="scope">
            <el-button type="text" size="small" @click="add.visible = true">
              <span>添加新端口</span>
            </el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showMod(scope.row)">
              <span>修改</span>
            </el-button>
            <el-popconfirm style="margin-left: 10px;"
                           :title="'确定删除 [' + scope.row.listenAddress + ':' + scope.row.listenPort  + '] => [' + scope.row.targetNodeName + '] => [' + scope.row.targetAddress + ':' + scope.row.targetPort + '] 吗？'"
                           @confirm="doDelete(scope.row.id)">
              <el-button slot="reference" type="text" size="small">
                <span>删除</span>
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <fwd-edit v-model="add.visible"
                :title="add.title"
                :uri="add.uri"
                @success="doGetInfo" />

      <fwd-edit v-model="mod.visible"
                :title="mod.title"
                :uri="mod.uri"
                :item="mod.info"
                @success="doGetInfo" />

      <port-viewer v-model="port.visible" />
    </div>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import FwdEdit from '@/components/node/fwd/Edit'
import PortViewer from '@/components/monitor/network/ListeningDrawer'

@Component({
  components: {
    fwdEdit: FwdEdit,
    portViewer: PortViewer
  }
})
class Info extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  info = {
    loading: false,
    enable: false,
    running: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  act = {
    enable: {
      submitting: false,
      error: {
        summary: '',
        detail: ''
      }
    },
    running: {
      submitting: false,
      error: {
        summary: '',
        detail: ''
      }
    }
  }

  add = {
    visible: false,
    title: '添加新端口',
    uri: this.$uris.nodeFwdItemAdd
  }

  mod = {
    visible: false,
    title: '编辑端口',
    uri: this.$uris.nodeFwdItemMod,
    info: null
  }

  port = {
    visible: false
  }

  get itemCount() {
    if (this.info.items) {
      return this.info.items.length
    }

    return 0
  }

  showMod(row) {
    this.mod.info = row
    this.mod.visible = true
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.doGetInfo()
      this.message('删除成功', 'success')
    } else if (code !== 101) {
      this.error(err)
    }
  }

  doDelete (id) {
    const argument = {
      id: id
    }

    this.post(this.$uris.nodeFwdItemDel, argument, this.onDelete)
  }

  onGetEnableState (code, err, data) {

    if (code === 0) {
      this.info.enable = data
    } else {
    }
  }

  doGetEnableState () {
    this.post(this.$uris.nodeFwdEnableGet, null, this.onGetEnableState)
  }

  onSetEnableState (code, err, data) {
    this.act.enable.submitting = false

    if (code === 0) {
      this.doGetEnableState()
    } else if (code !== 101) {
      this.act.enable.error.summary = err.summary
      this.act.enable.error.detail = err.detail
      this.error(err)
    }
  }

  doSetEnableState (enable) {
    if (this.act.enable.submitting) {
      return
    }

    const argument = {
      enable: enable
    }

    this.act.enable.submitting = true
    this.act.enable.error.summary = ''
    this.act.enable.error.detail = ''
    this.post(this.$uris.nodeFwdEnableSet, argument, this.onSetEnableState)
  }

  onGetRunningState (code, err, data) {
    if (code === 0) {
      this.info.running = data.running
    } else {
    }
  }

  doGetRunningState () {
    this.post(this.$uris.nodeFwdInputListenState, null, this.onGetRunningState)
  }

  onStart (code, err, data) {
    this.act.running.submitting = false

    if (code === 0) {
      this.doGetRunningState()
    } else if (code !== 101) {
      this.act.running.error.summary = err.summary
      this.act.running.error.detail = err.detail
      this.error(err)
    }
  }

  doStart () {
    if (this.act.running.submitting) {
      return
    }

    this.act.running.submitting = true
    this.act.running.error.summary = ''
    this.act.running.error.detail = ''
    this.post(this.$uris.nodeFwdInputSvcListenStart, null, this.onStart)
  }

  onStop (code, err, data) {
    this.act.running.submitting = false

    if (code === 0) {
      this.doGetRunningState()
    } else if (code !== 101) {
      this.act.running.error.summary = err.summary
      this.act.running.error.detail = err.detail
      this.error(err)
    }
  }

  doStop () {
    if (this.act.running.submitting) {
      return
    }

    this.act.running.submitting = true
    this.act.running.error.summary = ''
    this.act.running.error.detail = ''
    this.post(this.$uris.nodeFwdInputSvcListenStop, null, this.onStop)
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
    this.post(this.$uris.nodeFwdItemList, null, this.onGetInfo)
  }

  doRefresh() {
    this.doGetEnableState()
    this.doGetRunningState()
    this.doGetInfo()
  }

  onSocketMessage(id, data) {
    if (id === this.$evt.id.wsNodeFwdInputListenSvcState) {
      this.info.running = data.running
    } else if (id === this.$evt.id.wsNodeFwdInputListenItemState) {
      const items = this.info.items
      const c = items.length
      for (let i = 0; i < c; i++) {
        const item = items[i]
        if (item.id === data.id) {
          item.running = data.running
          item.error = data.error
          break
        }
      }
    }
  }

  mounted() {
    this.doGetEnableState()
    this.doGetRunningState()
    this.doGetInfo()
  }
}

export default Info
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
  .el-table /deep/ .el-button {
    padding: 0;
  }
  .el-table /deep/ .el-popconfirm {
    padding: 0;
  }

  .item {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-size: 13px;
  }
  .item span:first-child {
    padding-left: 14px;
  }
  .item div span:first-child {
    font-weight: bold;
    padding-left: 3px;
    margin-right: 10px;
  }
  .item div .el-button {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
