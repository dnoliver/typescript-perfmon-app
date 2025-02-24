import { spawn } from 'child_process';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, '../../public/scripts/collector.ps1');

export function runPowerShellScript() {
  const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass' ,'-File', scriptPath]);

  ps.stdout.on('data', (data) => {
    const output = data.toString();
    processOutput(output);
  });

  ps.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
  });

  ps.on('close', (code) => {
    console.log(`PowerShell script exited with code ${code}`);
    runPowerShellScript(); // Restart the process
  });
}

import { BrowserWindow } from 'electron';
let win: BrowserWindow | null = null;

export function setWindow(window: BrowserWindow) {
  win = window;
}

function processOutput(output: string) {
  const pattern = /cpu-usage-percent=(?<cpu_usage>\d+(\.\d+)?),memory-usage-percent=(?<memory_usage>\d+(\.\d+)?),gpu-dedicated-memory-percent=(?<gpu_dedicated_memory_usage>\d+(\.\d+)?),gpu-copy-usage-percent=(?<gpu_copy_engine_usage>\d+(\.\d+)?),gpu-compute-usage-percent=(?<gpu_compute_engine_usage>\d+(\.\d+)?) (?<epoch>\d+)/;
  const match = output.match(pattern);
  
  if (match && match.groups) {
    const metrics = {
      cpu_usage_percent: parseFloat(match.groups.cpu_usage),
      memory_usage_percent: parseFloat(match.groups.memory_usage),
      gpu_dedicated_memory_percent: parseFloat(match.groups.gpu_dedicated_memory_usage),
      gpu_copy_usage_percent: parseFloat(match.groups.gpu_copy_engine_usage),
      gpu_compute_usage_percent: parseFloat(match.groups.gpu_compute_engine_usage),
      epoch: parseInt(match.groups.epoch, 10),
    };

    win?.webContents.send('metrics-data', metrics);
  }
}