import { buildServer } from './app';

async function start() {
  const server = await buildServer();
  
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log(`Server listening on ${server.server.address().port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start(); 