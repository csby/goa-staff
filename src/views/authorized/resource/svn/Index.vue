<template>
  <el-container>
    <el-aside width="420px">
      <repository :element-height="elementHeight"
                  @itemSelected="selectItem" />
    </el-aside>
    <el-main>
      <div v-if="info.data">
        <div class="header">
          <div class="title">
            <i class="el-icon-coin"></i>
            <span>{{repositoryName}}</span>
          </div>
        </div>
        <div class="info" :style="infoStyle">
          <div class="row">
            <span>存储路径:</span>
            <span>{{info.data.path}}</span>
          </div>
          <div class="row">
            <span>访问地址:</span>
            <span>{{info.data.url}}</span>
          </div>
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
            <permission :repository="info.data"
                        :users="info.user.items"
                        :auth-admin="info.isAuthAdmin"/>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import Repository from '@/views/authorized/resource/svn/Repository'
import Group from '@/views/authorized/resource/Group'
import Permission from '@/views/authorized/resource/svn/Permission'

@Component({
  components: {
    repository: Repository,
    group: Group,
    permission: Permission
  },
  watch: {
    repositoryName: {
      handler: 'repositoryNameChanged'
    }
  }
})
class Index extends RouterPage {
  repositoryName = ''
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
    user: {
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

  selectItem (data) {
    if (data) {
      this.info.data = data
      this.info.available = true
      this.repositoryName = data.repository
    } else {
      this.info.available = false
      this.info.data = null
      this.repositoryName = ''
    }
  }

  repositoryNameChanged (val) {
    console.log('repositoryNameChanged:', val)
    if (this.userRole === 1) {
      this.info.isAuthAdmin = true
    } else {
      this.info.isAuthAdmin = false
    }

    this.info.group.items = []
    if (this.isNotNullOrEmpty(val)) {
      this.doGetGroups(val)
    }
  }

  onAuthAdminChanged (val) {
    this.info.isAuthAdmin = val
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

  doGetGroups (repository) {
    const argument = {
      name: repository
    }
    if (this.isNullOrEmpty(argument.name)) {
      return
    }

    if (this.info.group.loading) {
      return
    }

    this.info.group.loading = true
    this.info.group.error.summary = ''
    this.info.group.error.detail = ''
    this.post(this.$uris.svnGroupRoleList, argument, this.onGetGroups)
  }

  onGetAllUsers (code, err, data) {
    this.info.user.loading = false

    if (code === 0) {
      this.info.user.items = data
    } else if (code !== 101) {
      this.info.user.items = []
      this.info.user.error.summary = err.summary
      this.info.user.error.detail = err.detail
    }
  }

  doGetAllUsers () {
    if (this.info.user.loading) {
      return
    }

    this.info.user.loading = true
    this.info.user.error.summary = ''
    this.info.user.error.detail = ''
    this.post(this.$uris.adUserAccountList, null, this.onGetAllUsers)
  }

  mounted () {
    this.doGetAllUsers()
  }
}

export default Index
</script>

<style scoped>
  .el-container, .el-aside, .el-main {
    padding: 0;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 0px 20px;
    height: 32px;
    background-color: #f5f7fa;
  }
  .header .title {
    font-size: large;
    font-weight: bold;
  }
  .header .title i {
    margin-right: 3px;
  }

  .info {
    padding: 0px 20px 0px 20px;
    overflow: auto;
  }
  .info .row {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 6px;
  }
  .info .row :first-child{
    margin-right: 5px;
    color: gray;
  }
  .info .row :last-child{
    margin-bottom: 5px;
  }

  .group {
    min-height: 200px;
  }
  .group .item{
    margin: 8px 0px
  }
</style>
