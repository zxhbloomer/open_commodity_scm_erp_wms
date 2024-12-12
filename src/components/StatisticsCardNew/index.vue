<template>
  <div>
    <el-card
      :body-style="{ padding: '5px' }"
      shadow="never"
    >
      <div class="el-statistic">
        <div class="head">
          {{ titleOne }} / {{ titleTwo }}
        </div>
        <div class="con">
          <el-link target="_blank">
            <router-link
              :to="{name:pageCodeOne,query:{sync_status: syncStatusOne,fullpath:true}}"
              @click.native="closeTable"
            >
              <a href="javascript:void(0)">
                <span class="number" :style="{ fontSize: numberFontSizeOne }">
                  {{ numberOne }}
                </span>
              </a></router-link>
            /
            <router-link
              :to="{name:pageCodeTwo,query:{sync_status: syncStatusTwo,fullpath:true}}"
              @click.native="closeTable"
            >
              <a href="javascript:void(0)">
                <span class="number" :style="{ fontSize: numberFontSizeTwo }">
                  {{ numberTwo }}
                </span>
              </a></router-link>

          </el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  components: {},
  props: {
    // 是否显示
    titleOne: {
      type: String,
      default: ''
    },
    // 是否显示
    titleTwo: {
      type: String,
      default: ''
    },
    numberOne: {
      type: Number,
      default: 0
    },
    numberTwo: {
      type: Number,
      default: 0
    },
    pageCodeOne: {
      type: String,
      default: ''
    },
    pageCodeTwo: {
      type: String,
      default: ''
    },
    syncStatusOne: {
      type: String,
      default: '0'
    },
    syncStatusTwo: {
      type: String,
      default: '0'
    },
    numberFontSizeOne: {
      type: String,
      default: '20px'
    },
    numberFontSizeTwo: {
      type: String,
      default: '20px'
    }
  },
  data () {
    return {
      dialogVisible: true
    }
  },
  created () {
    // alert(this.showAlarm)
  },
  beforeDestroy () {
    // alert('销毁了')
  },
  methods: {
    // handleClose (done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => { })
    // },
    closeTable () {
      this.$emit('closeTable')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-statistic {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #000;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  text-align: left;
}
.el-statistic .head {
  margin-bottom: 2px;
  color: gray;
  font-size: 12px;
}
.el-statistic .con {
  font-family: Sans-serif;
  display: flex;
  justify-content: left;
  align-items: center;
  color: #303133;
}
.el-statistic .con .number {
  //font-size: 20px;
  padding: 0 4px;
}
.el-statistic .con span {
  display: inline-block;
  margin: 0;
  line-height: 20px;
}
.el-card {
  border: 0px solid #e6ebf5;
}
</style>
