<template>
  <div>
    <div class="filter">
      <el-input v-model="keyValue"
                placeholder="输入关键字进行过滤"
                size="small"
                :clearable="true">
        <template slot="prepend">
          <span>存储库</span>
          <el-badge type="info" :value="info.items.length" />
        </template>
        <div slot="append">
          <el-button icon="el-icon-refresh" :loading="info.loading" @click="doRefresh" />
          <el-tooltip v-show="userRole === 1" placement="top-end" content="新建存储库">
            <el-button icon="el-icon-circle-plus-outline" @click="showAdd" />
          </el-tooltip>
        </div>
      </el-input>
    </div>
    <div class="tree" :style="treeStyle">
      <el-tree ref="tree"
               v-show="info.error.code === 0"
               v-loading="info.loading"
               element-loading-text="加载中..."
               element-loading-spinner="el-icon-loading"
               node-key="id"
               :props="info.props"
               :data="info.items"
               :lazy="true"
               :highlight-current="true"
               :expand-on-click-node="false"
               :filter-node-method="filterRepository"
               @node-expand="onNodeExpand"
               @node-click="onNodeClick">
        <div slot-scope="{ node, data }">
          <div v-if="data.type === 0">
                 <span style="font-weight: bold;">
                   <i class="el-icon-coin"></i>
                   <span>&nbsp;{{data.name}}</span>
                 </span>
            <el-badge style="position: absolute; right: 5px; padding: 0; margin: 0;"
                      type="warning"
                      :value="data.revisions"/>
          </div>
          <div v-if="data.type === 1">
                <span>
                  <i class="el-icon-folder"></i>
                  <span>&nbsp;{{data.name}}</span>
                </span>
          </div>
        </div>
      </el-tree>
      <error :code="info.error.code" :summary="info.error.summary" :detail="info.error.detail" />
    </div>

    <drawer v-model="repository.add.visible"
            :modal="true"
            direction="ltr"
            size="480px"
            icon="el-icon-circle-plus-outline"
            title="新建存储库" >
      <div style="padding: 5px 15px;">
        <el-form size="small">
          <el-form-item label="存储库名称" :required="true">
            <el-input v-model="repository.add.args.name" :clearable="true" @input="onAddInput"/>
          </el-form-item>
        </el-form>
        <el-alert v-show="isNotNullOrEmpty(repository.add.error.summary)"
                  type="error"
                  :closable="false"
                  :title="repository.add.error.summary"
                  :description="repository.add.error.detail" />
        <div style="text-align: right; margin-top: 10px;">
          <el-button type="primary" :plain="true" @click="repository.add.visible = false">取 消</el-button>
          <el-button type="primary" :loading="repository.add.submitting" @click="doAddRepository" >确 定</el-button>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Drawer from '@/components/Drawer'
import Error from '@/components/Error'

@Component({
  components: {
    error: Error,
    drawer: Drawer
  },
  watch: {
    keyValue: {
      handler: 'onKeyValueChanged'
    }
  }
})
class Repository extends VueBase {
  info = {
    loading: false,
    props: {
      label: 'name',
      children: 'children'
    },
    items: [],
    error: {
      code: 0,
      summary: '',
      detail: ''
    }
  }

  repository = {
    add: {
      submitting: false,
      visible: false,
      args: {
        name: ''
      },
      error: {
        summary: '',
        detail: ''
      }
    }
  }

  keyValue = ''

  get treeStyle () {
    const minHeight = this.elementHeight - 32 + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onKeyValueChanged (v) {
    this.$refs.tree.filter(v)
  }

  filterRepository (value, data) {
    if (this.isNullOrEmpty(value)) {
      return true
    }

    if (data.type !== 0) {
      return false
    }

    return data.name.indexOf(value) !== -1
  }

  onNodeExpand (data, node) {
    if (!data) {
      return
    }
    if (!node) {
      return
    }

    this.doGetFolders(data, node)
  }

  onNodeClick (data, node) {
    this.$emit('itemSelected', data)
  }

  showAdd () {
    this.repository.add.args.name = ''
    this.repository.add.error.summary = ''
    this.repository.add.error.detail = ''
    this.repository.add.submitting = false
    this.repository.add.visible = true
  }

  onAddInput () {
    this.repository.add.error.summary = ''
    this.repository.add.error.detail = ''
  }

  onAddRepository (code, err, data) {
    this.repository.add.submitting = false
    if (code === 0) {
      this.doRefresh()
      this.repository.add.visible = false
    } else if (code !== 101) {
      this.repository.add.error.summary = err.summary
      this.repository.add.error.detail = err.detail
    }
  }

  doAddRepository () {
    if (this.repository.add.submitting) {
      return
    }

    this.repository.add.submitting = true
    this.repository.add.error.summary = ''
    this.repository.add.error.detail = ''
    this.post(this.$uris.svnRepositoryAdd, this.repository.add.args, this.onAddRepository)
  }

  doRefresh () {
    this.doGetRepositories()
    this.keyValue = ''
  }

  onGetFolders (code, err, data) {
    if (code === 0) {
      const node = this.$refs.tree.getNode(data.id)
      if (node) {
        node.loaded = true
        const c = data.children.length
        for (let i = 0; i < c; i++) {
          const child = data.children[i]
          node.data.children.push(child)
        }
        node.loading = false
        if (c < 1) {
          node.isLeaf = true
        }
      }
    } else {
    }
  }

  doGetFolders (data, node) {
    if (!data) {
      return
    }
    if (!node) {
      return
    }
    if (node.loaded) {
      return
    }
    if (node.loading) {
      return
    }
    node.loading = true

    const argument = {
      id: data.id,
      name: data.repository,
      path: data.path
    }

    this.post(this.$uris.svnFolderList, argument, this.onGetFolders)
  }

  onGetRepositories (code, err, data) {
    this.info.loading = false
    this.info.error.code = code
    this.onNodeClick(null, null)

    if (code === 0) {
      this.info.items = data
    } else if (code !== 101) {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetRepositories () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.code = 0
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.svnRepositoryList, null, this.onGetRepositories)
  }

  mounted () {
    this.doGetRepositories()
  }
}

export default Repository
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
