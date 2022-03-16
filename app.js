// import express from 'express';
//import cors from 'cors';
// import db from './database/db.js';

// import blogRoutes from './routes/routes.js';

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use('/blogs', blogRoutes);

// try {
//   await db.authenticate();
//   console.log('Conexion exitosa a la db');
// } catch (error) {
//   console.log(`Conexion error a la db es ${error}`);
// }

// app.get('/', (req, res) => {
//   res.send('Hola Mundo');
// });

// app.listen(8000, () => {
//   console.log('server UP running in http://localhost:8000/');
// });
const cors = require('cors');
const express = require('express');
const app = express();
let corsOptions = {
  origin: 'http://localhost:8081',
};
app.use(cors(corsOptions));
const initRoutes = require('./routes');
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
const port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
