import http from 'k6/http';
import { check, sleep } from 'k6';

// Basic load test hitting login and product list
// Usage:
//   k6 run -e BASE_URL=http://localhost:5001 load-test/k6-login-products.js

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // ramp up to 10 VUs
    { duration: '1m', target: 10 },   // stay at 10 VUs
    { duration: '30s', target: 0 },   // ramp down
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5001';

export default function () {
  // 1. Attempt login (replace with a real user)
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, {
    email: 'test@example.com',
    password: 'password123',
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  // 2. If login succeeded, reuse cookies to hit product list
  if (loginRes.status === 200) {
    const cookies = loginRes.cookies;
    const productRes = http.get(`${BASE_URL}/api/product`, {
      cookies,
    });

    check(productRes, {
      'products status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}

