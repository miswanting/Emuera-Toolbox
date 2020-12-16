<script>
import { h } from "vue";
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      ttt: "",
    };
  },
  computed: {
    finalText() {
      console.log(this.data);
      if (this.ttt === "") {
        return this.data.data.data;
      }
      return this.ttt;
    },
  },
  methods: {
    trans() {
      fetch(
        `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_CN&q=${encodeURIComponent(
          this.data.data.data
        )}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          // console.log(myJson.sentences[0].trans);
          this.ttt = myJson.sentences[0].trans;
        });
    },
  },
  render() {
    const d = [];
    if (this.data.type === "Comment") {
      d.push(h("span", {}, ";" + this.data.data));
    } else if (this.data.data.type === "Dataform") {
      d.push(h("span", {}, "DATAFORM "));
      d.push(
        h(
          "span",
          {
            class: { trans: true },
            style: {
              "background-color": "var(--interactable-back)",
              cursor: "point",
            },
            onClick: this.trans,
          },
          this.finalText
        )
      );
    } else if (this.data.data.type === "Cmd") {
      d.push(h("span", {}, this.data.data.data));
    }
    return h("td", {}, d);
  },
};
</script>
<style lang="stylus" scoped>
>>> .trans
  cursor pointer
</style>