<template>
  <el-dialog :visible.sync="visible"
             :title="title"
             :append-to-body="true"
             :close-on-click-modal="false"
             width="500px"
             @closed="handleInput(false)">
    <el-form label-width="80px"
             label-position="right"
             size="mini">
      <el-form-item label="转发名称">
        <el-input v-model="info.args.name" @input="onInput"/>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input v-model="info.args.remark" @input="onInput"/>
      </el-form-item>
      <el-form-item label="转发协议">
        <el-select v-model="info.args.protocol" style="width: 111px;">
          <el-option label="TCP" value="tcp"></el-option>
          <el-option label="UDP" value="udp"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监听地址">
        <el-input v-model="info.args.listenAddress" @input="onInput"/>
      </el-form-item>
      <el-form-item label="监听端口" :required="true">
        <el-input-number v-model="info.args.listenPort"
                         :controls="false"
                         :min="1"
                         :max="65535"
                         @input="onInput"/>
      </el-form-item>
      <el-form-item label="目标节点" :required="true">
        <el-select v-model="info.args.targetNodeId" style="width: 100%;">
          <el-option v-for="(item, index) in node.items"
                     :key="index"
                     :label="item.name"
                     :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 10px">{{ item.id }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标地址" :required="true">
        <el-input v-model="info.args.targetAddress"/>
      </el-form-item>
      <el-form-item label="目标端口" :required="true">
        <el-input-number v-model="info.args.targetPort"
                         :controls="false"
                         :min="1"
                         :max="65535"
                         @input="onInput"/>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-radio-group v-model="info.args.enable">
          <el-radio-button :label="true">启用</el-radio-button>
          <el-radio-button :label="false">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-alert type="error"
              v-show="isNotNullOrEmpty(info.error.summary) || isNotNullOrEmpty(info.error.detail)"
              :show-icon="true"
              :closable="false"
              :title="info.error.summary"
              :description="info.error.detail" />
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="info.submitting" @click="doSave">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: null
    },
    uri: {
      type: String,
      default: ''
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class Edit extends VueBase {
  visible = false

  info = {
    submitting: false,
    args: {
      id: '',
      name: '',
      remark: '',
      enable: true,
      protocol: '',
      listenAddress: '',
      listenPort: 0,
      targetNodeId: '',
      targetNodeName: '',
      targetAddress: '',
      targetPort: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  node = {
    items: []
  }

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.visible = val
    if (!val) {
      return
    }
    this.doGetNodes()
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.info.submitting = false

    if (this.item) {
      this.info.args.id = this.item.id
      this.info.args.name = this.item.name
      this.info.args.remark = this.item.remark
      this.info.args.enable = this.item.enable
      this.info.args.protocol = this.item.protocol
      this.info.args.listenAddress = this.item.listenAddress
      this.info.args.listenPort = this.item.listenPort
      this.info.args.targetNodeId = this.item.targetNodeId
      this.info.args.targetNodeName = this.item.targetNodeName
      this.info.args.targetAddress = this.item.targetAddress
      this.info.args.targetPort = this.item.targetPort
    } else {
      this.info.args.id = ''
      this.info.args.name = ''
      this.info.args.remark = ''
      this.info.args.enable = true
      this.info.args.protocol = 'tcp'
      this.info.args.listenAddress = ''
      this.info.args.listenPort = 1
      this.info.args.targetNodeId = ''
      this.info.args.targetNodeName = ''
      this.info.args.targetAddress = ''
      this.info.args.targetPort = 1
    }
  }

  getNodeItem(id) {
    const items = this.node.items
    if (!items) {
      return null
    }

    const c = items.length
    for (let i = 0; i < c; i++) {
      const item = items[i]
      if (!item) {
        continue
      }

      if (item.id === id) {
        return item
      }
    }

    return null
  }

  onInput() {
    this.info.error.summary = ''
    this.info.error.detail = ''
  }

  onGetNodes (code, err, data) {
    if (code === 0) {
      this.node.items = data
    } else {
    }
  }

  doGetNodes () {
    this.post(this.$uris.nodeOnlineTargetList, null, this.onGetNodes)
  }

  onSave (code, err, data) {
    this.info.submitting = false

    if (code === 0) {
      this.$emit('success')
      this.visible = false
    } else if (code !== 101) {
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doSave () {
    if (this.info.submitting) {
      return
    }

    const uri = this.uri
    if (this.isNullOrEmpty(uri)) {
      return;
    }

    if(this.isNullOrEmpty(this.info.args.targetNodeId)) {
      this.info.error.summary = '目标节点不能为空'
      return
    }
    if(this.isNullOrEmpty(this.info.args.targetAddress)) {
      this.info.error.summary = '目标地址不能为空'
      return
    }

    const argument = this.info.args
    const node = this.getNodeItem(argument.targetNodeId)
    if (node) {
      argument.targetNodeName = node.name
    }

    this.info.submitting = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(uri, argument, this.onSave)
  }

}

export default Edit
</script>

<style scoped>
  .el-input-number {
    width: 111px;
  }
  .el-input-number /deep/ .el-input__inner {
    text-align: left;
  }

  .el-form-item--mini.el-form-item {
    margin-bottom: 5px;
  }
</style>
