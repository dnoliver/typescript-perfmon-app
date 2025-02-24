<template>
  <div>
    <h1>Metrics</h1>
    <div v-if="cpuTotalUsagePercentage" class="metrics-container">
      <label for="cpu-usage" >{{ metricsLabels.cpuUsage }}</label>
      <div>
        <progress id="cpu-usage" :value="getLastValue(cpuTotalUsagePercentage)" max="100">
          {{ getLastValue(cpuTotalUsagePercentage) }}%
        </progress>
        <div>
          {{ getLastValue(cpuTotalUsagePercentage) }}%
        </div>
      </div>
    </div>
    <div v-if="memoryTotalUsagePercentage" class="metrics-container">
      <label for="memory-usage" >{{ metricsLabels.memoryUsage }}</label>
      <div >
        <progress id="memory-usage" :value="getLastValue(memoryTotalUsagePercentage)" max="100">
        {{ getLastValue(memoryTotalUsagePercentage) }}%
        </progress>
        <div>
        {{ getLastValue(memoryTotalUsagePercentage) }}%
        </div>
      </div>
    </div>
    <div v-if="gpuDedicatedMemoryPercentage" class="metrics-container">
      <label for="gpu-dedicated-memory" >{{ metricsLabels.gpuDedicatedMemoryUsage }}</label>
      <div >
        <progress id="gpu-dedicated-memory" :value="getLastValue(gpuDedicatedMemoryPercentage)" max="100">
        {{ getLastValue(gpuDedicatedMemoryPercentage) }}%
        </progress>
        <div>
        {{ getLastValue(gpuDedicatedMemoryPercentage) }}%
        </div>
      </div>
    </div>
    <div v-if="gpuCopyUsagePercentage" class="metrics-container">
      <label for="gpu-copy-usage" >{{ metricsLabels.gpuCopyUsage }}</label>
      <div >
        <progress id="gpu-copy-usage" :value="getLastValue(gpuCopyUsagePercentage)" max="100">
        {{ getLastValue(gpuCopyUsagePercentage) }}%
        </progress>
        <div>
        {{ getLastValue(gpuCopyUsagePercentage) }}%
        </div>
      </div>
    </div>
    <div v-if="gpuComputeUsagePercentage" class="metrics-container">
      <label for="gpu-compute-usage" >{{ metricsLabels.gpuComputeUsage }}</label>
      <div >
        <progress id="gpu-compute-usage" :value="getLastValue(gpuComputeUsagePercentage)" max="100">
        {{ getLastValue(gpuComputeUsagePercentage) }}%
        </progress>
        <div>
        {{ getLastValue(gpuComputeUsagePercentage) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Metrics {
  cpu_usage_percent: number;
  memory_usage_percent: number;
  gpu_dedicated_memory_percent: number;
  gpu_copy_usage_percent: number;
  gpu_compute_usage_percent: number;
}

const metricsLabels = {
  cpuUsage: 'CPU Utilization',
  memoryUsage: 'Memory Utilization',
  gpuDedicatedMemoryUsage: 'GPU Dedicated Memory Utilization',
  gpuCopyUsage: 'GPU Copy Engine Utilization',
  gpuComputeUsage: 'GPU Compute Engine Utilization',
}

const cpuTotalUsagePercentage = ref<number[]>([])
const memoryTotalUsagePercentage = ref<number[]>([])
const gpuDedicatedMemoryPercentage = ref<number[]>([])
const gpuCopyUsagePercentage = ref<number[]>([])
const gpuComputeUsagePercentage = ref<number[]>([])

const getLastValue = (metric: number[]): number => {
  return metric[metric.length - 1]
}

window.ipcRenderer.on('metrics-data', (_, metrics: Metrics) => {
  // Save the metrics values
  cpuTotalUsagePercentage.value.push(metrics.cpu_usage_percent);
  memoryTotalUsagePercentage.value.push(metrics.memory_usage_percent);
  gpuDedicatedMemoryPercentage.value.push(metrics.gpu_dedicated_memory_percent);
  gpuCopyUsagePercentage.value.push(metrics.gpu_copy_usage_percent);
  gpuComputeUsagePercentage.value.push(metrics.gpu_compute_usage_percent);

  // Keep only the last 50 values
  [
    cpuTotalUsagePercentage,
    memoryTotalUsagePercentage,
    gpuDedicatedMemoryPercentage,
    gpuCopyUsagePercentage,
    gpuComputeUsagePercentage
  ].forEach(metric => {
    if (metric.value.length > 50) {
      metric.value.shift()
    }
  })
});

</script>

<style scoped>
.metrics-container {
  margin-top: 10px;
  display: flex;
}

.metrics-container > label {
  width: 25%;
}

.metrics-container > div {
  width: 75%;
  margin-left: 10px;
}

.metrics-container > div > progress {
  width: 100%;
  transform: translateY(50%);
}

.metrics-container > div > div {
  transform: translateY(-63%);
  color: white;
}

.metrics-container progress {
  height: 30px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>