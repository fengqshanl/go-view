<template>
  <div :style="`height:${h}px;width:${w}px;display:flex;flexDirection:row;flex-wrap:wrap;justify-content:left;align-items:center`">
    <div
        class="header-item"
        v-for="(chart, i) in chartArray"
        :key="`${i}${(Math.random() * 10000).toFixed(1)}`"
        :style="`
        height: 328px;
        margin-left: 8px;
        width: 346px;
      `"
      >
       <div class="go-border-box" :style="{display:'flex',flexDirection:'column',backgroundColor:'#37774BB2',width:'328px',height:'346px'}">
    <div :style="{display:'flex',justifyContent:'start'}">
      <img src="./img/lt.png" :style="{width:`${328/3}px`,height:`${328/3}px`}" >
      <img src="./img/row.png" :style="{width:`${328/3}px`,height: '2px', marginTop:'7px'}">
      <img src="./img/rt.png" :style="{width:`${328/3}px`,height:`${328/3}px`}">
    </div>
    <div :style="{display:'flex', justifyContent:'space-between'}">
      <img src="./img/column.png" :style="{height:`${346 - 328 * 2 / 3}px`, width:'2px', marginLeft:'7px'}">
      <img src="./img/column.png" :style="{height:`${346 - 328 * 2 / 3}px`,width:'2px', marginRight:'7px'}">
    </div> 
    <div>
      <img src="./img/lb.png" :style="{width:`${328/3}px`,height:`${328/3}px`}">
      <img src="./img/row.png" :style="{width:`${328/3}px`,height:'2px', marginBottom:'7px'}">
      <img src="./img/rb.png" :style="{width:`${328/3}px`,height:`${328/3}px`}">
    </div> 
    </div>
      <v-chart :theme="themeColor" :option="(chart || default_options)" :manual-update="isPreview()" :style="`position:relative;top:-287px;z-index:15;height:278px;width:320px;margin:auto;left:-10px`"></v-chart>
      <div :style="{display:'flex',flexDirection:'column',zIndex:10,position:'relative',top:'-583.5px',left:'40px',margin:'auto'}" >
        <div :style="{display:'flex',width:`245px`,flexDirection:'row',justifyContent:`start`,backgroundColor:`transparent`,borderRadius:'2px',borderBottom:'1px solid #FFFFFF',height:'32px',paddingBottom:'7px'}">
          <div :style="{ height:`100%`,width:`8px`,borderRadius:'2px',backgroundColor:'#41a887'}" /> 
          <span class="text" :style="{ display: 'flex', color:'white',paddingLeft:'7px',fontSize:'20px',alignItems:'center'}">{{title?.[i] || ''}}</span>
        </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch, toRefs } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import config, { default_options } from './config'
const local_data = window.localStorage.getItem("home-share")
const { length, pie_data, title } = local_data ? JSON.parse(local_data) : {length:4,title:[], pie_data: [default_options]}
const chartArray: any[] = new Array(length).fill(0).map((_,n) =>  pie_data?.[n] || default_options)
const props = defineProps({
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

use([DatasetComponent, CanvasRenderer, RadarChart, GridComponent, TooltipComponent, LegendComponent])
const { w, h } = toRefs(props.chartConfig.attr)
  
</script>
