<script>
import { h } from "vue";
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      editable: false,
      showTranslate: false,
      translates: {
        google: "",
        bing: "",
        youdao: "",
        deepl: "",
      },
    };
  },
  computed: {
    finalText() {
      return this.data.text;
    },
  },
  methods: {
    applySource(s) {
      if ((s = "google")) {
      }
    },
    trans() {
      this.showTranslate = true;
      const token = ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"];
      const afterConvert = [];
      const convertDict = {};
      for (let i = 0; i < this.data.text.split("%").length; i++) {
        if (i % 2 === 0) {
          afterConvert.push(this.data.text.split("%")[i]);
        } else {
          const value = `%${this.data.text.split("%")[i]}%`;
          const key = token[(i - 1) / 2];
          afterConvert.push(key);
          convertDict[key] = value;
        }
      }
      // Google
      fetch(
        `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_CN&q=${encodeURIComponent(
          afterConvert.join("")
        )}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((myJson) => {
          for (const key in convertDict) {
            if (Object.hasOwnProperty.call(convertDict, key)) {
              myJson.sentences[0].trans = myJson.sentences[0].trans.replace(
                key,
                convertDict[key]
              );
            }
          }
          this.translates.google = myJson.sentences[0].trans;
          this.editable = true;
        });
      // Bing
      fetch(
        `http://api.microsofttranslator.com/v2/Http.svc/Translate?appId=A4D660A48A6A97CCA791C34935E4C02BBB1BEC1C&from=&to=zh&text=${encodeURIComponent(
          afterConvert.join("")
        )}`
      )
        .then(function (response) {
          return response.text();
        })
        .then((text) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/xml");
          console.log(doc.children[0].textContent);
          let t = doc.children[0].textContent;
          for (const key in convertDict) {
            if (Object.hasOwnProperty.call(convertDict, key)) {
              t = t.replace(key, convertDict[key]);
            }
          }
          for (const key in convertDict) {
            if (Object.hasOwnProperty.call(convertDict, key)) {
              t = t.replace(key.toLowerCase(), convertDict[key]);
            }
          }
          this.translates.bing = t;
        });
      // Youdao
      fetch(
        `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(
          afterConvert.join("")
        )}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((j) => {
          let text = j.translateResult[0][0].tgt;
          console.log("Y", text);
          for (const key in convertDict) {
            if (Object.hasOwnProperty.call(convertDict, key)) {
              text = text.replace(key, convertDict[key]);
            }
          }
          this.translates.youdao = text;
          this.editable = true;
        });
      // DeepL
      var httpRequest = new XMLHttpRequest();
      httpRequest.open("POST", "https://www2.deepl.com/jsonrpc", true);
      httpRequest.setRequestHeader("Content-type", "application/json");
      httpRequest.onreadystatechange = function () {
        //请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          //验证请求是否发送成功
          var json = JSON.parse(httpRequest.responseText); //获取到服务端返回的数据
          for (const key in convertDict) {
            if (Object.hasOwnProperty.call(convertDict, key)) {
              myJson.sentences[0].trans = json.result.translations[0].postprocessed_sentence.replace(
                key,
                convertDict[key]
              );
            }
          }
          this.translates.deepl =
            json.result.translations[0].postprocessed_sentence;
        }
      };
      httpRequest.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "LMT_handle_jobs",
          params: {
            jobs: [
              {
                kind: "default",
                raw_en_sentence: afterConvert.join(""),
                raw_en_context_before: [],
                raw_en_context_after: [],
                preferred_num_beams: 4,
              },
            ],
            lang: { user_preferred_langs: ["EN", "ZH", "JA"] },
            source_lang_computed: "JA",
            target_lang: "ZH",
            priority: 1,
            commonJobParams: {},
            timestamp: Date.now(),
            id: 22010008,
          },
        })
      );
    },
  },
  render() {
    const modifiedLine = [];
    if (this.data.type === "Raw") {
      modifiedLine.push(h("span", {}, this.data.text));
    } else {
      modifiedLine.push(h("span", {}, this.data.type + " "));
      modifiedLine.push(
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
    }
    const displays = [];
    displays.push(h("div", {}, modifiedLine));
    if (this.showTranslate) {
      const resultList = [];
      if (this.translates.google === "") {
        resultList.push(
          h(
            "div",
            { class: "result loading" },
            h("i", { class: "fas fa-circle-notch fa-spin" })
          )
        );
      } else {
        resultList.push(
          h(
            "div",
            {
              class: "result google",
              onClick: () => {
                applySource("google");
              },
            },
            this.translates.google
          )
        );
      }
      if (this.translates.youdao === "") {
        resultList.push(
          h(
            "div",
            { class: "result loading" },
            h("i", { class: "fas fa-circle-notch fa-spin" })
          )
        );
      } else {
        resultList.push(
          h(
            "div",
            {
              class: "result youdao",
              onClick: () => {
                applySource("youdao");
              },
            },
            this.translates.youdao
          )
        );
      }
      displays.push(h("div", { class: "anchor" }, resultList));
    }
    return h("td", { class: { "modified-cell": true } }, displays);
  },
};
</script>
<style lang="stylus">
.modified-cell
  position relative

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

  .anchor
    position absolute
    backdrop-filter blur(5px) brightness(.5)
    cursor pointer
    z-index 1
    width -webkit-fill-available

    .result
      &:hover
        color var(--hover-front)
        background-color var(--hover-back)

      &:active
        color var(--active-front)
        background-color var(--active-back)

      &.loading
        text-align center

      &.google
        color yellow

      &.bing
        color cyan

      &.youdao
        color red

      &.deepl
        color blue
</style>