<template>
  <div class="go-border-box" :style="{display:'flex',flexDirection:'column',backgroundColor:`${backgroundColor}`}">
    <div :style="{display:'flex',justifyContent:'start'}">
      <img src="./img/lt.png" :style="{width:`${(w > h ? h : w)/3}px`,height:`${(w > h ? h : w)/3}px`}" >
      <img src="./img/row.png" :style="{width:`${w - 2 * ((w > h ? h : w)/3)}px`,height: '2px', marginTop:'2px'}">
      <img src="./img/rt.png" :style="{width:`${(w > h ? h : w)/3}px`,height:`${(w > h ? h : w)/3}px`}">
    </div>
    <div :style="{display:'flex', justifyContent:'space-between'}">
      <img src="./img/column.png" :style="{height:`${h - 2 * ((w > h ? h : w)/3)}px`, width:'2px', marginLeft:'2px'}">
      <img src="./img/column.png" :style="{height:`${h - 2 * ((w > h ? h : w)/3)}px`,width:'2px', marginRight:'2px'}">
    </div> 
    <div>
      <img src="./img/lb.png" :style="{width:`${(w > h ? h : w)/3}px`,height:`${(w > h ? h : w)/3}px`}">
      <img src="./img/row.png" :style="{width:`${w - 2 * ((w > h ? h : w)/3)}px`,height:'2px', marginBottom:'2px'}">
      <img src="./img/rb.png" :style="{width:`${(w > h ? h : w)/3}px`,height:`${(w > h ? h : w)/3}px`}">
    </div> 
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
