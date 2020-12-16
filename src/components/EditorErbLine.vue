<script>
import { h } from "vue";
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      ttt: "",
      editable: false,
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
      const token = ["AAA", "BBB", "CCC"];
      const tmp = [];
      const tmp1 = {};
      for (let i = 0; i < this.data.data.data.split("%").length; i++) {
        if (i % 2 === 0) {
          tmp.push(this.data.data.data.split("%")[i]);
        } else {
          const value = `%${this.data.data.data.split("%")[i]}%`;
          const key = token[(i - 1) / 2];
          tmp.push(key);
          tmp1[key] = value;
        }
      }
      console.log(tmp1);
      fetch(
        `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_CN&q=${encodeURIComponent(
          tmp.join("")
        )}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          // console.log(myJson.sentences[0].trans);
          console.log(myJson.sentences[0].trans, tmp1);
          for (const key in tmp1) {
            if (Object.hasOwnProperty.call(tmp1, key)) {
              console.log(key, tmp1[key]);
              myJson.sentences[0].trans = myJson.sentences[0].trans.replace(
                key,
                tmp1[key]
              );
            }
          }
          this.ttt = myJson.sentences[0].trans;
          this.editable = true;
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
            onClick: this.trans,
            contenteditable: this.editable,
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
<style lang="stylus">
span.trans
  cursor pointer
  color var(--interactable-front)
  background-color var(--interactable-back)
  outline none

  &:hover
    color var(--hover-front)
    background-color var(--hover-back)

  &:active
    color var(--active-front)
    background-color var(--active-back)
</style>