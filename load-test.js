import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 users over 1 minute
    { duration: '3m', target: 500 }, // Spike to 500 users over 3 minutes
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.05'],    // Error rate should be less than 5%
  },
};

const BASE_URL = 'http://localhost:5001/api';

export default function () {
  // 1. Get Products (Simulate browsing)
  const productsRes = http.get(`${BASE_URL}/product`);
  check(productsRes, {
    'get products status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Hit Chaos endpoints occasionally to inject anomalies
  const random = Math.random();
  
  if (random < 0.1) {
    // 10% chance to hit a slow endpoint
    http.get(`${BASE_URL}/chaos/delay`);
  } else if (random < 0.15) {
    // 5% chance to hit a random error
    http.get(`${BASE_URL}/chaos/error`);
  } else if (random < 0.18) {
    // 3% chance to hit a heavy query
    http.get(`${BASE_URL}/chaos/heavy`);
  }

  sleep(1);
}
