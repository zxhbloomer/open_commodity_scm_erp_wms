<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <el-row>
      <el-col
        :xs="20"
        :sm="20"
        :lg="6"
        style="padding-right:8px;"
      >
        <div class="chart-wrapper">
          <quick-entry />
        </div>
      </el-col>
      <el-col
        :xs="52"
        :sm="52"
        :lg="18"
      >
        <div class="chart-wrapper">
          <todo-table />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import PanelGroup from './components/PanelGroup'
import QuickEntry from './components/QuickEntry'
import TodoTable from './components/TodoTable'

export default {
  name: 'DashboardAdmin',
  components: {
    // LineChart,
    // PanelGroup,
    QuickEntry,
    TodoTable
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 10px;
  background-color: rgb(240, 242, 245);

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 10px;
    height: 805px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
