<template>
  <div>
    <div class="filter">
      <el-input v-model="catalogFilter"
                 placeholder="输入关键字进行过滤"
                 size="small"
                 :clearable="true">
        <template slot="prepend">
          <span>{{name}}</span>
          <el-badge type="info" :value="info.items.length" />
        </template>
        <template slot="append">
          <el-button icon="el-icon-refresh" @click="doRefresh" />
          <el-tooltip v-show="userRole === 1 && isNotNullOrEmpty(addUri)" placement="top-end" :content="'添加' + name">
            <el-button icon="el-icon-circle-plus-outline" @click="showAdd" />
          </el-tooltip>
        </template>
      </el-input>
    </div>
    <div class="tree" :style="treeStyle">
      <el-tree ref="catalogTree"
               empty-text=""
               :data="info.items"
               :props="params"
               :highlight-current="true"
               :render-content="renderContent"
               :filter-node-method="filterCatalogNode"
               @node-click="onCatalogNodeClick">
      </el-tree>
    </div>

    <drawer v-model="add.visible"
            :modal="true"
            direction="ltr"
            size="520px"
            icon="el-icon-circle-plus-outline"
            :title="'添加' + name" >
      <div style="padding: 5px 15px;">
        <el-form size="small" label-position="right" :label-width="addLabelWidth" label-suffix=":">
          <el-form-item :label="name + '名称'" :required="true">
            <el-input v-model="add.args.name" :placeholder="addNamePlaceholder" :clearable="true" @input="onAddInput"/>
          </el-form-item>
          <el-form-item v-show="isNotNullOrEmpty(addGroupSuffixLabel)" :label="addGroupSuffixLabel">
            <el-input v-model="add.args.groupSuffix" :placeholder="addGroupSuffixPlaceholder" :clearable="true" @input="onAddInput"/>
          </el-form-item>
          <el-form-item v-show="isNotNullOrEmpty(addDescriptionLabel)" :label="addDescriptionLabel">
            <el-input v-model="add.args.description" :placeholder="addDescriptionPlaceholder" :clearable="true" @input="onAddInput"/>
          </el-form-item>
          <el-form-item v-show="isNotNullOrEmpty(addStreetLabel)" :label="addStreetLabel">
            <el-input v-model="add.args.street" :placeholder="addStreetPlaceholder" :clearable="true" type="textarea" @input="onAddInput"/>
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
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Drawer from '@/components/Drawer'

@Component({
  components: {
    drawer: Drawer
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    uri: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: function () {
        return {
          label: 'name'
        }
      }
    },
    icon: {
      type: String,
      default: '-'
    },
    filter: {
      type: Function,
      default: function (value, data) {
        return true
      }
    },
    addUri: {
      type: String,
      default: ''
    },
    addLabelWidth: {
      type: String,
      default: '100px'
    },
    addDescriptionLabel: {
      type: String,
      default: ''
    },
    addStreetLabel: {
      type: String,
      default: ''
    },
    addGroupSuffixLabel: {
      type: String,
      default: ''
    },
    addNamePlaceholder: {
      type: String,
      default: ''
    },
    addDescriptionPlaceholder: {
      type: String,
      default: ''
    },
    addStreetPlaceholder: {
      type: String,
      default: ''
    },
    addGroupSuffixPlaceholder: {
      type: String,
      default: ''
    }
  },
  watch: {
    catalogFilter: {
      handler: 'onCatalogFilterChanged'
    }
  }
})
class Catalog extends VueBase {
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
      name: '',
      description: '',
      street: '',
      groupSuffix: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  catalogFilter = ''

  get treeStyle () {
    const minHeight = this.elementHeight - 32 + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onCatalogFilterChanged (v) {
    this.$refs.catalogTree.filter(v)
  }

  filterCatalogNode (value, data) {
    if (this.filter) {
      return this.filter(value, data)
    }

    return true
  }

  renderContent (h, { node, data, store }) {
    return (
      <div >
        <i class={this.icon}></i>
        <span style="margin-left:5px;">{node.label}</span>
      </div>
    )
  }

  onCatalogNodeClick (data) {
    this.$emit('itemSelected', data)
  }

  showAdd () {
    this.add.args.name = ''
    this.add.args.description = ''
    this.add.args.street = ''
    this.add.args.groupSuffix = ''
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.submitting = false
    this.add.visible = true
  }

  onAddInput () {
    this.add.error.summary = ''
    this.add.error.detail = ''
  }

  onAdd (code, err, data) {
    this.add.submitting = false
    if (code === 0) {
      this.doRefresh()
      this.add.visible = false
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
    this.post(this.addUri, this.add.args, this.onAdd)
  }

  doRefresh () {
    this.doGetInfo()
    this.catalogFilter = ''
  }

  onGetInfo (code, err, data) {
    this.info.loading = false
    this.onCatalogNodeClick(null)

    if (code === 0) {
      this.info.items = data
    } else if (code !== 101) {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetInfo () {
    if (this.isNullOrEmpty(this.uri)) {
      return
    }
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.uri, null, this.onGetInfo)
  }

  mounted () {
    this.doGetInfo()
  }
}

export default Catalog
</script>

<style scoped>
  .filter {
    height: 32px;
  }
  .filter /deep/ .el-input-group__append, .el-input-group__prepend {
    border-radius: 0px;
  }

  .tree {
    border-style: solid;
    border-color: #DCDFE6;
    border-width: 0px 1px 0px 1px;
    overflow: auto;
  }
</style>
