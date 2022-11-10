<template>
  <div class="root">
    <el-row :gutter="20">
      <el-col :span="card.span">
        <el-card :body-style="card.body.style" shadow="hover">
          <div slot="header">
            <span>公共资源</span>
          </div>
          <div>
            <div>
              <el-button type="text" @click="to('/resource/server')">服务器</el-button>
            </div>
            <div>
              <el-button type="text" @click="to('/resource/share')">共享目录</el-button>
            </div>
            <div>
              <el-button type="text" @click="to('/resource/svn')">SVN</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="card.span">
        <el-card :body-style="card.body.style" shadow="hover">
          <div slot="header">
            <span>无线设备</span>
          </div>
          <div>
            <div>
              <el-button type="text" @click="to('/wireless/filter')">MAC地址过滤</el-button>
            </div>
            <div>
              <el-button type="text" @click="to('/wireless/lease')">IP地址租用</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="card.span">
        <el-card :body-style="card.body.style" shadow="hover">
          <div slot="header">
            <span>VPN</span>
          </div>
          <div>
            <div>
              <el-button type="text" @click="to('/vpn/pptp')">PPTP</el-button>
            </div>
            <div>
              <el-button type="text" @click="to('/vpn/openvpn')">Open VPN</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="card.span">
        <el-card :body-style="card.body.style" shadow="hover">
          <div slot="header">
            <span>安全</span>
          </div>
          <div>
            <div>
              <el-button type="text" @click="to('/security/account')">用户帐号</el-button>
            </div>
            <div>
              <el-button type="text" @click="to('/security/mail')">电子邮箱</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'

@Component
class Public extends RouterPage {
  card = {
    span: 6,
    body: {
      style: {
        padding: '5px 5px 5px 10px'
      }
    }
  }
}

export default Public
</script>

<style scoped>
  .root {
    padding: 20px;
  }

  .el-card /deep/ .el-card__header {
    background-color: #f8f8f8;
    padding: 6px;
  }
  .el-card /deep/ .el-button {
    padding: 5px 0px;
  }
</style>
