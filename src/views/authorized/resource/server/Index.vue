<template>
  <el-container>
    <el-aside width="420px">
      <catalog name="服务器"
               :uri="this.$uris.adServerList"
               :add-uri="this.$uris.adServerAdd"
               add-group-suffix-label="授权组后缀"
               add-description-label="IP地址"
               add-street-label="备注信息"
               add-name-placeholder="即时通讯服务器"
               add-group-suffix-placeholder="IM"
               add-description-placeholder="192.16.123.111"
               :add-street-placeholder="'os: windows server 2012'"
               :filter="filterCatalog"
               :elementHeight="elementHeight"
               icon="el-icon-refrigerator"
               @itemSelected="selectCatalog"/>
    </el-aside>
    <el-main>
      <div v-if="info.data">
        <div class="title">
          <i class="el-icon-refrigerator"></i>
          <span>{{info.data.name}}</span>
        </div>
        <div class="info" :style="infoStyle">
          <pre class="detail">{{info.data.description}}</pre>
          <div class="group"
               v-loading="info.group.loading"
               element-loading-text="加载中..."
               element-loading-spinner="el-icon-loading">
            <group class="item"
                   v-for="(item, index) in info.group.items"
                   :key="index"
                   :data="item"
                   :auth-admin="info.isAuthAdmin"
                   @authAdminChanged="onAuthAdminChanged"/>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import Catalog from '@/views/authorized/resource/Catalog'
import Group from '@/views/authorized/resource/Group'

@Component({
  components: {
    catalog: Catalog,
    group: Group
  }
})
class Index extends RouterPage {
  info = {
    available: false,
    data: null,
    group: {
      loading: false,
      items: [],
      error: {
        summary: '',
        detail: ''
      }
    },
    isAuthAdmin: false
  }

  get infoStyle () {
    const minHeight = this.elementHeight - 32 + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onAuthAdminChanged (val) {
    this.info.isAuthAdmin = val
  }

  filterCatalog (value, data) {
    if (!value) {
      return true
    }

    if (data.name.indexOf(value) !== -1) {
      return true
    }

    if (data.ip.indexOf(value) !== -1) {
      return true
    }

    return data.description.indexOf(value) !== -1
  }

  selectCatalog (data) {
    if (data) {
      this.info.available = true
    } else {
      this.info.available = false
    }

    if (this.userRole === 1) {
      this.info.isAuthAdmin = true
    } else {
      this.info.isAuthAdmin = false
    }

    this.info.data = data
    this.info.group.items = []
    this.doGetGroups()
  }

  onGetGroups (code, err, data) {
    this.info.group.loading = false

    if (code === 0) {
      this.info.group.items = data
    } else if (code !== 101) {
      this.info.group.items = []
      this.info.group.error.summary = err.summary
      this.info.group.error.detail = err.detail
    }
  }

  doGetGroups () {
    if (!this.info.data) {
      return
    }
    const argument = {
      dn: this.info.data.dn
    }
    if (this.isNullOrEmpty(argument.dn)) {
      return
    }

    if (this.info.group.loading) {
      return
    }

    this.info.group.loading = true
    this.info.group.error.summary = ''
    this.info.group.error.detail = ''
    this.post(this.$uris.adGroupRoleList, argument, this.onGetGroups)
  }
}

export default Index
</script>

<style scoped>
  .el-container, .el-aside, .el-main {
    padding: 0;
  }

  .title {
    display: flex;
    align-items: center;
    padding: 0px 20px;
    height: 32px;
    font-size: large;
    font-weight: bold;
    background-color: #f5f7fa;
  }
  .title i {
    margin-right: 3px;
  }

  .info {
    padding: 0px 20px 0px 20px;
    overflow: auto;
  }
  .detail {
    overflow-x: auto;
    line-height: 20px;
    margin: 0;
    padding-left: 18px;
    color: #606060;
  }
  .group {
    min-height: 200px;
  }
  .group .item{
    margin: 8px 0px
  }
</style>
