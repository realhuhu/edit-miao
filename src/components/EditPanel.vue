<template>
  <input type="file" id="upload2" style="display: none;" name="icon" accept="image/bmp,image/jpeg,image/png">
  <div class="flex-vertical-between">
    <div>
      <var-tabs
        color="#efefef"
        active-color="#222"
        inactive-color="#999"
        v-model:active="option"
      >
        <var-tab>
          <var-icon name="content-copy"/>
          <div>分组</div>
        </var-tab>
        <var-tab>
          <var-icon name="menu"/>
          <div>项目</div>
        </var-tab>
        <var-tab v-if="QQ">
          <var-icon name="menu"/>
          <div>背景</div>
        </var-tab>
      </var-tabs>
      <var-tabs-items v-model:active="option">
        <var-tab-item>
          <var-tabs class="small-tabs" v-model:active="groupAction">
            <var-tab>编辑分组</var-tab>
            <var-tab>添加分组</var-tab>
            <div style="width: 200px"/>
          </var-tabs>
          <div class="wrap">
            <var-tabs-items v-model:active="groupAction">
              <var-tab-item>
                <div v-if="group">
                  <div class="wrap">
                    <var-input placeholder="组名" text-color="black" v-model="group.group"/>
                    <var-radio-group class="radio" v-model="group.auth">
                      <var-radio checked-value="master" @click="change_auth(group)">仅管理员可见</var-radio>
                    </var-radio-group>
                  </div>

                  <div class="flex-between move-wrap">
                    <div class="flex-left">
                      <var-button
                        round
                        class="round"
                        color="transparent"
                        :disabled="groupIndex===0"
                        @click="$emit('onChangeGroupOrder',-1)">
                        <var-icon name="chevron-up"/>
                      </var-button>
                      <var-button
                        round
                        class="round"
                        :disabled="groupIndex===help.length-1"
                        color="transparent"
                        @click="$emit('onChangeGroupOrder',1)">
                        <var-icon name="chevron-down"/>
                      </var-button>
                    </div>
                    <div class="right-edit">
                      <var-button type="danger" @click="$emit('onDeleteGroup')">删除该组</var-button>
                    </div>
                  </div>
                </div>
                <div v-else class="tip">点击选取分组进行编辑</div>
              </var-tab-item>

              <var-tab-item>

                <var-input class="wrap" placeholder="组名" text-color="black" v-model="newGroup.group"/>

                <div class="flex-between wrap">
                  <var-radio-group v-model="newGroup.auth">
                    <var-radio checked-value="master" @click="change_auth(newGroup)">仅管理员可见</var-radio>
                  </var-radio-group>
                  <var-button
                    type="success"
                    @click="$emit('onAddGroup',newGroup)"
                    :disabled="!newGroup.group">
                    添加
                  </var-button>
                </div>
              </var-tab-item>

            </var-tabs-items>
          </div>

        </var-tab-item>
        <var-tab-item>
          <var-tabs class="small-tabs" v-model:active="itemAction">
            <var-tab>编辑项目</var-tab>
            <var-tab>添加项目</var-tab>
            <div style="width: 200px"/>
          </var-tabs>
          <div class="wrap">
            <var-tabs-items v-model:active="itemAction">
              <var-tab-item>
                <div v-if="item">
                  <div class="bold"> 组别：{{group.group}}</div>
                  <div class="flex-vertical wrap" @click="open_icon_view(item)">
                    <div class="icon" :style="`background: url(${icon[item.icon]}) 0 0 no-repeat`"/>
                    <div>图标</div>
                  </div>
                  <var-input class="wrap" placeholder="标题" text-color="black" v-model="item.title"/>
                  <var-input class="wrap" placeholder="描述" text-color="black" v-model="item.desc"/>
                  <div class="flex-between wrap">

                    <div class="flex-left">
                      <var-button
                        round
                        class="round"
                        color="transparent"
                        @click="$emit('onChangeItemOrder',-1)"
                        :disabled="itemIndex===0">
                        <var-icon name="chevron-left"/>
                      </var-button>
                      <var-button
                        round
                        class="round"
                        color="transparent"
                        @click="$emit('onChangeItemOrder',1)"
                        :disabled="itemIndex===help[groupIndex].list.length-1">
                        <var-icon name="chevron-right"/>
                      </var-button>
                    </div>
                    <div class="flex-right">
                      <var-button type="info" @click="open_icon_view(item)">更换图标</var-button>
                      <var-button type="danger" @click="$emit('onDeleteItem')">删除该项目</var-button>
                    </div>
                  </div>
                </div>
                <div v-else class="tip">点击选中项目进行编辑</div>
              </var-tab-item>

              <var-tab-item>
                <div v-if="group">
                  <div class="bold"> 组别：{{group.group}}</div>
                  <div class="flex-vertical wrap" @click="open_icon_view(newItem)">
                    <div class="icon" :style="`background: url(${icon[newItem.icon]}) 0 0 no-repeat`"/>
                    <div>图标</div>
                  </div>
                  <var-input class="wrap" placeholder="标题" text-color="black" v-model="newItem.title"/>
                  <var-input class="wrap" placeholder="描述" text-color="black" v-model="newItem.desc"/>
                  <div class="flex-between wrap">
                    <var-button type="info" @click="open_icon_view(newItem)">更换图标</var-button>
                    <var-button
                      type="success"
                      :disabled="!newItem.desc||!newItem.title"
                      @click="add_item">添加
                    </var-button>
                  </div>
                </div>
                <div v-else class="tip">点击选取分组后进行添加</div>
              </var-tab-item>
            </var-tabs-items>
          </div>
        </var-tab-item>
        <var-tab-item v-if="QQ">
          <div class="background-wrap" @click="upload_background">
            点击替换背景图
            <img :src="background" class="background" alt="">
          </div>
        </var-tab-item>
      </var-tabs-items>
    </div>
    <div>
      <div class="wrap flex-between">
        <var-button type="success" @click="$emit('onDownloadHelp')">下载help-list.js</var-button>
        <var-button type="success" @click="$emit('onDownloadIcon')">下载icon.png</var-button>
        <var-button v-if="QQ" :disabled="uploading" type="info" @click="$emit('onUpdate')">
          {{uploading?"上传中...":"保存编辑结果"}}
        </var-button>
      </div>
    </div>
  </div>
  <var-popup style="border-radius: 5px" v-model:show="showIconView">
    <div class="icon-view-wrap">
      <div class="icon-view">
        <div :class="edit?'edit-icon':'medium-icon'" v-for="(_,k) in new Array(100).toString().split(',')"
             :style="{
              background: `url(${icon[k+1]}) 0 0 no-repeat`
              }"
             @click="icon_click(k+1)"
        />
        <div class="add-icon">
          <var-button :type="edit?'danger':'success'" @click="switch_edit">{{edit?"取消":"添加自定义图标"}}</var-button>
        </div>
      </div>
    </div>
  </var-popup>

  <var-popup style="border-radius: 5px" v-model:show="showUploader">
    <icon-uploader @onSelect="replace" :icon="icon[toReplace]"/>
  </var-popup>

</template>

<script>
  import IconUploader from "./IconUploader";

  export default {
    name: "EditPanel",
    components: {IconUploader},
    props: {
      QQ: null,
      uploading: null,
      help: null,
      icon: null,
      background: null,
      group: null,
      groupIndex: null,
      item: null,
      itemIndex: null
    },
    emits: [
      "onAddGroup",
      "onChangeGroupOrder",
      "onDeleteGroup",
      "onAddItem",
      "onChangeItemOrder",
      "onDeleteItem",
      "onReplace",
      "onDownloadHelp",
      "onDownloadIcon",
      "onUpdate",
      "onChangeBackground"
    ],
    data() {
      return {
        option: 0,
        groupAction: 0,
        itemAction: 0,
        newGroup: {
          group: "",
          list: [],
        },
        newItem: {
          title: "",
          desc: "",
          icon: 1
        },
        openedItem: null,
        showIconView: false,
        edit: false,
        showUploader: false,
        toReplace: null
      }
    },
    methods: {
      change_auth(group) {
        if (group.auth === "master") {
          delete group.auth
        }
      },
      add_group() {
        this.$emit('onAddGroup', this.newGroup)
        this.newGroup = {
          group: "",
          list: [],
        }
      },
      add_item() {
        this.$emit('onAddItem', this.newItem)
        this.newItem = {
          title: "",
          desc: "",
          icon: 1
        }
      },
      open_icon_view(item) {
        this.openedItem = item
        this.edit = false
        this.toReplace = null
        this.showIconView = true
      },
      icon_click(k) {
        if (!this.edit) {
          this.openedItem.icon = k
          this.showIconView = false
        } else {
          this.toReplace = k
          this.showUploader = true
        }
      },
      switch_edit() {
        this.edit = !this.edit
        if (this.edit) {
          this.$tip({
            content: "请点击你要替换的图标",
            type: "success",
            duration: 2000
          })
        } else {
          this.$tip({
            content: "已取消",
            type: "success",
            duration: 2000
          })
        }
      },
      replace(file) {
        this.showUploader = false
        this.edit = false
        let that = this
        let cvs = document.createElement("canvas")
        cvs.width = 100
        cvs.height = 100

        let reader = new FileReader();
        reader.onload = function (e) {
          let ctx = cvs.getContext("2d")
          let oldImg = new Image;
          oldImg.src = that.icon[that.toReplace];
          oldImg.onload = function () {//必须onload之后再画
            ctx.drawImage(oldImg, 0, 0, 100, 100);
            ctx.clearRect(0, 0, 80, 80)
            let newImg = new Image
            newImg.src = reader.result
            newImg.onload = function () {
              ctx.drawImage(newImg, 0, 0, 80, 80);
              that.$emit("onReplace", that.toReplace, cvs.toDataURL())
            }
          }
        };
        reader.readAsDataURL(file);
      },
      upload_background() {
        let btn = document.getElementById("upload2")
        btn.click()
      }
    },
    mounted() {
      let btn = document.getElementById("upload2")
      btn.addEventListener("change", ev => {
        let files = ev.target.files
        if (files.size !== 0) {
          let file = files[0]
          if (file.size / (1024 * 1024) > 5) {
            this.$tip({
              content: "图片大小不超过5M",
              type: "warning",
              duration: 1000,
            })
          } else if (!["image/bmp", "image/jpeg", "image/png"].includes(file.type)) {
            this.$tip({
              content: "只能上传jpg,png,bmp",
              type: "warning",
              duration: 1000,
            })
          } else {
            let that = this
            let Reader = new FileReader()
            Reader.readAsDataURL(file)
            Reader.onload = () => {
              let cvs = document.createElement("canvas");
              let img = new Image;
              img.src = Reader.result
              img.onload = () => {
                cvs.width = 800;
                cvs.height = 800 * img.height / img.width;
                cvs.getContext("2d").drawImage(img, 0, 0, 800, 800 * img.height / img.width);
                that.$emit("onChangeBackground", cvs.toDataURL())
              }
            }
          }
        }
      })
    }
  }
</script>

<style scoped>
  .small-tabs {
    --tabs-item-horizontal-height: 40px;
  }

  .wrap {
    padding: 15px;
  }

  .move-wrap {
    padding: 5px;
  }

  .tip {
    text-align: center;
    margin-top: 40px;
    color: #888888;
  }

  .radio {
    margin: 10px 0;
  }

  .round {
    margin-right: 10px;
    width: 36px;
    height: 36px;
  }

  .icon {
    width: 80px;
    height: 80px;
    display: block;
    border-radius: 5px;
    cursor: pointer;
  }

  .icon-view-wrap {
    width: 960px;
    margin: 10px;
    z-index: 100;
  }

  .medium-icon, .edit-icon {
    width: 80px;
    height: 80px;
    display: block;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .medium-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px #4ebaee;
  }

  .edit-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px red;
  }

  .icon-view {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    align-items: center;
  }

  .add-icon {
    flex-grow: 1;
    display: flex;
    flex-direction: row-reverse;
  }

  .background {
    width: 100%;
    overflow: scroll;
  }

  .background-wrap {
    padding: 15px;
    max-height: 80vh;
    width: 100%;
    overflow: scroll;
  }
</style><!--tcb hosting deploy -r sh -e miao-8gb1mcln3ec2149b-->