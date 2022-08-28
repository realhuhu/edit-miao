import {createApp} from 'vue'
import App from './App.vue'
import Snackbar from "@varlet/ui/es/snackbar";
import Dialog from "@varlet/ui/es/dialog";
import axios from "axios";

const app = createApp(App)
app.config.globalProperties.$tip = Snackbar
app.config.globalProperties.$dialog = Dialog
app.config.globalProperties.$axios = axios
// app.config.globalProperties.$api = "http://127.0.0.1:8000/"
app.config.globalProperties.$api = "https://api.miao.seutools.com/"
app.config.globalProperties.$cos = "https://miao-1304907527.cos.ap-nanjing.myqcloud.com/"
app.mount('#app')

import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import 'assets/css/base.css'
