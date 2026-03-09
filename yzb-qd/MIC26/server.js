import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;
const tempDir = path.join(os.tmpdir(), 'material-inventory-' + Date.now());

console.log('============================================');
console.log('  耗材库存管理系统 - 开发服务器');
console.log('============================================');
console.log('');

process.title = '耗材库存管理系统';

async function extractAndStart() {
  try {
    console.log('正在初始化环境...');
    
    const workingDir = projectRoot;
    
    console.log(`工作目录: ${workingDir}`);

    const packageJsonPath = path.join(workingDir, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.error('错误: 未找到 package.json 文件');
      console.error('请确保程序所在目录包含完整的项目文件');
      process.exit(1);
    }

    console.log(`工作目录: ${workingDir}`);
    console.log(`启动脚本: npm run dev`);
    console.log('');
    console.log('服务启动中，请稍候...');
    console.log('访问地址: http://127.0.0.1:5176');
    console.log('');
    console.log('提示: 关闭此窗口将停止服务器');
    console.log('--------------------------------------------');

    const child = spawn('npm', ['run', 'dev', '--', '--port', '5176'], {
      cwd: workingDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      windowsHide: false,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      console.log('');
      console.log('--------------------------------------------');
      if (workingDir !== projectRoot && fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
          // 忽略临时目录删除失败的错误
        }
      }
      console.log(`服务器已停止，退出码: ${code}`);
      process.exit(code);
    });

    child.on('error', (err) => {
      console.error('启动失败:', err.message);
      process.exit(1);
    });

    process.on('SIGINT', () => {
      console.log('');
      console.log('正在停止服务器...');
      child.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('');
      console.log('正在停止服务器...');
      child.kill('SIGTERM');
    });

  } catch (err) {
    console.error('错误:', err.message);
    process.exit(1);
  }
}

extractAndStart();
