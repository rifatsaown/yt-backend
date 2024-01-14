import "dotenv/config";
import connectDB from './db/dbConnect';
import { app } from "./app";

// Set port
const port = process.env.PORT || 3000;

// Connect to DB
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch((err) => {
    console.log("Error connecting to DB: ", err);
});



// import fs from 'fs';
// import path from 'path';
// app.get('/', (req, res) => {
//   // const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8');
//   // res.send(html);
//   res.send(fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf-8'));
// });