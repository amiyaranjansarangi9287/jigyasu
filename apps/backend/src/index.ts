import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ message: 'Welcome to Jigyasu API', status: 'online' });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

export default {
  port: process.env.PORT || 8080,
  fetch: app.fetch,
};
