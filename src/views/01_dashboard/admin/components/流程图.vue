<template>
  <div id="nav_1" :style="{height:height,width:width}">
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">1xxxx1</div></el-col>
      <el-col><div class="display_none">1xxxx2</div></el-col>
      <el-col><div class="display_none">1xxxx3</div></el-col>
      <el-col>
        <div
          id="id4"
          ref="ref4"
          class="flow-card"
        >
          <el-card>
            <el-image
              :lazy="true"
              :src="require('@/assets/images/po_ht.png')"
              style="width: 70px; height: 70px"
            />
            <div class="card_title">采购合同管理4</div>
          </el-card>
        </div>

      </el-col>
      <el-col><div class="display_none">1xxxx5</div></el-col>
      <el-col><div class="display_none">1xxxx6</div></el-col>
      <el-col><div class="display_none">1xxxx7</div></el-col>
      <el-col><div class="display_none">1xxxx8</div></el-col>
      <el-col><div class="display_none">1xxxx9</div></el-col>
    </el-row>

    <el-row type="flex" class="row-bg-next" justify="space-around" align="center" />

    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">2xxxx1</div></el-col>
      <el-col>
        <div
          id="id1"
          ref="ref1"
          class="flow-card"
        >
          <el-card>
            <el-image
              :lazy="true"
              :src="require('@/assets/images/po_ht.png')"
              style="width: 70px; height: 70px"
            />
            <div class="card_title">采购合同管理1</div>
          </el-card>
        </div>
      </el-col>
      <el-col>
        <div
          id="id2"
          ref="ref2"
          class="flow-card"
        >
          <el-card>
            <el-image
              :lazy="true"
              :src="require('@/assets/images/po_ht.png')"
              style="width: 70px; height: 70px"
            />
            <div class="card_title">采购合同管理2</div>
          </el-card>
        </div>
      </el-col>
      <el-col><div class="display_none">2xxxx4</div></el-col>
      <el-col><div class="display_none">2xxxx5</div></el-col>
      <el-col><div class="display_none">2xxxx6</div></el-col>
      <el-col><div class="display_none">2xxxx7</div></el-col>
      <el-col><div class="display_none">2xxxx8</div></el-col>
      <el-col><div class="display_none">2xxxx9</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">3xxxx1</div></el-col>
      <el-col><div class="display_none">3xxxx2</div></el-col>
      <el-col><div class="display_none">3xxxx3</div></el-col>
      <el-col>
        <div
          id="id3"
          ref="ref3"
          class="flow-card"
        >
          <el-card>
            <el-image
              :lazy="true"
              :src="require('@/assets/images/po_ht.png')"
              style="width: 70px; height: 70px"
            />
            <div class="card_title">采购合同管理3</div>
          </el-card>
        </div>
      </el-col>
      <el-col><div class="display_none">3xxxx5</div></el-col>
      <el-col><div class="display_none">3xxxx6</div></el-col>
      <el-col><div class="display_none">3xxxx7</div></el-col>
      <el-col><div class="display_none">3xxxx8</div></el-col>
      <el-col><div class="display_none">3xxxx9</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">4xxxx1</div></el-col>
      <el-col><div class="display_none">4xxxx2</div></el-col>
      <el-col><div class="display_none">4xxxx3</div></el-col>
      <el-col>
        <div
          id="id5"
          ref="ref5"
          class="flow-card"
        >
          <el-card>
            <el-image
              :lazy="true"
              :src="require('@/assets/images/po_ht.png')"
              style="width: 70px; height: 70px"
            />
            <div class="card_title">采购合同管理5</div>
          </el-card>
        </div>

      </el-col>
      <el-col><div class="display_none">4xxxx5</div></el-col>
      <el-col><div class="display_none">4xxxx6</div></el-col>
      <el-col><div class="display_none">4xxxx7</div></el-col>
      <el-col><div class="display_none">4xxxx8</div></el-col>
      <el-col><div class="display_none">4xxxx9</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">5xxxx1</div></el-col>
      <el-col><div class="display_none">5xxxx2</div></el-col>
      <el-col><div class="display_none">5xxxx3</div></el-col>
      <el-col><div class="display_none">5xxxx4</div></el-col>
      <el-col><div class="display_none">5xxxx5</div></el-col>
      <el-col><div class="display_none">5xxxx6</div></el-col>
      <el-col><div class="display_none">5xxxx7</div></el-col>
      <el-col><div class="display_none">5xxxx8</div></el-col>
      <el-col><div class="display_none">5xxxx9</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">6xxxx1</div></el-col>
      <el-col><div class="display_none">6xxxx2</div></el-col>
      <el-col><div class="display_none">6xxxx3</div></el-col>
      <el-col><div class="display_none">6xxxx4</div></el-col>
      <el-col><div class="display_none">6xxxx5</div></el-col>
      <el-col><div class="display_none">6xxxx6</div></el-col>
      <el-col><div class="display_none">6xxxx7</div></el-col>
      <el-col><div class="display_none">6xxxx8</div></el-col>
      <el-col><div class="display_none">6xxxx9</div></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" align="center">
      <el-col><div class="display_none">7xxxx1</div></el-col>
      <el-col><div class="display_none">7xxxx2</div></el-col>
      <el-col><div class="display_none">7xxxx3</div></el-col>
      <el-col><div class="display_none">7xxxx4</div></el-col>
      <el-col><div class="display_none">7xxxx5</div></el-col>
      <el-col><div class="display_none">7xxxx6</div></el-col>
      <el-col><div class="display_none">7xxxx7</div></el-col>
      <el-col><div class="display_none">7xxxx8</div></el-col>
      <el-col><div class="display_none">7xxxx9</div></el-col>
    </el-row>
  </div>
</template>

<style scoped>
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.display_none {
  display: none;
}
.el-col {
  width: 80px;
  height: 80px;
}

::v-deep .el-card {
  border-radius: 8px;
  border: 2px solid #3c8dbc;
}
::v-deep .el-card__body {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 添加这个属性，以便内容向底部对齐 */
  align-items: center; /* 水平居中 */
  padding: 5px;
  width: 80px;
  height: 80px;
}
.card_title {
  margin-top: auto; /* 推送到底部 */
  width: 100%; /* 如果需要的话 */
  text-align: center; /* 水平居中 */
  font-size: 10px;
}
</style>

<script>
import LeaderLine from 'leader-line-vue'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '405px'
    }
  },
  data () {
    return {
      dataJson: {
      }
    }
  },
  mounted () {
    this.setUIheight()
    this.initLine()

    window.addEventListener('mousewheel', (res, x) => {
      this.positionLine()
    }, false)
    window.addEventListener('scroll', (res, x) => {
      this.positionLine()
    }, false)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initLine () {
      LeaderLine.setLine(
        this.$refs.ref1,
        this.$refs.ref2,
        {
          startSocket: 'right',
          endSocket: 'left',
          size: 4,
          color: '#3c8dbc'
        })

      LeaderLine.setLine(
        this.$refs.ref2,
        this.$refs.ref3,
        {
          path: 'grid',
          startSocket: 'bottom',
          endSocket: 'left',
          size: 4,
          color: '#3c8dbc'
        })
      LeaderLine.setLine(
        this.$refs.ref2,
        this.$refs.ref4,
        {
          path: 'grid',
          startSocket: 'top',
          endSocket: 'left',
          size: 4,
          color: '#3c8dbc'
        })
      LeaderLine.setLine(
        this.$refs.ref2,
        this.$refs.ref5,
        {
          path: 'grid',
          startSocket: 'button',
          endSocket: 'left',
          size: 4,
          color: '#3c8dbc'
        })
      // 使用属性选择器查找所有id属性以"leader-line-"开头且包含"-line-path"的元素
      var paths = document.querySelectorAll('[id^="leader-line-"][id*="-line-path"]')

      // 遍历这些元素
      paths.forEach((path) => {
        // 注意这里使用了箭头函数，以确保this指向Vue实例

        // path.setAttribute('d', this.addArc(path.getAttribute('d'), 20));
      })
      LeaderLine.positionByWindowResize = false
      const elmWrapper = document.getElementById('nav_1') // 想要挂载的节点
      const lines = document.getElementsByClassName('leader-line')
      elmWrapper.append(...lines)

      // 获取所有class为"leader-line"的SVG元素
      const leaderLines = document.querySelectorAll('svg.leader-line')

      // 遍历这些元素
      leaderLines.forEach(line => {
        // 获取当前元素的left和top值
        const currentLeft = parseFloat(line.style.left)
        const currentTop = parseFloat(line.style.top)

        // 更新left和top值
        line.style.left = `${currentLeft - 220}px`
        line.style.top = `${currentTop - 93}px`
      })

      LeaderLine.positionByWindowResize = false
    },

    setUIheight () {
      try {
        // 定义高度
        const elementHeight = document.documentElement.clientHeight - 85
        // 获取所有的ref，主要判断minus的refs
        const listRefsNames = Object.keys(this.$refs).map((key) => {
          return this.$refs[key]
        })
        let val = 0

        for (let i = 0; i < Object.keys(this.$refs).length; i++) {
          if (Object.keys(this.$refs)[i].indexOf('minus') >= 0) {
            val = val + listRefsNames[i].$el.offsetHeight
          }
        }
        const rtnVal = elementHeight - val - 180

        // 此处使用的是页面上的值
        this.settings.tableHeight = rtnVal

        // return rtnVal
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
</script>
