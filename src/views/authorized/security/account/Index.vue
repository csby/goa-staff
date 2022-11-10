<template>
  <div>
    <leftNavPage v-model="info.index"
                 :element-height="elementHeight"
                 left-width="100px"
                 :menus="info.menus">
      <div>
        <div v-if="info.index === '0'" >
          <createAccount style="width: 560px; margin-top: 10px;" :show-password-role="true"/>
        </div>
        <div v-else-if="info.index === '1'" >
          <resetPassword style="width: 560px; margin-top: 10px;" :show-password-role="true"/>
        </div>
      </div>
    </leftNavPage>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import RouterPage from '@/components/page/RouterPage'
import LeftNavPage from '@/components/page/LeftNavPage'
import CreateAccount from '@/components/ad/user/Create'
import ResetPassword from '@/components/ad/user/password/Reset'

@Component({
  components: {
    leftNavPage: LeftNavPage,
    createAccount: CreateAccount,
    resetPassword: ResetPassword
  }
})
class Index extends RouterPage {
  info = {
    index: '1',
    menus: [
      {
        index: '0',
        title: '新建用户',
        disabled: false
      },
      {
        index: '1',
        title: '重置密码',
        disabled: false
      }
    ]
  }

  mounted () {
    if (this.userRole === 1) {
      this.info.menus[0].disabled = false
    } else {
      this.info.menus[0].disabled = true
    }
  }
}

export default Index
</script>

<style scoped>

</style>
