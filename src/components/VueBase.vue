<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    elementHeight: {
      type: Number,
      default: 0
    }
  },
  watch: {
    elementHeight: {
      handler: 'onElementHeightChanged'
    }
  }
})
class VueBase extends Vue {
  get userRole () {
    const role = this.$db.get(this.$db.keys.role)
    if (role) {
      return role
    }

    return 0
  }

  onElementHeightChanged (v) {
  }

  isNullOrEmpty (val) {
    if (val === undefined || val === null || val === '' || val === '\u003cnil\u003e') {
      return true
    }
    return false
  }

  isNotNullOrEmpty (val) {
    if (this.isNullOrEmpty(val)) {
      return false
    }
    return true
  }

  sleep (millisecond) {
    const t = Date.now()
    while (Date.now() - t <= millisecond) {
    }
  }

  to (path) {
    if (this.isNullOrEmpty(path)) {
      return
    }
    this.$router.push({ path: path })
  }

  toLogin () {
    let path = '/'
    const fromPath = this.$router.history.current.path
    if (fromPath) {
      path = fromPath
    }
    this.$router.push({ name: 'Login', params: { backPath: path } })
  }

  error (err) {
    if (err) {
      let msg = '<strong>' + err.summary + '</strong>'
      if (this.isNotNullOrEmpty(err.detail)) {
        msg = msg + '<p>&nbsp;</p><p>' + err.detail + '</p>'
      }
      this.$msg({
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }

  // msgType: success / warning / info / error
  message (msgVal, msgType = 'info') {
    this.$msg({
      showClose: true,
      message: msgVal,
      type: msgType
    })
  }

  onInterceptor (response) {
    if (response.data) {
      // 无效凭证，需要登录
      if (response.data.code === 101) {
        this.$db.clear()
        let path = '/'
        const fromPath = this.$router.history.current.path
        if (fromPath) {
          path = fromPath
        }
        this.$router.push({ name: 'Login', params: { backPath: path } })
      }
    }

    return response
  }

  // example
  //  uri: "/api/info"
  //  argument: {id: "111212323"}
  //  handler: function(code, error, data){ }
  post (uri, argument, handler) {
    this.$net.post(uri, argument, handler, this.onInterceptor)
  }

  // example
  //  uri: "/api/upload"
  //  argument: {id: "111212323"}
  //  handler: function(code, error, data){ }
  //  uploadProgress: function(progressEvent) {
  //      var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
  //  }
  upload (uri, argument, handler, uploadProgress) {
    this.$net.upload(uri, argument, handler, this.onInterceptor, uploadProgress)
  }

  mounted () {
  }

  beforeDestroy () {
  }
}

export default VueBase
</script>
