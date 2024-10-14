<template>
  <div class="sk-cube-grid" :style="style">
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
    <div class="sk-cube"></div>
  </div>
</template>
<script lang="ts" setup>
import { addUnit } from "element-plus/es/utils/dom/style";

const { size = 40, color = "#333" } = defineProps<{
  size?: number | string;
  color?: string;
}>();

const style = computed(() => {
  return {
    "--width": addUnit(size),
    "--color": color,
  };
});
</script>
<style lang="scss" scoped>
.sk-cube-grid {
  width: var(--width, 40px);
  height: var(--width, 40px);
  display: inline-flex;
  flex-wrap: wrap;
  color: var(--color);
  .sk-cube {
    width: calc(100% / 3);
    height: calc(100% / 3);
    background-color: currentColor;
    animation: sk-cube-grid-scale-delay 1.8s infinite ease-in-out;
    --animation-delay: 0.2s;
    animation-delay: var(--animation-delay);
    border: 0;
    margin: 0;
    padding: 0;

    @for $i from 1 through 3 {
      @for $j from 1 through 3 {
        &:nth-child(#{($i - 1) * 3 + $j}) {
          $time: 0.1s + ($j - $i + 1) * 0.1;
          --animation-delay: #{$time};
        }
      }
    }
  }
}

@keyframes sk-cube-grid-scale-delay {
  0%,
  70%,
  100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  }
}
</style>
