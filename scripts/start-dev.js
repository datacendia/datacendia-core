// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

#!/usr/bin/env node
/**
 * Datacendia Development Startup Script
 * Cross-platform: Windows, Linux, macOS
 * 
 * Usage: node scripts/start-dev.js
 * Or:    npm run start:dev (after adding to package.json)
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const ROOT_DIR = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, prefix, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

function checkPort(port) {
  try {
    if (isWindows) {
      const result = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      return result.trim().length > 0;
    } else {
      const result = execSync(`lsof -i :${port} -t 2>/dev/null || true`, { encoding: 'utf8' });
      return result.trim().length > 0;
    }
  } catch {
    return false;
  }
}

function checkDocker() {
  try {
    execSync('docker ps', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function startDockerServices() {
  log(colors.cyan, 'Docker', 'Checking Docker services...');
  
  if (!checkDocker()) {
    log(colors.red, 'Docker', 'Docker is not running! Please start Docker Desktop.');
    return false;
  }

  const requiredContainers = [
    { name: 'cendia-postgres-5434', port: 5434 },
    { name: 'cendia-redis', port: 6380 },
  ];

  for (const container of requiredContainers) {
    if (!checkPort(container.port)) {
      log(colors.yellow, 'Docker', `Starting ${container.name}...`);
      try {
        execSync(`docker start ${container.name}`, { stdio: 'pipe' });
        log(colors.green, 'Docker', `${container.name} started`);
      } catch {
        log(colors.red, 'Docker', `Failed to start ${container.name}. Run: docker-compose -f docker-compose.dev.yml up -d`);
      }
    } else {
      log(colors.green, 'Docker', `${container.name} already running on port ${container.port}`);
    }
  }
  
  return true;
}

function startProcess(name, command, args, cwd, color) {
  log(color, name, `Starting: ${command} ${args.join(' ')}`);
  
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) log(color, name, line);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) log(color, name, line);
    });
  });

  proc.on('error', (err) => {
    log(colors.red, name, `Error: ${err.message}`);
  });

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      log(colors.red, name, `Exited with code ${code}`);
    }
  });

  return proc;
}

async function main() {
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  DATACENDIA DEVELOPMENT ENVIRONMENT' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');

  // Check and start Docker services
  const dockerOk = await startDockerServices();
  if (!dockerOk) {
    log(colors.yellow, 'Startup', 'Continuing without Docker services...');
  }

  // Wait a moment for Docker services
  await new Promise(resolve => setTimeout(resolve, 2000));

  const processes = [];

  // Start Backend (if not already running)
  if (!checkPort(3000)) {
    const backendProc = startProcess(
      'Backend',
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      path.join(ROOT_DIR, 'backend'),
      colors.blue
    );
    processes.push(backendProc);
  } else {
    log(colors.green, 'Backend', 'Already running on port 3000');
  }

  // Wait for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Start Frontend (if not already running)
  if (!checkPort(5173)) {
    const frontendProc = startProcess(
      'Frontend',
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'dev'],
      ROOT_DIR,
      colors.green
    );
    processes.push(frontendProc);
  } else {
    log(colors.green, 'Frontend', 'Already running on port 5173');
  }

  console.log('\n' + colors.cyan + '─'.repeat(60) + colors.reset);
  console.log(colors.green + '  ✓ Development environment starting...' + colors.reset);
  console.log(colors.cyan + '─'.repeat(60) + colors.reset);
  console.log(`\n  Frontend:  ${colors.cyan}http://localhost:5173${colors.reset}`);
  console.log(`  Backend:   ${colors.cyan}http://localhost:3000${colors.reset}`);
  console.log(`  API Docs:  ${colors.cyan}http://localhost:3000/api/docs${colors.reset}\n`);
  console.log(`  Press ${colors.yellow}Ctrl+C${colors.reset} to stop all services\n`);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n' + colors.yellow + 'Shutting down...' + colors.reset);
    processes.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill('SIGTERM');
      }
    });
    process.exit(0);
  });
}

main().catch(console.error);
