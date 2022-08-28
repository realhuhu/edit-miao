<template>
  <div v-if="help">
    <div class="container">
      <div class="wrap"
           :style="{
              background: `url(${background}) top left/100% auto no-repeat`
           }">
        <div class="head-box">
          <div class="label">
            <div class="title">
              使用帮助
            </div>
            <div>
              Yunzai-Bot & Miao-Plugin
            </div>
          </div>

          <div class="cont-box" v-for="(group,groupIndex) in help">
            <transition name="bloom">
              <div>
                <div class="help-group" @click="$emit('onClickGroup',group,groupIndex)">{{group.group}}</div>

                <div class="help-table">
                  <div v-for="(result,row) in split(group.list)" class="tr">
                    <div
                      class="td"
                      :class="{active:item===currentItem}"
                      v-for="(item,col) in result"
                      @click="$emit('onClickItem',item,3*row+col,group,groupIndex)">
                      <transition name="bloom">
                        <div>
                          <div class="help-icon" :style=" `background: url(${icon[item.icon]}) 0 0 no-repeat`"/>
                          <div class="help-title"> {{item.title}}</div>
                          <div class="help-desc"> {{item.desc}}</div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HelpPanel",
    props: {
      help: null,
      icon: null,
      background: null,
      currentItem: null
    },
    emits: [
      "onClickGroup",
      "onClickItem",
    ],
    methods: {
      split(item_list) {
        let result = [];
        for (let i = 0; i < item_list.length; i += 3) {
          result.push(item_list.slice(i, i + 3));
        }
        return result
      },
    }
  }
</script>

<style scoped>
  .container {
    transform: scale(1);
    background: url("../assets/img/bg-01.jpg");
    min-height: 50vh;
  }

  .wrap {
    padding: 15px;
  }

  .label {
    font-family: Number, "85W", sans-serif;
    color: white;
    font-style: italic;
    text-shadow: 1px 2px 2px black;
  }

  .head-box {
    padding: 60px 0 0 0;
  }

  .head-box .title {
    font-size: 50px;
  }

  .cont-box {
    border-radius: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 5px 15px;
    overflow: hidden;
    box-shadow: 0 5px 10px 0 rgba(0 0 0 .15);
    position: relative;
    background: rgba(43, 52, 61, 0.8);
    font-family: Number, "微软雅黑", sans-serif;
    color: white;
  }

  .help-group {
    color: #ceb78b;
    font-size: 18px;
    font-weight: bold;
    padding: 8px 0 5px 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .help-group:hover {
    transform-origin: left;
    color: #FAFAD2;
  }

  .help-table {
    text-align: center;
    border-collapse: collapse;
    margin: 5px -10px -10px -15px;
    border-radius: 0 0 10px 10px;
    display: table;
    overflow: hidden;
    width: calc(100% + 30px);
    color: #fff;
  }

  .help-table .tr {
    display: table-row;
  }

  .help-table .td {
    font-size: 14px;
    display: table-cell;
    box-shadow: 0 0 1px 0 #888 inset;
    padding: 12px 0 12px 50px;
    line-height: 24px;
    position: relative;
    width: 33.33%;
    overflow: auto;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .help-table .td:hover {
    background-color: #3983a3;
    transform: scale(1.03);
    z-index: 100;
  }

  .help-table .tr:nth-child(odd) {
    background: rgba(34, 41, 51, .6)
  }

  .help-table .tr:nth-child(even) {
    background: rgba(34, 41, 51, .3)
  }

  .help-table .tr:last-child .td {
    padding-bottom: 12px;
  }

  .help-icon {
    width: 80px;
    height: 80px;
    display: block;
    position: absolute;
    border-radius: 5px;
    transform: scale(0.425) translateX(-47px) translateY(-47px);
    left: 6px;
    top: 12px;
  }

  .help-title {
    display: block;
    color: #d3bc8e;
    font-size: 16px;
    line-height: 24px;
  }

  .help-desc {
    display: block;
    font-size: 13px;
    line-height: 18px;
    color: #eee;
  }

  .active {
    background-color: #3983a3;
    transform: scale(1.03);
  }
</style>