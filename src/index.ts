import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  // const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');
  // res.send(html);
  res.send(fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});