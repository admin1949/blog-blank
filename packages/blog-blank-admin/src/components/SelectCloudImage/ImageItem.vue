<template>
  <div class="image-box">
    <ElImage class="w-full h-full" fit="contain" :src="src" lazy>
      <template #placeholder>
        <div class="w-full h-full flex items-center justify-center">
          <SkCubeGridLoading :size="40"></SkCubeGridLoading>
        </div>
      </template>
    </ElImage>
    <div v-if="selected" class="selected-tips">
      <ElIcon color="#fff" :size="12" class="icon">
        <Select></Select>
      </ElIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Select } from "@element-plus/icons-vue";

defineProps<{
  src: string;
  selected?: boolean;
}>();
</script>

<style lang="scss" scoped>
.image-box {
  width: var(--el-upload-picture-card-size, 148px);
  height: var(--el-upload-picture-card-size, 148px);
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
  background-color: var(--el-fill-color-blank);
  overflow: hidden;
  border-radius: 6px;
  position: relative;
  .selected-tips {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: var(--el-color-success);
    text-align: center;
    transform: rotate(45deg);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    .icon {
      box-sizing: border-box;
      display: block;
      margin-top: 11px;
      transform: rotate(-45deg);
    }
  }
}
</style>
