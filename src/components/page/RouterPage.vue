<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class RouterPage extends VueBase {
  fireChangeIndex () {
    this.$emit('changeIndex', this.$route.path)
  }

  mounted () {
    this.$nextTick(this.fireChangeIndex)
  }
}

export default RouterPage
</script>
