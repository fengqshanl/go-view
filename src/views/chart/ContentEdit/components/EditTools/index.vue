<template>
  <div
    class="go-chart-edit-tools"
    :class="[settingStore.getChartToolsStatus, isMiniComputed ? 'isMini' : 'unMini']"
    @click="isMini && (isMini = false)"
    @mouseenter="toolsMouseoverHandle"
    @mouseleave="toolsMouseoutHandle"
  >
    <!-- PawIcon -->
    <n-icon
      v-show="settingStore.getChartToolsStatus === ToolsStatusEnum.ASIDE && isMiniComputed"
      class="asideLogo"
      size="22"
    >
      <PawIcon></PawIcon>
    </n-icon>

    <n-tooltip
      v-for="(item, index) in btnListComputed"
      :key="item.key"
      :disabled="!isAside || (isHide && asideTootipDis)"
      trigger="hover"
      placement="left"
    >
      <template #trigger>
        <div class="btn-item">
          <n-button v-if="item.type === TypeEnum.BUTTON" :circle="isAside" secondary @click="item.handle">
            <template #icon>
              <n-icon size="22" v-if="isAside">
                <component :is="item.icon"></component>
              </n-icon>
              <component v-else :is="item.icon"></component>
            </template>
            <n-text depth="3" v-show="!isAside">{{ item.name }}</n-text>
          </n-button>
          <!-- 下载 -->
          <n-upload
            v-else-if="item.type === TypeEnum.IMPORTUPLOAD"
            v-model:file-list="importUploadFileListRef"
            :show-file-list="false"
            :customRequest="importCustomRequest"
            @before-upload="importBeforeUpload"
          >
            <n-button :circle="isAside" secondary>
              <template #icon>
                <n-icon size="22" v-if="isAside">
                  <component :is="item.icon"></component>
                </n-icon>
                <component v-else :is="item.icon"></component>
              </template>
              <n-text depth="3" v-show="!isAside">{{ item.name }}</n-text>
            </n-button>
          </n-upload>
        </div>
      </template>
      <!-- 提示 -->
      <span>{{ item.name }}</span>
    </n-tooltip>
  </div>
  <!-- 系统设置 model -->
  <go-system-set v-model:modelShow="globalSettingModel"></go-system-set>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useSettingStore } from '@/store/modules/settingStore/settingStore'
import { ToolsStatusEnum } from '@/store/modules/settingStore/settingStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { fetchPathByName, routerTurnByPath, setSessionStorage, getLocalStorage } from '@/utils'
import { editToJsonInterval } from '@/settings/designSetting'
import { EditEnum, ChartEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useRoute } from 'vue-router'
import { useSync } from '@/views/chart/hooks/useSync.hook'
import { SavePageEnum } from '@/enums/editPageEnum'
import { GoSystemSet } from '@/components/GoSystemSet/index'
import { exportHandle } from './utils'
import { useFile } from './hooks/useFile.hooks'
import { BtnListType, TypeEnum } from './index.d'
import { icon } from '@/plugins'

const { DownloadIcon, ShareIcon, PawIcon, SettingsSharpIcon, CreateIcon } = icon.ionicons5
const settingStore = useSettingStore()
const chartEditStore = useChartEditStore()
const routerParamsInfo = useRoute()
const { updateComponent } = useSync()

// 鼠标悬停定时器
let mouseTime: any = null
// 系统设置 model
const globalSettingModel = ref(false)
// 最小化
const isMini = ref<boolean>(true)
// 控制 tootip 提示时机
const asideTootipDis = ref(true)
// 文件上传
const { importUploadFileListRef, importCustomRequest, importBeforeUpload } = useFile()

// 是否是侧边栏
const isAside = computed(() => settingStore.getChartToolsStatus === ToolsStatusEnum.ASIDE)

// 是否隐藏（悬浮展示）
const isHide = computed(() => settingStore.getChartToolsStatusHide)

// 是否展示最小化（与全局配置相关）
const isMiniComputed = computed(() => isMini.value && isHide.value)

// 页面渲染配置
const btnListComputed = computed(() => {
  if (!isAside.value) return btnList
  const reverseArr: BtnListType[] = []
  btnList.map(item => {
    reverseArr.unshift(item)
  })
  return reverseArr
})

// 鼠标移入
const toolsMouseoverHandle = () => {
  mouseTime = setTimeout(() => {
    if (isMini.value) {
      isMini.value = false
      asideTootipDis.value = true
    }
  }, 200)
  setTimeout(() => {
    asideTootipDis.value = false
  }, 400)
}

// 鼠标移出
const toolsMouseoutHandle = () => {
  clearTimeout(mouseTime)
  if (!isMini.value) {
    isMini.value = true
  }
}

// 编辑处理
const editHandle = () => {
  window['$message'].warning('将开启失焦更新与 5 秒同步更新！')
  setTimeout(() => {
    // 获取id路径
    const path = fetchPathByName(EditEnum.CHART_EDIT_NAME, 'href')
    if (!path) return
    let { id } = routerParamsInfo.params as any
    id = typeof id === 'string' ? id : id[0]
    updateToSession(id)
    routerTurnByPath(path, [id], undefined, true)
  }, 1000)
}

// 把内存中的数据同步到SessionStorage 便于传递给新窗口初始化数据
const updateToSession = (id: string) => {
  const storageInfo = chartEditStore.getStorageInfo
  const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  if (sessionStorageInfo?.length) {
    const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === id)
    // 重复替换
    if (repeateIndex !== -1) {
      sessionStorageInfo.splice(repeateIndex, 1, { ...storageInfo, id })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    } else {
      sessionStorageInfo.push({ ...storageInfo, id })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    }
  } else {
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ ...storageInfo, id }])
  }
}

// 侦听器更新
const useSyncUpdate = () => {
  // 定义侦听器变量
  let timer: any
  const updateFn = (e: any) => updateComponent(e!.detail, true, false)
  const syncData = () => {
    if (routerParamsInfo.name == ChartEnum.CHART_HOME_NAME) {
      dispatchEvent(new CustomEvent(SavePageEnum.CHART, { detail: chartEditStore.getStorageInfo }))
    }
  }

  // 开启侦听
  const use = () => {
    // 1、定时同步数据
    // timer = setInterval(() => {
      // 窗口激活并且处于工作台
      document.hasFocus() && syncData()
    // }, editToJsonInterval)
    // 2、失焦同步数据
    addEventListener('blur', syncData)

    // 【监听JSON代码 刷新工作台图表】
    addEventListener(SavePageEnum.JSON, updateFn)
  }

  // 关闭侦听
  const unUse = () => {
    clearInterval(timer)
    removeEventListener(SavePageEnum.JSON, updateFn)
    removeEventListener('blur', syncData)
  }

  // 路由变更时处理
  const watchHandler = (toName: any, fromName: any) => {
    if (fromName == ChartEnum.CHART_HOME_NAME) {
      unUse()
    }
    if (toName == ChartEnum.CHART_HOME_NAME) {
      use()
    }
  }
  return watchHandler
}

watch(() => routerParamsInfo.name, useSyncUpdate(), { immediate: true })

// 配置列表
const btnList: BtnListType[] = [
  {
    key: 'export',
    type: TypeEnum.BUTTON,
    name: '导出',
    icon: ShareIcon,
    handle: exportHandle
  },
  {
    key: 'import',
    type: TypeEnum.IMPORTUPLOAD,
    name: '导入',
    icon: DownloadIcon
  },
  {
    key: 'edit',
    type: TypeEnum.BUTTON,
    name: '编辑JSON',
    icon: CreateIcon,
    handle: editHandle
  },
  {
    key: 'setting',
    type: TypeEnum.BUTTON,
    name: '设置',
    icon: SettingsSharpIcon,
    handle: () => {
      globalSettingModel.value = true
    }
  }
]
</script>

<style lang="scss" scoped>
/* 底部区域的高度 */
$dockHeight: 30px;
$dockBottom: 60px;
$dockMiniWidth: 200px;
$dockMiniBottom: 53px;

$asideHeight: 130px;
$asideMiniHeight: 22px;
$asideBottom: 70px;

@include go('chart-edit-tools') {
  @extend .go-background-filter;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 25px;
  border: 1px solid;
  @include fetch-border-color('hover-border-color-shallow');
  &.aside {
    flex-direction: column-reverse;
    height: auto;
    right: 20px;
    padding: 30px 8px;
    bottom: $asideBottom;
    overflow: hidden;
    transition: height ease 0.4s;
    .btn-item {
      margin-bottom: 10px;
      &:first-of-type {
        margin-bottom: 0;
      }
      @include deep() {
        .n-button__icon {
          margin-right: 0;
          margin-left: 0;
          margin-bottom: 12px;
        }
      }
    }
    &.unMini {
      animation: aside-in 0.4s ease forwards;
      @keyframes aside-in {
        0% {
          opacity: 0.5;
          height: $asideMiniHeight;
        }
        100% {
          height: $asideHeight;
          opacity: 1;
        }
      }
      .btn-item {
        position: relative;
        display: block;
      }
      .asideLogo {
        opacity: 0.4;
      }
    }
    &.isMini {
      cursor: pointer;
      padding: 13px 13px;
      background-color: var(--n-toggle-bar-color);
      animation: aside-mini-in 0.4s ease forwards;
      @keyframes aside-mini-in {
        0% {
          opacity: 0.5;
          height: $asideHeight;
        }
        100% {
          opacity: 1;
          height: $asideMiniHeight;
        }
      }
      .btn-item {
        position: relative;
        display: none;
      }
      .asideLogo {
        opacity: 1;
      }
    }
  }

  &.dock {
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    .btn-item {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    &.unMini {
      animation: dock-in 0.4s ease forwards;
      @keyframes dock-in {
        0% {
          opacity: 0;
          height: 0;
          padding: 5px;
          bottom: $dockMiniBottom;
        }
        100% {
          height: $dockHeight;
          padding: 8px 30px;
          bottom: $dockBottom;
          border-radius: 25px;
        }
      }
    }
    /* 最小化 */
    &.isMini {
      height: 0;
      width: $dockMiniWidth;
      bottom: $dockMiniBottom;
      padding: 5px;
      border-radius: 8px;
      cursor: pointer;
      border: 0px;
      animation: dock-mini-in 1s ease forwards;
      @keyframes dock-mini-in {
        0% {
          opacity: 1;
          height: $dockHeight;
          padding: 8px 30px;
          bottom: $dockBottom;
          border-radius: 25px;
        }
        20% {
          height: 0;
          border-radius: 8px;
        }
        50% {
          opacity: 0;
          bottom: calc(#{$dockMiniBottom} - 10px);
        }
        100% {
          opacity: 1;
          height: 0;
          padding: 5px;
          bottom: $dockMiniBottom;
        }
      }
      .btn-item {
        position: relative;
        bottom: -50px;
        display: none;
      }
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 20px;
      bottom: -20px;
      cursor: pointer;
    }
  }
}
</style>
