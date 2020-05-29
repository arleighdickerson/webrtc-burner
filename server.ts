import express from 'express';
import { Server } from 'http';
import next from 'next';
import { ExpressPeerServer } from 'peer';

const app = express();
const httpServer = new Server(app);
const peerServer = ExpressPeerServer(httpServer, {
  allow_discovery: true,
});

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.use('/chat', peerServer);

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${host}:${port}`);
  });
});
