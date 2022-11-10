<template>
  <div>
    <div class="table">
      <el-table :data="info.page.pageItems"
                v-loading="info.page.loading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :stripe="true"
                :border="true" :height="elementHeight - 33">
        <slot name="columns">
          <el-table-column :label="name" prop="address"/>
          <el-table-column label="提交者" prop="commitBy" width="105px"/>
          <el-table-column label="提交时间" prop="commitDateTime" width="155px"/>
          <el-table-column label="首次阻止时间" prop="firstBlockDateTime" width="155px"/>
          <el-table-column label="最后阻止时间" prop="lastBlockDateTime" width="155px"/>
          <el-table-column label="拒收次数" prop="blockCount" width="85px" align="right"/>
          <el-table-column width="90px">
            <template #header>
              <el-button type="text" icon="el-icon-circle-plus-outline" @click="showAdd">添加</el-button>
            </template>
            <template slot-scope="scope">
              <el-popconfirm :title="'确定要删除[' + scope.row.address + ']吗?'"
                             @confirm="doDelete(scope.row.address)">
                <el-button slot="reference"
                           type="text"
                           size="mini"
                           icon="el-icon-remove-outline"
                           :disabled="userRole !== 1">
                  <span>删除</span>
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </slot>
      </el-table>
    </div>
    <div class="page">
      <el-pagination layout="slot, sizes, prev, pager, next, jumper"
                     @current-change="onPageIndexChanged"
                     @size-change="onPageSizeChanged"
                     :current-page="info.page.pageIndex"
                     :page-size="info.page.pageSize"
                     :page-sizes="info.page.pageSizes"
                     :total="info.page.itemCount">
        <slot>
          <span class="page-slot">共 {{info.page.pageCount}} 页 {{info.page.itemCount}} 条</span>
        </slot>
      </el-pagination>
    </div>

    <drawer v-model="info.add.visible"
            :modal="true"
            size="480px"
            icon="el-icon-circle-plus-outline"
            :title="'添加阻止' + name" >
      <div style="padding: 5px 15px;">
        <el-form size="small">
          <el-form-item :label="name" :required="true">
            <el-input v-model="info.add.args.address" :clearable="true" @input="onAddInput"/>
          </el-form-item>
        </el-form>
        <el-alert v-show="isNotNullOrEmpty(info.add.error.summary)"
                  type="error"
                  :closable="false"
                  :title="info.add.error.summary"
                  :description="info.add.error.detail" />
        <div style="text-align: right; margin-top: 10px;">
          <el-button type="primary" :plain="true" @click="info.add.visible = false">取 消</el-button>
          <el-button type="primary" :loading="info.add.submitting" @click="doAdd" >确 定</el-button>
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
    pageUri: {
      type: String,
      default: ''
    },
    addUri: {
      type: String,
      default: ''
    },
    delUri: {
      type: String,
      default: ''
    }
  }
})
class Block extends VueBase {
  info = {
    page: {
      loading: false,
      pageCount: 0,
      pageIndex: 1,
      pageSize: 20,
      pageSizes: [5, 10, 15, 20, 25, 30, 50, 100, 150, 200],
      itemCount: 0,
      pageItems: [],
      error: {
        summary: '',
        detail: ''
      }
    },
    add: {
      visible: false,
      submitting: false,
      args: {
        address: ''
      },
      error: {
        summary: '',
        detail: ''
      }
    }
  }

  onPageIndexChanged (val) {
    this.info.page.pageIndex = val
    this.doGetPage()
  }

  onPageSizeChanged (val) {
    this.info.page.pageSize = val
    this.doGetPage()
  }

  showAdd () {
    this.info.add.args.address = ''
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''
    this.info.add.submitting = false
    this.info.add.visible = true
  }

  onAddInput () {
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''
  }

  onAdd (code, err, data) {
    this.info.add.submitting = false
    if (code === 0) {
      this.doGetPage()
      this.info.add.visible = false
    } else if (code !== 101) {
      this.info.add.error.summary = err.summary
      this.info.add.error.detail = err.detail
    }
  }

  doAdd () {
    if (this.info.add.submitting) {
      return
    }

    this.info.add.submitting = true
    this.info.add.error.summary = ''
    this.info.add.error.detail = ''
    this.post(this.addUri, this.info.add.args, this.onAdd)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.doGetPage()
      this.message('删除成功', 'success')
    } else if (code !== 101) {
      this.error(err)
    }
  }

  doDelete (address) {
    const argument = {
      address: address
    }
    this.post(this.delUri, argument, this.onDelete)
  }

  onGetPage (code, err, data) {
    this.info.page.loading = false

    if (code === 0) {
      this.info.page.pageItems = data.pageItems
      this.info.page.pageIndex = data.pageIndex
      this.info.page.pageSize = data.pageSize
      this.info.page.itemCount = data.itemCount
      this.info.page.pageCount = data.pageCount
    } else if (code !== 101) {
      this.info.page.error.summary = err.summary
      this.info.page.error.detail = err.detail
      this.info.page.pageItems = []
      this.info.page.itemCount = 0
      this.info.page.pageCount = 0
    }
  }

  doGetPage () {
    if (this.info.page.loading) {
      return
    }

    const argument = {
      pageIndex: this.info.page.pageIndex,
      pageSize: this.info.page.pageSize
    }

    this.info.page.error.summary = ''
    this.info.page.error.detail = ''
    this.info.page.loading = true
    this.post(this.pageUri, argument, this.onGetPage)
  }

  mounted () {
    this.doGetPage()
  }
}

export default Block
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
  .table /deep/ .el-button {
    padding: 1px 0px;
  }

  .page{
    height: 32px;
    text-align: right;
  }
</style>
