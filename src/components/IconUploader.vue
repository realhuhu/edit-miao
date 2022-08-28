<template>
  <div class="frame">
    <VuePictureCropper
      v-if="pic"
      :boxStyle="{
        height:'300px',
        width: '100%',
        backgroundColor: '#f8f8f8',
      }"
      :img="pic"
      :options="{
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1
      }"
    />
    <div v-if="!pic">
      <div class="flex-vertical wrap">
        <div>替换</div>
        <div class="icon" :style="`background: url(${icon}) 0 0 no-repeat`"/>
      </div>
    </div>
    <div class="btn">
      <var-button block type="info" @click="select">选择图片</var-button>
    </div>
    <input type="file" id="upload1" style="display: none;" name="icon" accept="image/bmp,image/jpeg,image/png">
    <div v-if="pic" class="btn">
      <var-button class="btn" block type="success" @click="submit">确定</var-button>
    </div>
    <div v-if="pic" class="tip">请使图片尽量填满取景框</div>
  </div>


</template>

<script>
  import VuePictureCropper, {cropper} from 'vue-picture-cropper'

  export default {
    name: "IconUploader",
    components: {
      VuePictureCropper
    },
    props: {
      icon: null
    },
    emits: [
      "onSelect"
    ],
    data() {
      return {
        pic: null
      }
    },
    methods: {
      select() {
        let btn = document.getElementById("upload1")
        btn.click()
      },
      submit() {
        cropper.getFile().then(file => {
          this.$emit("onSelect", file);
          this.pic = null
        })
      }
    },
    mounted() {
      let btn = document.getElementById("upload1")
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
            let Reader = new FileReader()
            Reader.readAsDataURL(file)
            Reader.onload = () => {
              this.pic = Reader.result
              console.log(Reader.result);
            }
          }
        }
      })
    }
  }
</script>

<style scoped>
  .frame {
    width: 400px;
  }

  .btn {
    padding: 10px;
  }

  .tip {
    padding: 10px;
    text-align: center;
    color: #888888;
  }

  .icon {
    width: 80px;
    height: 80px;
    display: block;
    border-radius: 5px;
    cursor: pointer;
  }

  .wrap {
    padding: 20px 0;
  }
</style>