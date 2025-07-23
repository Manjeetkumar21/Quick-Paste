const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const pasteRoutes = require('./routes/paste.routes');
const cors = require('cors');

dotenv.config();
connectDB().then();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health_check', (req, res) => {
  return res.status(200).json({ message: 'Server is healthy' });
});

app.use('/api/paste', pasteRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
