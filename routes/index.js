// import express from 'express';
// import {
//   createBlog,
//   deleteBlog,
//   getAllBlogs,
//   getBlog,
//   updateBlog,
// } from '../controllers/BlogController.js';
// const router = express.Router();

// router.get('/', getAllBlogs);
// router.get('/:id', getBlog);
// router.post('/', createBlog);
// router.put('/:id', updateBlog);
// router.delete('/:id', deleteBlog);

// export default router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileController');
let routes = (app) => {
  router.post('/upload', controller.upload);
  router.get('/files', controller.getListFiles);
  router.get('/files/:name', controller.download);
  app.use(router);
};
module.exports = routes;
