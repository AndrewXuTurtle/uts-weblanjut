const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Database connection
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_mytpl",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket_io',
    cors: {
      origin: true, // Allow all origins for development
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true, // Allow Engine.IO v3 clients
  });

  // Create database connection pool
  const db = mysql.createPool(dbConfig);

  io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);

    try {
      // Load existing messages from database
      const [rows] = await db.execute(
        'SELECT id, username, isi, waktu FROM pesan ORDER BY waktu ASC LIMIT 50'
      );
      socket.emit('load_messages', rows);
    } catch (error) {
      console.error('Error loading messages:', error);
    }

    socket.on('message', async (data) => {
      console.log('Pesan diterima:', data);

      try {
        // Save message to database
        const [result] = await db.execute(
          'INSERT INTO pesan (username, isi, waktu) VALUES (?, ?, NOW())',
          [data.username, data.isi]
        );

        // Get the inserted message with ID and timestamp
        const [rows] = await db.execute(
          'SELECT id, username, isi, waktu FROM pesan WHERE id = ?',
          [result.insertId]
        );

        const savedMessage = rows[0];

        // Broadcast the saved message to all clients
        io.emit('message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Network access: http://YOUR_LOCAL_IP:${port}`);
    console.log(`> To find your IP address, run: ipconfig (Windows) or ifconfig (Mac/Linux)`);
  });
});