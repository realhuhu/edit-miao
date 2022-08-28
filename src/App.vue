<template>
  <div class="background"/>
  <div v-if="!QQ&&(!helpCFG.length||!iconList.length)">
    <transition name="bloom" appear>
      <uploader
        @onUploadHelpList="upload_help_list"
        @onUploadImg="upload_img"
      />
    </transition>
  </div>
  <div v-else>
    <div class="back">
      <var-button size="small" type="warning" @click="clear">重新上传文件</var-button>
    </div>
    <div class="help-panel-container var-elevation--5">
      <transition name="bloom" appear>
        <help-panel
          :help="helpCFG"
          :icon="iconList"
          :background="background"
          :currentItem="currentItem"
          @onClickGroup="change_group"
          @onClickItem="change_item"
        />
      </transition>
    </div>
    <transition name="slide" appear>
      <div class="edit-panel-container var-elevation--5">
        <edit-panel
          :QQ="QQ"
          :help="helpCFG"
          :icon="iconList"
          :background="background"
          :group="currentGroup"
          :groupIndex="groupIndex"
          :item="currentItem"
          :itemIndex="itemIndex"
          :uploading="uploading"
          @onAddGroup="add_group"
          @onChangeGroupOrder="change_group_order"
          @onDeleteGroup="delete_group"
          @onAddItem="add_item"
          @onChangeItemOrder="change_item_order"
          @onDeleteItem="delete_item"
          @onReplace="replace_icon"
          @onDownloadHelp="download_help"
          @onDownloadIcon="download_icon"
          @onUpdate="update"
          @onChangeBackground="change_background"
        />
      </div>
    </transition>

  </div>
</template>
<script>
  import Uploader from "components/Uploader"
  import HelpPanel from "components/HelpPanel";
  import EditPanel from "components/EditPanel";

  export default {
    name: "App",
    components: {
      Uploader,
      HelpPanel,
      EditPanel,
    },
    data() {
      return {
        QQ: null,
        uploading: false,
        helpCFG: [],
        iconList: [],
        background: this.$cos + 'main-01.png',
        currentGroup: null,
        groupIndex: null,
        currentItem: null,
        itemIndex: null,
        flag: 0,
        imgResult: null,
        cvs: null,
        ctx: null
      }
    },
    methods: {
      clear() {
        location.replace("/")
        this.helpCFG = []
        this.iconList = []
        this.background = this.$cos + 'main-01.png'
      },
      upload_help_list(helpCFG) {
        this.helpCFG = helpCFG
      },
      upload_img(iconList) {
        this.iconList = iconList
      },
      change_group(group, groupIndex) {
        this.currentItem = null
        this.currentGroup = group
        this.groupIndex = groupIndex

      },
      change_item(item, itemIndex, group, groupIndex) {
        this.currentItem = item
        this.itemIndex = itemIndex
        this.currentGroup = group
        this.groupIndex = groupIndex
      },
      add_group(group) {
        this.helpCFG.push(group)
        this.currentGroup = group
        this.groupIndex = this.helpCFG.length - 1
      },
      add_item(item) {
        this.helpCFG[this.groupIndex].list.push(item)
        this.currentItem = item
        this.itemIndex = this.helpCFG[this.groupIndex].list.length - 1
      },
      change_group_order(offset) {
        let temp, array = this.helpCFG
        temp = array[this.groupIndex]
        array[this.groupIndex] = array[this.groupIndex + offset]
        array[this.groupIndex + offset] = temp
        this.groupIndex += offset
      },
      change_item_order(offset) {
        let temp, array = this.helpCFG[this.groupIndex].list
        temp = array[this.itemIndex]
        array[this.itemIndex] = array[this.itemIndex + offset]
        array[this.itemIndex + offset] = temp
        this.itemIndex += offset
      },
      delete_group() {
        this.$dialog({
          message: "确认删除该组别？",
        }).then(res => {
          if (res === "confirm") {
            this.helpCFG.splice(this.groupIndex, 1);
            this.groupIndex = this.group = this.itemIndex = this.item = null
          }
        })
      },
      delete_item() {
        this.$dialog({
          message: "确认删除该项目？",
        }).then(res => {
          if (res === "confirm") {
            this.helpCFG[this.groupIndex].list.splice(this.itemIndex, 1);
            this.itemIndex = this.item = null
          }
        })
      },
      replace_icon(index, data) {
        this.iconList[index] = data
      },
      change_background(pic) {
        this.background = pic
      },
      download_help() {
        let aTag = document.createElement('a');
        aTag.download = "help-list.js";
        let blob = new Blob(["export const helpCfg = ", JSON.stringify(this.helpCFG)], {
          type: "text/javascript;charset=utf-8"
        });
        aTag.href = URL.createObjectURL(blob);
        aTag.click();
      },
      download_icon() {
        let cvs = document.createElement("canvas")
        cvs.width = 1000
        cvs.height = 1000
        let ctx = cvs.getContext("2d")
        let x, y
        let that = this
        for (let i = 0; i < 100; i++) {
          let img = new Image;
          y = Math.floor(i / 10)
          x = i - 10 * y
          img.src = this.iconList[i + 1];
          let _x = x
          let _y = y
          img.onload = function () {
            ctx.drawImage(img, 100 * _x, 100 * _y, 100, 100);
            that.flag += 1
            if (that.flag === 100) {
              cvs.toBlob(data => {
                let aTag = document.createElement('a');
                aTag.download = "icon.png";
                aTag.href = URL.createObjectURL(data);
                aTag.click();
                that.flag = 0
              })
            }
          }
        }
      },
      update() {
        this.$tip({
          content: "上传中，这可能需要几秒",
          type: "success",
          duration: 2000
        })
        this.uploading = true
        Promise.all([
          new Promise(resolve => resolve(encodeURI(JSON.stringify(this.helpCFG)))),
          new Promise(resolve => {
            let cvs = document.createElement("canvas")
            cvs.width = 1000
            cvs.height = 1000
            let ctx = cvs.getContext("2d")
            let x, y
            let that = this
            for (let i = 0; i < 100; i++) {
              let img = new Image;
              y = Math.floor(i / 10)
              x = i - 10 * y
              img.src = this.iconList[i + 1];
              let _x = x
              let _y = y
              img.onload = function () {
                ctx.drawImage(img, 100 * _x, 100 * _y, 100, 100);
                that.flag += 1
                if (that.flag === 100) {
                  that.flag = 0
                  cvs.toBlob(blob => {
                    resolve(new File([blob], 'icon.png', {type: 'image/png', lastModified: Date.now()}))

                  })
                }
              }
            }
          }),
          new Promise(resolve => {
            let img = new Image()
            img.src = this.background
            img.onload = () => {
              let cvs = document.createElement("canvas")
              cvs.width = 800;
              cvs.height = 800 * img.height / img.width;
              let ctx = cvs.getContext("2d")
              ctx.drawImage(img, 0, 0, 800, 800 * img.height / img.width);
              cvs.toBlob(blob => {
                resolve(new File([blob], 'background.png', {type: 'image/png', lastModified: Date.now()}))
              })
            }
          })
        ]).then(res => {
          let data = new FormData()
          data.append("help", res[0])
          data.append("icon", res[1])
          data.append("background", res[2])
          this.$axios.put(this.$api + this.QQ + "/", data).then(res => {
            if (res.data.code === 103) {
              this.$tip({
                content: "更新完成",
                type: "success",
                duration: 1000
              })
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 2000
              })
            }
            this.uploading = false
          })
        })
      }
    },
    created() {
      let vars = window.location.search.substring(1).split("&");
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === "qq") {
          this.QQ = pair[1]
        }
      }
      if (this.QQ) {
        this.$axios.get(this.$api + this.QQ).then(res => {
          if (res.data.code !== 102) {
            this.$dialog(res.data.msg)
          } else {
            let help = decodeURI(res.data.result.data.help)
            let a
            eval(`a=${help}`)
            this.helpCFG = a
            Promise.all([
              new Promise(resolve1 => {
                let img = new Image;
                img.setAttribute("crossOrigin", 'Anonymous')
                img.src = this.$cos + res.data.result.data.icon
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
                  resolve1(iconList)
                }
              }),
              new Promise(resolve1 => {
                let img = new Image;
                img.setAttribute("crossOrigin", 'Anonymous')
                img.src = this.$cos + res.data.result.data.background
                img.onload = function () {
                  let cvs = document.createElement("canvas")
                  cvs.width = 800
                  cvs.height = 800 * img.height / img.width
                  let ctx = cvs.getContext("2d")

                  ctx.drawImage(img, 0, 0, 800, 800 * img.height / img.width);
                  resolve1(cvs.toDataURL())
                }
              })
            ]).then(data => {
              this.iconList = data[0]
              this.background = data[1]
            })
          }
        })
      }
    },
    beforeCreate() {
      if (document.body.clientWidth < 1000) {
        this.$dialog({
          message: "请使用电脑编辑！",
        })
      } else if (document.body.clientWidth < 1200) {
        this.$dialog({
          message: "屏幕宽度不足，实际效果可能与预览略有不同",
        })
      }
    }
  }
</script>
<style scoped>
  .back {
    position: fixed;
    left: 20px;
    top: 20px;
    z-index: 100;
  }

  .background {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f0f1f5;
    z-index: -1;
  }

  @media screen  and (min-width: 1200px) {
    .help-panel-container {
      width: 800px;
      margin: 15px calc(50vw - 600px);
    }

    .edit-panel-container {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      width: 400px;
      background-color: white;
      z-index: 100;
    }
  }

  @media screen  and (max-width: 1200px) {
    .help-panel-container {
      width: 70vw;
    }

    .edit-panel-container {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      width: 30vw;
      background-color: white;
      z-index: 100;
    }
  }
</style>
