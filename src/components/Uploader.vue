<template>
  <div class="uploader">
    <div class="upload-wrap">
      <div>help-list.js</div>
      <var-uploader
        style="width: 100px;"
        @after-read="upload_help"
        v-model="help"
        :maxlength="1"
        accept="text/javascript">
      </var-uploader>
    </div>
    <div class="upload-wrap">
      <div>icon.png</div>
      <var-uploader
        style="width: 100px;"
        @after-read="upload_icon"
        v-model="img"
        :maxlength="1"
        accept="image/png">
      </var-uploader>
    </div>
    <div class="flex-center">
      <var-button type="success" @click="use_default">使用默认配置</var-button>
    </div>
  </div>
</template>

<script>
  import {helpCFG} from "../assets/js/default"

  export default {
    name: "Uploader",
    emits: [
      "onUploadHelpList",
      "onUploadImg"
    ],
    data() {
      return {
        help: [],
        img: [],
        helpCfg: null,
        iconList: [],
      }
    },
    methods: {
      use_default() {
        this.$emit("onUploadHelpList", helpCFG)
        let that = this
        let img = new Image;
        img.setAttribute("crossOrigin", 'Anonymous')
        img.src = this.$cos + "icon.png";
        img.onload = function () {
          let cvs = document.createElement("canvas")
          cvs.width = 100
          cvs.height = 100
          let ctx = cvs.getContext("2d")

          let x, y, iconList = []
          for (let i = 0; i < 100; i++) {
            y = Math.floor(i / 10)
            x = i - 10 * y
            ctx.drawImage(img, 100 * x, 100 * y, 100, 100, 0, 0, 100, 100);
            iconList[i + 1] = cvs.toDataURL()
            ctx.clearRect(0, 0, 100, 100)
          }
          that.$emit("onUploadImg", iconList)
        }
      },
      upload_help(file) {
        file.state = 'loading'
        let fileTemp = file.file
        file.state = 'success'
        let reader = new FileReader();
        let that = this

        reader.onload = function (ev) {
          try {
            let text = reader.result.toString()
            let start = text.indexOf("[")
            let end = text.lastIndexOf("]")
            eval(`that.helpCfg=${text.substring(start, end + 1)}`)
            that.$emit("onUploadHelpList", that.helpCfg)
          } catch (e) {
            that.$dialog({
              message: "解析出错，是否使用默认配置？",
            }).then(res => {
              if (res === "confirm") {
                that.use_default()
              }
            })
          }
        };
        reader.readAsText(fileTemp, "utf-8");
      },
      upload_icon(file) {
        file.state = 'loading'
        let fileTemp = file.file
        file.state = 'success'
        let reader = new FileReader();
        let that = this

        reader.onload = function (ev) {
          let cvs = document.createElement("canvas")
          cvs.width = 100
          cvs.height = 100

          let ctx = cvs.getContext("2d")
          let img = new Image;
          img.src = reader.result;
          img.onload = function () {//必须onload之后再画
            let x, y
            for (let i = 0; i < 100; i++) {
              y = Math.floor(i / 10)
              x = i - 10 * y
              ctx.drawImage(img, 100 * x, 100 * y, 100, 100, 0, 0, 100, 100);
              that.iconList[i + 1] = cvs.toDataURL()
              ctx.clearRect(0, 0, 100, 100)
            }
            that.$emit("onUploadImg", that.iconList)
          }
        }

        reader.readAsDataURL(fileTemp);
      },
    }
  }
</script>

<style scoped>
  .uploader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .upload-wrap {
    margin: 50px;
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>