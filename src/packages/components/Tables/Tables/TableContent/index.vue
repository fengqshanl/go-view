<template>
  <div class="go-tables-content" :style="`color: ${textColor}`">
    <div
      class="row-item"
      v-for="(item, i) in status.rows"
      :key="item.toString() + item.scroll"
      :style="`height: ${tableRowHeightNumber}px;margin-bottom:20px`"
    >
      <div class="content-info" :style="`width:192px;display:flex;justify-content:center;align-items:center;font-size:${leftFontSize}px;background-color:${leftColor}`">
        {{item.name}}
      </div>
      <div class="content-column" :style="`width:100%;display:flex;justify-content:start;align-items:center;padding: 0 1em 0 1em;font-size:${rightFontSize || 22}px;background-color:${rightColor}`">
        <span class="content-column-font">
          {{item.value}}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, onUnmounted, reactive, toRefs, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const { w, h } = toRefs(props.chartConfig.attr)
const { rowNum, unit, leftColor, textColor, rightColor,tableRowHeightNumber, indexFontSize, leftFontSize, rightFontSize } = toRefs(
  props.chartConfig.option
)

const status = reactive({
  mergedConfig: props.chartConfig.option,
  rowsData: [],
  rows: [
    {
      scroll: 0,
      ranking: 1,
      name: '',
      value: '',
      percent: 0
    }
  ],
  heights: [0],
  animationIndex: 0,
  animationHandler: 0,
  updater: 0,
  avgHeight: 0
})
const calcRowsData = () => {
  let { dataset, rowNum, sort } = status.mergedConfig
  // @ts-ignore
  sort && dataset.sort(({ value: a }, { value: b }) => {
      if (a > b) return -1
      if (a < b) return 1
      if (a === b) return 0
    })
  // @ts-ignore
  const value = dataset.map(({ value }) => value)
  const min = Math.min(...value) || 0
  // abs of min
  const minAbs = Math.abs(min)
  const max = Math.max(...value) || 0
  // abs of max
  const maxAbs = Math.abs(max)
  const total = max + minAbs
  dataset = dataset.map((row: any, i: number) => ({
    ...row,
    ranking: i + 1,
    percent: ((row.value + minAbs) / total) * 100
  }))
  const rowLength = dataset.length
  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    dataset = [...dataset, ...dataset]
  }
  dataset = dataset.map((d: any, i: number) => ({ ...d, scroll: i }))
  status.rowsData = dataset
  status.rows = dataset
}

const calcHeights = (onresize = false) => {
  const { rowNum, dataset } = status.mergedConfig
  const avgHeight = h.value / rowNum
  status.avgHeight = avgHeight
  if (!onresize) status.heights = new Array(dataset.length).fill(avgHeight)
}

const animation = async (start = false) => {
  let { avgHeight, animationIndex, mergedConfig, rowsData, updater } = status
  const { waitTime, carousel, rowNum } = mergedConfig
  const rowLength = rowsData.length
  if (rowNum >= rowLength) return
  if (start) {
    await new Promise(resolve => setTimeout(resolve, waitTime))
    if (updater !== status.updater) return
  }
  const animationNum = carousel === 'single' ? 1 : rowNum
  let rows = rowsData.slice(animationIndex)
  rows.push(...rowsData.slice(0, animationIndex))
  status.rows = rows.slice(0, rowNum + 1)
  status.heights = new Array(rowLength).fill(avgHeight)
  await new Promise(resolve => setTimeout(resolve, 300))
  if (updater !== status.updater) return
  status.heights.splice(0, animationNum, ...new Array(animationNum).fill(0))
  animationIndex += animationNum
  const back = animationIndex - rowLength
  if (back >= 0) animationIndex = back

  status.animationIndex = animationIndex
  status.animationHandler = setTimeout(animation, waitTime * 1000 - 300) as any
}

const stopAnimation = () => {
  status.updater = (status.updater + 1) % 999999
  if (!status.animationHandler) return
  clearTimeout(status.animationHandler)
}

const onRestart = async () => {
  try {
    if (!status.mergedConfig) return
    stopAnimation()
    calcRowsData()
    calcHeights(true)
    animation(true)
  } catch (error) {
    console.log(error)
  }
}

onRestart()

watch(
  () => w.value,
  () => {
    onRestart()
  }
)

watch(
  () => h.value,
  () => {
    onRestart()
  }
)

watch(
  () => rowNum.value,
  () => {
    onRestart()
  }
)

// 数据更新（配置时触发）
watch(
  () => props.chartConfig.option.dataset,
  () => {
    onRestart()
  },
  {
    deep: false
  }
)

// 数据callback处理（预览时触发）
useChartDataFetch(props.chartConfig, useChartEditStore, (resData: any[]) => {
  props.chartConfig.option.dataset = resData
  onRestart()
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style lang="scss" scoped>
@include go('tables-content') {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .row-item {
    transition: all 0.3s;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .content-info {
    display: flex;
    font-size: 13px;
    align-items: center;
  }

  .content-column {
    margin-left: 14px;
    overflow: hidden;
  }
   .content-column-font {
    flex-wrap: nowrap;
    white-space: nowrap;
    word-break: keep-all;
    width: 2000px;
    &:hover{
      animation: 20s wordsLoop linear infinite normal;
    }
  }
  @keyframes wordsLoop {
    0% {
      transform: translateX(0%);
      -webkit-transform: translateX(0%);
    }
    100%{
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
  }
  @-webkit-keyframes wordsLoop{
    0%{
      transform: translateX(0%);
      -webkit-transform: translateX(0%);
    }
    100%{
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
  }
}
</style>
