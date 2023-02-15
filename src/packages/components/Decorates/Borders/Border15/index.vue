<template>
  <div class="go-border-box" :style="{display:'flex',flexDirection:'column'}">
    <img src="./img/border2.png" :style="{width:`${w}px`,height:`${h}px`, backgroundColor:`${backgroundColor}`}" >
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue'
import { CreateComponentType } from '@/packages/index.d'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { w, h } = toRefs(props.chartConfig.attr)
const { colors, backgroundColor } = toRefs(props.chartConfig.option)
</script>

<style lang="scss" scoped>
@include go('border-box') {
  polyline {
    fill: none;
  }
}
</style>
