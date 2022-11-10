<template>
  <el-card :body-style="bodyStyle" shadow="never">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-place" ></i>
        <span>节点列表</span>
        <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <div>
            <div style="padding-top: 2px; padding-bottom: 3px;">
              <div class="item">
                <span class="label">节点名称:</span>
                <span class="text">{{props.row.name}}</span>
              </div>
              <div class="item">
                <span class="label">显示名称:</span>
                <span class="text">{{props.row.displayName}}</span>
              </div>
              <div class="item">
                <span class="label">注册时间:</span>
                <span class="text">{{props.row.regTime}}</span>
              </div>
              <div class="item">
                <span class="label">注册IP地址:</span>
                <span class="text">{{props.row.regIp}}</span>
              </div>
              <div class="item">
                <span class="label">所在地区:</span>
                <span class="text">{{props.row.addr.province}}{{props.row.addr.locality}}{{props.row.addr.address}}</span>
              </div>
              <div class="item" style="align-items: start;">
                <span class="label">备注信息:</span>
                <pre class="text" style="margin: 0; padding-top: 2px;">{{props.row.remark}}</pre>
              </div>
              <div class="item" v-if="props.row.instances.length > 0">
                <span class="label">在线实例:</span>
                <span class="text">{{props.row.instances.length}} 个</span>
              </div>
            </div>
            <div class="instance">
              <el-card :body-style="{padding: '5px 0px 6px 0px'}" v-for="(item, index) in props.row.instances" :key="index">
                <div slot="header" class="header">
                  <span>节点实例 #{{index + 1}}</span>
                </div>
                <div>
                  <div class="item">
                    <span class="label">实例标识:</span>
                    <span class="text">{{item.id}}</span>
                  </div>
                  <div class="item">
                    <span class="label">IP地址:</span>
                    <span class="text">{{item.ip}}</span>
                  </div>
                  <div class="item">
                    <span class="label">版本号:</span>
                    <span class="text">{{item.version}}</span>
                  </div>
                  <div class="item">
                    <span class="label">证书到期时间:</span>
                    <span class="text">{{item.crtNotAfter}}</span>
                  </div>
                  <div class="item">
                    <span class="label">上线时间:</span>
                    <span class="text">{{item.time}}</span>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="55"
        align="right" />
      <el-table-column
        label="名称"
        prop="displayName" />
      <el-table-column
        label="标识"
        prop="id" />
      <el-table-column
        label="类型"
        prop="kind"
        width="110px" />
      <el-table-column
        label="最近上线时间"
        prop="onlineTime"
        width="135px" />
      <el-table-column
        label="最近离线时间"
        prop="onlineTime"
        width="135px">
        <template slot-scope="scope">
          <template v-if="scope.row.instances.length < 1">
            <span>{{scope.row.offlineTime}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="60px">
        <template slot-scope="scope">
          <span v-if="scope.row.instances.length > 0" style="color: #67C23A;">在线</span>
          <span v-else style="color: #909399;">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="95px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showMod(scope.row)">
            <span>修改</span>
          </el-button>
          <el-popconfirm v-show="scope.row.instances.length < 1"
                         style="margin-left: 10px;"
                         :title="'确定删除节点 [' + scope.row.displayName + '] [' + scope.row.id  + '] 吗？'"
                         @confirm="doDelete(scope.row.id)">
            <el-button slot="reference" type="text" size="small">
              <span>删除</span>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-dialog :visible.sync="mod.visible"
                 :title="mod.title"
                 :append-to-body="true"
                 :close-on-click-modal="false"
                 width="500px">
        <el-form label-width="80px"
                 label-position="right"
                 size="mini">
          <el-form-item label="节点标识">
            <el-input v-model="mod.args.id" :readonly="true"/>
          </el-form-item>
          <el-form-item label="节点名称">
            <el-input v-model="mod.name" :readonly="true"/>
          </el-form-item>
          <el-form-item label="显示名称">
            <el-input v-model="mod.args.displayName" :clearable="true"/>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input v-model="mod.args.remark" :clearable="true" type="textarea"/>
          </el-form-item>
        </el-form>
        <el-alert type="error"
                  v-show="isNotNullOrEmpty(mod.error.summary) || isNotNullOrEmpty(mod.error.detail)"
                  :show-icon="true"
                  :closable="false"
                  :title="mod.error.summary"
                  :description="mod.error.detail" />
        <div slot="footer">
          <el-button @click="mod.visible = false">取 消</el-button>
          <el-button type="primary" :loading="mod.submitting" @click="doMod">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class All extends SocketBase {
  bodyStyle = {
    padding: '0px 0px 0px 0px'
  }

  minHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight - 60

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  mod = {
    title: '修改节点信息',
    visible: false,
    submitting: false,
    name: '',
    args: {
      id: '',
      displayName: '',
      remark: ''
    },
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

  showMod(row) {
    if (!row) {
      return
    }

    this.mod.args.id = row.id
    this.mod.args.displayName = row.displayName
    this.mod.args.remark = row.remark
    this.mod.name = row.name
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.mod.submitting = false
    this.mod.visible = true
  }

  onMod (code, err, data) {
    this.mod.submitting = false

    if (code === 0) {
      this.mod.visible = false
    } else if (code !== 101) {
      this.mod.error.summary = err.summary
      this.mod.error.detail = err.detail
    }
  }

  doMod () {
    if (this.mod.submitting) {
      return
    }

    const argument = this.mod.args

    this.mod.submitting = true
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.post(this.$uris.cloudNodeInfoMod, argument, this.onMod)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除节点成功', 'success')
    } else if (code !== 101) {
      this.error(err)
    }
  }

  doDelete(id) {
    const argument = {
      id: id
    }

    this.post(this.$uris.cloudNodeInfoDel, argument, this.onDelete)
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

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.cloudNodeListAll, null, this.onGetInfo)
  }

  onSocketMessage(id, data) {
    if (!data) {
      return
    }
    const items = this.info.items
    if (!items) {
      return
    }

    if (id === this.$evt.id.wsNodeRegister) {
      items.push(data)
    } else if (id === this.$evt.id.wsNodeRevoke) {
      const count = items.length
      for (let index = 0; index < count; index++) {
        const item = items[index]
        if (data.id === item.id) {
          items.splice(index, 1)
          break
        }
      }
    } else if (id === this.$evt.id.wsNodeModify) {
      const count = items.length
      for (let index = 0; index < count; index++) {
        const item = items[index]
        if (data.id === item.id) {
          item.displayName = data.displayName
          item.remark = data.remark
          break
        }
      }
    } else if (id === this.$evt.id.wsNodeInstanceOnline) {
      const count = items.length
      for (let index = 0; index < count; index++) {
        const item = items[index]
        if (item) {
          if (data.node === item.id) {
            if (!item.instances) {
              item.instances = []
            }
            if (item.instances.length < 1) {
              item.onlineTime = data.time
            }
            item.instances.push(data)
            break
          }
        }
      }
    } else if (id === this.$evt.id.wsNodeInstanceOffline) {
      const count = items.length
      for (let index = 0; index < count; index++) {
        const item = items[index]
        if (item) {
          if (data.node === item.id) {
            const instances = item.instances
            if (instances) {
              const c = instances.length
              for (let i = 0; i < c; i++) {
                const instance = instances[i]
                if (data.id === instance.id) {
                  instances.splice(i, 1)
                  break
                }
              }
            }
            if (instances.length < 1) {
              item.offlineTime = data.time
            }
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

export default All
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
    height: 23px;
  }
  .header div:first-child {
    flex: 1;
  }
  .header div:first-child i {
    width: 30px;
    text-align: center;
  }
  .header /deep/ .el-button {
    padding: 2px 5px;
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
    margin-top: 5px;
  }

  .label {
    width: 100px;
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
    background-color: #67C23A;
    padding: 1px 3px;
  }
  .instance .el-card /deep/ .el-card__body {
    background-color: #E1F3D8;
  }
  .instance .el-card .header {
    color: #FFFFFF;
    font-weight: bold;
  }
</style>
