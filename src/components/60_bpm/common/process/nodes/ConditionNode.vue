<template>
  <div :class="{'node': true, 'node-error-state': showError}">
    <div :class="{'node-body': true, 'error': showError}">
      <div v-if="level > 1 && $store.state.diagramMode !== 'viewer'" class="node-body-left" @click="$emit('leftMove')">
        <i class="el-icon-arrow-left" />
      </div>
      <div class="node-body-main" @click="$emit('selected')">
        <div class="node-body-main-header">
          <ellipsis class="title" hover-tip :content="config.name ? config.name : ('条件' + level)" />
          <span class="level">优先级{{ level }}</span>
          <span v-if="$store.state.diagramMode !== 'viewer'" class="option">
            <el-tooltip effect="dark" content="复制条件" placement="top">
              <i class="el-icon-copy-document" @click.stop="$emit('copy')" />
            </el-tooltip>
            <i class="el-icon-close" @click.stop="$emit('delNode')" />
          </span>
        </div>
        <div class="node-body-main-content">
          <span v-if="(content || '').trim() === ''" class="placeholder">{{
            level == size && size != 0 ? "其他条件进入此流程" : placeholder
          }}</span>
          <ellipsis v-else hover-tip :row="4" :content="content" />
        </div>
      </div>
      <div
        v-if="level < size && $store.state.diagramMode !== 'viewer'"
        class="node-body-right"
        @click="$emit('rightMove')"
      >
        <i class="el-icon-arrow-right" />
      </div>
      <div v-if="showError" class="node-error">
        <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
          <i class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
    </div>
    <div class="node-footer">
      <div class="btn">
        <insert-button
          v-if="$store.state.diagramMode !== 'viewer'"
          @insertNode="type => $emit('insertNode', type)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/components/60_bpm/common/InsertButton.vue'
import { ValueType } from '@/components/60_bpm/common/form/ComponentsConfigExport'
import Ellipsis from '@/components/60_bpm/common/Ellipsis'

const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
export default {
  name: 'ConditionNode',
  components: { InsertButton, Ellipsis },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 索引位置
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
      ValueType,
      groupNames,
      placeholder: '请设置条件',
      errorInfo: '',
      showError: false
    }
  },
  computed: {
    content () {
      const groups = this.config.props.groups
      const confitions = []
      groups.forEach(group => {
        const subConditions = []
        group.conditions.forEach(subCondition => {
          let subConditionStr = ''
          switch (subCondition.valueType) {
            case ValueType.dept:
            case ValueType.user:
              subConditionStr = `${subCondition.title}属于[${String(subCondition.value.map(u => u.name)).replaceAll(',', '. ')}]之一`
              break
            case ValueType.number:
            case ValueType.string:
              subConditionStr = this.getOrdinaryConditionContent(subCondition)
              break
          }
          subConditions.push(subConditionStr)
        })
        // 根据子条件关系构建描述
        const subConditionsStr = String(subConditions)
          .replaceAll(',', subConditions.length > 1
            ? (group.groupType === 'AND' ? ') 且 (' : ') 或 (')
            : (group.groupType === 'AND' ? ' 且 ' : ' 或 '))
        confitions.push(subConditions.length > 1 ? `(${subConditionsStr})` : subConditionsStr)
      })
      // 构建最终描述
      return String(confitions).replaceAll(',', (this.config.props.groupsType === 'AND' ? ' 且 ' : ' 或 '))
    }
  },
  methods: {
    getDefault (val, df) {
      return val && val !== '' ? val : df
    },
    getOrdinaryConditionContent (subCondition) {
      switch (subCondition.compare) {
        case 'IN':
          return `${subCondition.title}为[${String(subCondition.value).replaceAll(',', '、')}]中之一`
        case 'B':
          return `${subCondition.value[0]} < ${subCondition.title} < ${subCondition.value[1]}`
        case 'AB':
          return `${subCondition.value[0]} ≤ ${subCondition.title} < ${subCondition.value[1]}`
        case 'BA':
          return `${subCondition.value[0]} < ${subCondition.title} ≤ ${subCondition.value[1]}`
        case 'ABA':
          return `${subCondition.value[0]} ≤ ${subCondition.title} ≤ ${subCondition.value[1]}`
        case '<=':
          return `${subCondition.title} ≤ ${this.getDefault(subCondition.value[0], ' ?')}`
        case '>=':
          return `${subCondition.title} ≥ ${this.getDefault(subCondition.value[0], ' ?')}`
        default:
          return `${subCondition.title}${subCondition.compare}${this.getDefault(subCondition.value[0], ' ?')}`
      }
    },
    // 校验数据配置的合法性
    validate (err) {
      console.log('condition children', this.config.children)
      if (!(this.level === this.size && this.size !== 0) && !this.config.children?.id) {
        this.showError = true
        this.errorInfo = '条件分支后不能为空'
        err.push(`条件分支后不能为空`)
        return !this.showError
      }

      const props = this.config.props
      if (props.groups.length <= 0) {
        this.showError = true
        this.errorInfo = '请设置分支条件'
        err.push(`${this.config.name} 未设置条件`)
      } else {
        if (!(this.level === this.size && this.size !== 0)) {
          for (let i = 0; i < props.groups.length; i++) {
            if (props.groups[i].cids.length === 0) {
              this.showError = true
              this.errorInfo = `请设置条件组${this.groupNames[i]}内的条件`
              err.push(`条件 ${this.config.name} 条件组${this.groupNames[i]}内未设置条件`)
              break
            } else {
              const conditions = props.groups[i].conditions
              for (let ci = 0; ci < conditions.length; ci++) {
                const subc = conditions[ci]
                if (subc.value.length === 0) {
                  this.showError = true
                } else {
                  this.showError = false
                }
                if (this.showError) {
                  this.errorInfo = `请完善条件组${this.groupNames[i]}内的${subc.title}条件`
                  err.push(`条件 ${this.config.name} 条件组${this.groupNames[i]}内${subc.title}条件未完善`)
                  return false
                }
              }
            }
          }
        }
      }
      return !this.showError
    }
  }
}
</script>

<style lang="less" scoped>

.node-error-state {
  .node-body {
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}

.node {
  padding: 30px 55px 0;
  width: 220px;
  box-sizing: content-box;
  .node-body {
    cursor: pointer;
    min-height: 80px;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;

    &:hover {
      .node-body-left, .node-body-right {
        i {
          display: block !important;
        }
      }

      .node-body-main {
        .level {
          display: none !important;
        }

        .option {
          display: inline-block !important;
        }
      }

      box-shadow: 0px 0px 3px 0px #1890FF;
    }

    .node-body-left, .node-body-right {
      display: flex;
      align-items: center;
      position: absolute;
      height: 100%;

      i {
        display: none;
      }

      &:hover {
        background-color: #ececec;
      }
    }

    .node-body-left {
      left: 0;
    }

    .node-body-right {
      right: 0;
      top: 0;
    }

    .node-body-main {
      //position: absolute;
      width: 188px;
      margin-left: 17px;
      display: inline-block;

      .node-body-main-header {
        padding: 10px 0px 5px;
        font-size: xx-small;
        position: relative;

        .title {
          color: #15bca3;
          display: inline-block;
          height: 14px;
          width: 125px;
        }

        .level {
          position: absolute;
          right: 15px;
          color: #888888;
        }

        .option {
          position: absolute;
          right: 0;
          display: none;
          font-size: medium;

          i {
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

        .placeholder {
          color: #8c8c8c;
        }
      }
    }

    .node-error {
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer {
    position: relative;

    .btn {
      width: 100%;
      display: flex;
      height: 70px;
      padding: 20px 0 32px;
      justify-content: center;
    }

    /deep/ .el-button {
      height: 32px;
    }

    &::before {
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
