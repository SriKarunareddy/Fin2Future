const http = require('http');

const API_URL = 'http://localhost:4000/api';
let token = '';
let userId = '';

async function fetchReq(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  const email = `testuser${Date.now()}@example.com`;
  console.log('1. Signing up:', email);
  let res = await fetchReq('/auth/signup', 'POST', { email, password: 'password123' });
  console.log(JSON.stringify(res));

  console.log('\n2. Logging in');
  res = await fetchReq('/auth/login', 'POST', { email, password: 'password123' });
  console.log(JSON.stringify(res));
  token = res.data.token;

  console.log('\n3. Getting user /auth/me');
  res = await fetchReq('/auth/me', 'GET', null, token);
  console.log(JSON.stringify(res));
  userId = res.data._id;

  console.log('\n4. Getting dashboard analytics for userId:', userId);
  res = await fetchReq(`/quiz/analytics/${userId}`);
  console.log(JSON.stringify(res));

  console.log('\n5. Submitting quiz');
  const responses = Array(10).fill({ questionId: 1, selectedOption: 'A' });
  res = await fetchReq('/quiz/submit', 'POST', { userId, responses });
  console.log('Quiz Result:', JSON.stringify(res));

  console.log('\n6. Getting dashboard analytics again');
  res = await fetchReq(`/quiz/analytics/${userId}`);
  console.log(JSON.stringify(res));
}

runTests().catch(console.error);
