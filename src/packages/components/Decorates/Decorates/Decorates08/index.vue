<template>
  <div class="go-border-08" :style="{display:'flex',flexDirection:'column'}" >
  <div :style="{display:'flex',width:`${w}px`,flexDirection:'row',justifyContent:`start`,backgroundColor:`${colors[1]}`,borderRadius:'2px',height:`${h}`}">
    <div :style="{ height:`100%`,width:`${lineWidth || 8}px`,borderRadius:'2px',backgroundColor:`${colors[0]}`}" /> 
    <span class="text" :id="`${id}`"  :style="{ display: 'flex', paddingLeft:'7px',alignItems:'center'}">{{ dataset }}</span>
  </div>
    <div :style="{width:`${w}px`, height: '1px', backgroundColor:`${colors[2]}`, marginTop:'7px'}" />
  </div>
</template>

<script setup lang="ts">
import { PropType, toRaw, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { getUUID, isPreview, newFunctionHandle } from '@/utils'
import { borderRadius } from '@/settings/designSetting';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { customizeHttp } from '@/api/http';
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const id = getUUID()
const { w, h } = toRefs(props.chartConfig.attr)
const { colors, dataset, textSize, textColor, lineWidth } = toRefs(props.chartConfig.option)

let decoratesFetchInterval: any
  const requestIntervalFn = () => {
    const chartEditStore = useChartEditStore()

    // 全局数据
    const {
      requestOriginUrl,
      requestIntervalUnit: globalUnit,
      requestInterval: globalRequestInterval
    } = toRefs(chartEditStore.getRequestGlobalConfig)
// 目标组件
    const {
      requestDataType,
      requestUrl,
      requestIntervalUnit: targetUnit,
      requestInterval: targetInterval
    } = props.chartConfig.request

    try {
      // 处理地址
      // @ts-ignore
      if (requestUrl) {
        // requestOriginUrl 允许为空
        // const completePath = requestOriginUrl && requestOriginUrl.value + requestUrl
        // if (!completePath) return

        clearInterval(decoratesFetchInterval)

        const fetchFn = async () => {
          const res = await customizeHttp(toRaw(props.chartConfig.request), toRaw(chartEditStore.requestGlobalConfig))
          if (res) {
            try {
              const filter = props.chartConfig.filter          
              let data = newFunctionHandle(res?.data, res, filter) 
              const dom = document.getElementById(id)
              if (dom && dom.innerHTML != data) {
                dom.innerHTML = data
              }
            } catch (error) {
              console.error(error)
            }
          }
        }

        // 立即调用
        fetchFn()

        // 定时时间
        const time = globalRequestInterval.value
        // 单位
        const unit = globalUnit.value
        // 开启轮询
        // if (time) {
        //   decoratesFetchInterval = setInterval(fetchFn, intervalUnitHandle(time, unit))
        // }
      }
      // eslint-disable-next-line no-empty
    } catch (error) {
      console.log(error)
    }
  }

  isPreview() && requestIntervalFn()


</script>

<style lang="scss" scoped>
@include go('border-08') {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: absolute;
    z-index: -1;
  }

  .fill {
    fill: v-bind('colors[0]');
  }
  .fill-none {
    fill: none;
  }
  .stroke {
    stroke: v-bind('colors[1]');
  }

  .text {
    color: v-bind('textColor');
    font-size: v-bind('textSize+"px"');
  }
}
</style>
