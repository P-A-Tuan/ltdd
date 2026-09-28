const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const dataFile = path.join(__dirname, 'students.json');

function readStudents() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeStudents(students) {
  fs.writeFileSync(dataFile, `${JSON.stringify(students, null, 2)}\n`, 'utf8');
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error('Request body too large'));
    });
    request.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON body')); }
    });
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  const pathname = new URL(request.url, 'http://localhost').pathname.replace(/^\/api(?=\/)/, '');
  if (pathname === '/health' && request.method === 'GET') {
    sendJson(response, 200, { ok: true });
    return;
  }

  try {
    const students = readStudents();
    if (pathname === '/students' && request.method === 'GET') {
      sendJson(response, 200, students);
      return;
    }
    if (pathname === '/students' && request.method === 'POST') {
      const input = await readBody(request);
      const required = ['hoten', 'mssv', 'lop', 'nganh'];
      if (required.some((key) => typeof input[key] !== 'string' || !input[key].trim())) {
        sendJson(response, 400, { message: 'Thiếu thông tin sinh viên' });
        return;
      }
      const id = students.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      const updated = [...students, { id, ...Object.fromEntries(required.map((key) => [key, input[key].trim()])) }];
      writeStudents(updated);
      sendJson(response, 201, updated);
      return;
    }

    const match = pathname.match(/^\/students\/(\d+)$/);
    if (match && request.method === 'PUT') {
      const id = Number(match[1]);
      const input = await readBody(request);
      const index = students.findIndex((item) => item.id === id);
      if (index < 0) { sendJson(response, 404, { message: 'Không tìm thấy sinh viên' }); return; }
      const required = ['hoten', 'mssv', 'lop', 'nganh'];
      if (required.some((key) => typeof input[key] !== 'string' || !input[key].trim())) {
        sendJson(response, 400, { message: 'Thiếu thông tin sinh viên' });
        return;
      }
      students[index] = { id, ...Object.fromEntries(required.map((key) => [key, input[key].trim()])) };
      writeStudents(students);
      sendJson(response, 200, students);
      return;
    }
    if (match && request.method === 'DELETE') {
      const id = Number(match[1]);
      const updated = students.filter((item) => item.id !== id);
      if (updated.length === students.length) { sendJson(response, 404, { message: 'Không tìm thấy sinh viên' }); return; }
      writeStudents(updated);
      sendJson(response, 200, updated);
      return;
    }
    sendJson(response, 404, { message: 'Không tìm thấy API' });
  } catch (error) {
    console.error(error);
    sendJson(response, error.message === 'Invalid JSON body' ? 400 : 500, { message: error.message });
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Student API running on port ${port}`));
