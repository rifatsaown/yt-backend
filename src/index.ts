import "dotenv/config";
import express from 'express';
import fs from 'fs';
import path from 'path';
import connectDB from './db/dbConnect';

// const app = express();
// const port = 3000;

connectDB();




// app.get('/', (req, res) => {
//   // const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');
//   // res.send(html);
//   res.send(fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8'));
// });