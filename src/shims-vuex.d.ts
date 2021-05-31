import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
declare module '@vue/runtime-core' {
  interface State {
    menu: any,
    theme: any,
    debug: any,
    fs: any,
    edit: any,
  }
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
