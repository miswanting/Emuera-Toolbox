import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
declare module '@vue/runtime-core' {
  interface State {
    menu: any,
    theme: any,
    debug: any,
  }
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
