<template>
  <div>
    <h1 @click="toggleView()">Metrics</h1>

    <div v-for="(value, key) in metrics" :key="key" class="metric-item">
      <div v-if="key !== 'epoch' && metrics[key].length" class="metrics-container">
        <label v-if="!showCharts" :for="key">{{ getLabel(key) }}</label>
        <div v-if="!showCharts">
          <progress :id="key" :value="getLastValue(metrics[key])" max="100">
        {{ getLastValue(metrics[key]) }}%
          </progress>
          <div>
        {{ getLastValue(metrics[key]) }}%
          </div>
        </div>
        <Line v-if="showCharts" :options="globalChartOptions" :data="getChartData(metrics['epoch'], key, value)" />
      </div>
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

// metrics data
const metrics = ref<object>({})

// Global chart options
const globalChartOptions = ref<object>({
  scales: {
    y: {
      min: 0,
      max: 100
    }
  }
})

const showCharts = ref<boolean>(false)

// Toggle view
const toggleView = () => {
  showCharts.value = !showCharts.value
}

// Get the last value of a metric
const getLastValue = (metric: number[]): number => {
  return metric[metric.length - 1]
}

// Format a the timestamp
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

let gpuIds = []

// Get label for metric
const getLabel = (key: string): string => {
  switch (key) {
    case 'cpu-utilization':
      return 'CPU Usage'
    case 'memory-utilization':
      return 'Memory Usage'
  }

  if (key.includes('gpu')) {
    const gpuId = key.split('-')[1]
    if (!gpuIds.includes(gpuId)) {
      gpuIds.push(gpuId)
    }
    
    let index = gpuIds.indexOf(gpuId)
    const gpuMetric = key.split('-').slice(2).join('-')
    return `GPU[${index}] ${gpuMetric}`
  }

  return key;
}

// Get Chart Data
const getChartData = (epoch, key, values) => {
  return {
    labels: epoch.map(formatTimestamp),
    datasets: [
      {
        label: getLabel(key),
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        data: values.map(value => value)
      }
    ]
  }
}


// Subscribe to the metrics-data event
window.ipcRenderer.on('metrics-data', (_, _metrics) => {

  // For every key in metrics
  for (const key in _metrics) {
    // Ignore non-numerical values
    if (typeof _metrics[key] !== 'number') {
      continue
    }

    // If the key is not in metrics
    if (!metrics.value.hasOwnProperty(key)) {
      // Add the key to metrics
      metrics.value[key] = []
    }
    // Push the value to the key
    metrics.value[key].push(_metrics[key])

    // Keep only the last 50 values
    if (metrics.value[key].length > 50) {
      metrics.value[key].shift()
    }
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