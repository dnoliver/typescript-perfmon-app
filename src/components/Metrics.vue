<template>
  <div>
    <h1>Metrics</h1>
    <!-- CPU Metrics -->
    <div v-if="cpuTotalUsagePercentage.length" class="metrics-container" @click="toggleView('cpu')">
      <label v-if="cpuTotalUsageViewToggle" for="cpu-usage">{{ metricsLabels.cpuUsage }}</label>
      <div v-if="cpuTotalUsageViewToggle">
        <progress id="cpu-usage" :value="getLastValue(cpuTotalUsagePercentage)" max="100">
          {{ getLastValue(cpuTotalUsagePercentage) }}%
        </progress>
        <div>
          {{ getLastValue(cpuTotalUsagePercentage) }}%
        </div>
      </div>
      <Line v-if="!cpuTotalUsageViewToggle" :options="globalChartOptions" :data="cpuTotalUsageChartData" />
    </div>

    <!-- Memory Metrics -->
    <div v-if="memoryTotalUsagePercentage.length" class="metrics-container" @click="toggleView('memory')">
      <label v-if="memoryTotalUsageViewToggle" for="memory-usage">{{ metricsLabels.memoryUsage }}</label>
      <div v-if="memoryTotalUsageViewToggle">
        <progress id="memory-usage" :value="getLastValue(memoryTotalUsagePercentage)" max="100">
          {{ getLastValue(memoryTotalUsagePercentage) }}%
        </progress>
        <div>
          {{ getLastValue(memoryTotalUsagePercentage) }}%
        </div>
      </div>
      <Line v-if="!memoryTotalUsageViewToggle" :options="globalChartOptions" :data="memoryTotalUsageChartData" />
    </div>

    <!-- GPU Memory Metrics -->
    <div v-if="gpuDedicatedMemoryPercentage.length" class="metrics-container" @click="toggleView('gpuDedicatedMemory')">
      <label v-if="gpuDedicatedMemoryViewToggle" for="gpu-dedicated-memory">{{ metricsLabels.gpuDedicatedMemoryUsage
      }}</label>
      <div v-if="gpuDedicatedMemoryViewToggle">
        <progress id="gpu-dedicated-memory" :value="getLastValue(gpuDedicatedMemoryPercentage)" max="100">
          {{ getLastValue(gpuDedicatedMemoryPercentage) }}%
        </progress>
        <div>
          {{ getLastValue(gpuDedicatedMemoryPercentage) }}%
        </div>
      </div>
      <Line v-if="!gpuDedicatedMemoryViewToggle" :options="globalChartOptions" :data="gpuDedicatedMemoryChartData" />
    </div>

    <!-- GPU Copy Usage Metrics -->
    <div v-if="gpuCopyUsagePercentage.length" class="metrics-container" @click="toggleView('gpuCopyUsage')">
      <label v-if="gpuCopyUsageViewToggle" for="gpu-copy-usage">{{ metricsLabels.gpuCopyUsage }}</label>
      <div v-if="gpuCopyUsageViewToggle">
        <progress id="gpu-copy-usage" :value="getLastValue(gpuCopyUsagePercentage)" max="100">
          {{ getLastValue(gpuCopyUsagePercentage) }}%
        </progress>
        <div>
          {{ getLastValue(gpuCopyUsagePercentage) }}%
        </div>
      </div>
      <Line v-if="!gpuCopyUsageViewToggle" :options="globalChartOptions" :data="gpuCopyUsageChartData" />
    </div>

    <!-- GPU Compute Usage Metrics -->
    <div v-if="gpuComputeUsagePercentage.length" class="metrics-container" @click="toggleView('gpuComputeUsage')">
      <label v-if="gpuComputeUsageViewToggle" for="gpu-compute-usage">{{ metricsLabels.gpuComputeUsage }}</label>
      <div v-if="gpuComputeUsageViewToggle">
        <progress id="gpu-compute-usage" :value="getLastValue(gpuComputeUsagePercentage)" max="100">
          {{ getLastValue(gpuComputeUsagePercentage) }}%
        </progress>
        <div>
          {{ getLastValue(gpuComputeUsagePercentage) }}%
        </div>
      </div>
      <Line v-if="!gpuComputeUsageViewToggle" :options="globalChartOptions" :data="gpuComputeUsageChartData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ChartData 
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface Metrics {
  cpu_usage_percent: number;
  memory_usage_percent: number;
  gpu_dedicated_memory_percent: number;
  gpu_copy_usage_percent: number;
  gpu_compute_usage_percent: number;
  epoch: number;
}

const metricsLabels = {
  cpuUsage: 'CPU Utilization',
  memoryUsage: 'Memory Utilization',
  gpuDedicatedMemoryUsage: 'GPU Dedicated Memory Utilization',
  gpuCopyUsage: 'GPU Copy Engine Utilization',
  gpuComputeUsage: 'GPU Compute Engine Utilization',
}

// Epocs are the x-axis of the charts
const epochs = ref<number[]>([])

// Global chart options
const globalChartOptions = ref<object>({
  scales: {
    y: {
      min: 0,
      max: 100
    }
  }
})

// CPU Usage Data
const cpuTotalUsagePercentage = ref<number[]>([])
const cpuTotalUsageChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
})
const cpuTotalUsageViewToggle = ref(true)

// Memory Usage Data
const memoryTotalUsagePercentage = ref<number[]>([])
const memoryTotalUsageChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
})
const memoryTotalUsageViewToggle = ref(true)

// GPU Dedicated Memory Data
const gpuDedicatedMemoryPercentage = ref<number[]>([])
const gpuDedicatedMemoryChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
})
const gpuDedicatedMemoryViewToggle = ref(true)

// GPU Copy Usage Data
const gpuCopyUsagePercentage = ref<number[]>([])
const gpuCopyUsageChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
})
const gpuComputeUsageViewToggle = ref(true)

// GPU Compute Usage Data
const gpuComputeUsagePercentage = ref<number[]>([])
const gpuComputeUsageChartData = ref<ChartData<'line'>>({
  datasets: [],
  labels: []
})
const gpuCopyUsageViewToggle = ref(true)

// Get the last value of a metric
const getLastValue = (metric: number[]): number => {
  return metric[metric.length - 1]
}

// Toggle the view of a metric
const toggleView = (targetView: string) => {
  switch (targetView) {
    case 'cpu':
      cpuTotalUsageViewToggle.value = !cpuTotalUsageViewToggle.value
      break
    case 'memory':
      memoryTotalUsageViewToggle.value = !memoryTotalUsageViewToggle.value
      break
    case 'gpuDedicatedMemory':
      gpuDedicatedMemoryViewToggle.value = !gpuDedicatedMemoryViewToggle.value
      break
    case 'gpuCopyUsage':
      gpuCopyUsageViewToggle.value = !gpuCopyUsageViewToggle.value
      break
    case 'gpuComputeUsage':
      gpuComputeUsageViewToggle.value = !gpuComputeUsageViewToggle.value
      break
  }
}

// Format a the timestamp
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// Subscribe to the metrics-data event
window.ipcRenderer.on('metrics-data', (_, metrics: Metrics) => {

  // Save the metrics values
  cpuTotalUsagePercentage.value.push(metrics.cpu_usage_percent);
  memoryTotalUsagePercentage.value.push(metrics.memory_usage_percent);
  gpuDedicatedMemoryPercentage.value.push(metrics.gpu_dedicated_memory_percent);
  gpuCopyUsagePercentage.value.push(metrics.gpu_copy_usage_percent);
  gpuComputeUsagePercentage.value.push(metrics.gpu_compute_usage_percent);
  epochs.value.push(metrics.epoch);

  // Keep only the last 50 values
  [
    cpuTotalUsagePercentage,
    memoryTotalUsagePercentage,
    gpuDedicatedMemoryPercentage,
    gpuCopyUsagePercentage,
    gpuComputeUsagePercentage,
    epochs
  ].forEach(metric => {
    if (metric.value.length > 50) {
      metric.value.shift()
    }
  })

  // Update the CPU chart data
  cpuTotalUsageChartData.value = {
    labels: epochs.value.map(formatTimestamp),
    datasets: [
      {
        label: metricsLabels.cpuUsage,
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: cpuTotalUsagePercentage.value.map(value => value)
      }
    ]
  }

  // Update the Memory chart data
  memoryTotalUsageChartData.value = {
    labels: epochs.value.map(formatTimestamp),
    datasets: [
      {
        label: metricsLabels.memoryUsage,
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: memoryTotalUsagePercentage.value.map(value => value)
      }
    ]
  }

  // Update the GPU Dedicated Memory chart data
  gpuDedicatedMemoryChartData.value = {
    labels: epochs.value.map(formatTimestamp),
    datasets: [
      {
        label: metricsLabels.gpuDedicatedMemoryUsage,
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: gpuDedicatedMemoryPercentage.value.map(value => value)
      }
    ]
  }

  // Update the GPU Copy Usage chart data
  gpuCopyUsageChartData.value = {
    labels: epochs.value.map(formatTimestamp),
    datasets: [
      {
        label: metricsLabels.gpuCopyUsage,
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: gpuCopyUsagePercentage.value.map(value => value)
      }
    ]
  }

  // Update the GPU Compute Usage chart data
  gpuComputeUsageChartData.value = {
    labels: epochs.value.map(formatTimestamp),
    datasets: [
      {
        label: metricsLabels.gpuComputeUsage,
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: gpuComputeUsagePercentage.value.map(value => value)
      }
    ]
  }
});

</script>

<style scoped>
.metrics-container {
  margin-top: 10px;
  display: flex;
}

.metrics-container>label {
  width: 25%;
}

.metrics-container>div {
  width: 75%;
  margin-left: 10px;
}

.metrics-container>div>progress {
  width: 100%;
  transform: translateY(50%);
}

.metrics-container>div>div {
  transform: translateY(-63%);
  color: white;
}

.metrics-container progress {
  height: 30px;
  border: 1px solid #000;
  border-radius: 5px;
}
</style>