<template>
  <div class="node">
    <div class="node-body" @click="$emit('selected')">
      <div v-if="level > 1" v-show="$store.state.diagramMode !== 'viewer'" class="node-body-left" @click.stop="$emit('leftMove')">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="node-body-main">
        <div class="node-body-main-header">
          <span class="title">
            <i class="el-icon-s-operation" />
            <ellipsis class="name" hover-tip :content="config.name ? config.name:('并行任务' + level)" />
          </span>
          <span v-show="$store.state.diagramMode !== 'viewer'" class="option">
            <el-tooltip effect="dark" content="复制分支" placement="top">
              <i class="el-icon-copy-document" @click="$emit('copy')" />
            </el-tooltip>
            <i class="el-icon-close" @click.stop="$emit('delNode')" />
          </span>
        </div>
        <div class="node-body-main-content">
          <span>并行任务（同时进行）</span>
        </div>
      </div>
      <div v-if="level < size" v-show="$store.state.diagramMode !== 'viewer'" class="node-body-right" @click.stop="$emit('rightMove')">
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button v-show="$store.state.diagramMode !== 'viewer'" @insertNode="type => $emit('insertNode', type)" />
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/components/60_bpm/common/InsertButton.vue'
import Ellipsis from '@/components/60_bpm/common/Ellipsis'

export default {
  name: 'ConcurrentNode',
  components: { InsertButton, Ellipsis },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    level: {
      type: Number,
      default: 1
    },
    // 条件数
    size: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>

.node{
  padding: 30px 55px 0;
  width: 220px;
  box-sizing: content-box;
  .node-body{
    overflow: hidden;
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover{
      .node-body-left, .node-body-right{
        i{
          display: block !important;
        }
      }
      .node-body-main {
        .option{
          display: inline-block !important;
        }
      }
      box-shadow: 0px 0px 3px 0px #1890FF;
    }
    .node-body-left, .node-body-right{
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;
      i{
        display: none;
      }
      &:hover{
        background-color: #ececec;
      }
    }
    .node-body-left{
      left: 0;
    }
    .node-body-right{
      right: 0;
    }
    .node-body-main {
      position: absolute;
      width: 188px;
      left: 17px;
      display: inline-block;

      .node-body-main-header{
        padding: 10px 0px 5px;
        font-size: xx-small;
        position: relative;
        .title{
          color: #718dff;
          .name{
            display: inline-block;
            height: 14px;
            width: 130px;
            margin-left: 2px;
          }
        }
        .option{
          position: absolute;
          right: 0;
          display: none;
          font-size: medium;
          i{
            color: #888888;
            padding: 0 3px;
          }
        }
      }
      .node-body-main-content {
        padding: 6px;
        color: #656363;
        font-size: 14px;

        i {
          position: absolute;
          top: 55%;
          right: 10px;
          font-size: medium;
        }
      }
    }
  }

  .node-footer{
    position: relative;
    .btn{
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }
    /deep/ .el-button{
      height: 32px;
    }
    &::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }
  }
}
</style>
