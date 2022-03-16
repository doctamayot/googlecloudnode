import BlogModel from '../models/BlogModel.js';

//Metodos para el crud

//Mostrar todos los registros

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.findAll();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Un blog
export const getBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findAll({
      where: { id: req.params.id },
    });

    res.json(blog[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//creat blog

export const createBlog = async (req, res) => {
  try {
    await BlogModel.create(req.body);
    res.json({
      message: 'registro creado correctamente',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Actualizar un registro

export const updateBlog = async (req, res) => {
  try {
    await BlogModel.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({
      message: 'registro actualizado correctamente',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//eliminar
export const deleteBlog = async (req, res) => {
  try {
    await BlogModel.destroy({
      where: { id: req.params.id },
    });
    res.json({
      message: 'registro borrado correctamente',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};
