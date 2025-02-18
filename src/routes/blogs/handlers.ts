import { Request, Response } from 'express';
import { BlogViewModel, ApiResponse, ErrorResponse } from '../../types';
import { blogsData } from '../../mocks/blogs.mock';

const blogs: BlogViewModel[] = blogsData;

const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const getBlogs = (_req: Request, res: Response) => {
  res.status(200).json(blogs);
};

// TODO: add TS

export const getBlogById = (req: any, res: any) => {
  const blog = blogs.find(b => b.id === req.params.id);

  if (!blog) {
    return res.status(404).json({
      errorsMessages: [
        {
          message: 'Blog not found',
          field: 'id',
        },
      ],
    });
  }

  res.status(200).json(blog);
};

export const createBlog = (req: any, res: any) => {
  const { name, description, websiteUrl } = req.body;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.status(401).json({ status: 401, error: 'Unauthorized' });
  }

  const errors = {
    errorsMessages: [] as { message: string; field: string }[],
  };

  if (!name || name.trim() === '' || typeof name !== 'string' || name.trim().length > 15) {
    errors.errorsMessages.push({
      message: 'Invalid name length',
      field: 'name',
    });
  }

  if (!websiteUrl || websiteUrl.trim() === '' || !urlPattern.test(websiteUrl) || websiteUrl.length > 100) {
    errors.errorsMessages.push({
      message: 'Invalid url format or length',
      field: 'websiteUrl',
    });
  }

  if (errors.errorsMessages.length) {
    return res.status(400).json(errors);
  }

  const newBlog = {
    description,
    id: (blogs.length + 1).toString(),
    name,
    websiteUrl,
  };

  blogs.push(newBlog);

  res.status(201).json(newBlog);
};

export const updateBlog = (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, websiteUrl } = req.body;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.status(401).json({ status: 401, error: 'Unauthorized' });
  }

  const errors = {
    errorsMessages: [] as { message: string; field: string }[],
  };

  if (!name || name.trim() === '' || typeof name !== 'string' || name.trim().length > 15) {
    errors.errorsMessages.push({
      message: 'Invalid name length',
      field: 'name',
    });
  }

  if (!websiteUrl || websiteUrl.trim() === '' || !urlPattern.test(websiteUrl) || websiteUrl.length > 100) {
    errors.errorsMessages.push({
      message: 'Invalid url format or length',
      field: 'websiteUrl',
    });
  }

  if (errors.errorsMessages.length) {
    return res.status(400).json(errors);
  }

  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Blog not found',
    });
  }

  const updatedBlog: BlogViewModel = {
    ...blogs[blogIndex],
    name,
    description,
    websiteUrl,
  };

  blogs[blogIndex] = updatedBlog;

  const response: ApiResponse<BlogViewModel> = {
    status: 204,
    data: updatedBlog,
  };

  res.sendStatus(204).json(response);
};

export const deleteBlog = (req: any, res: any) => {
  const { id } = req.params;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.status(401).json({ status: 401, error: 'Unauthorized' });
  }

  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Blog not found',
    });
  }

  blogs.splice(blogIndex, 1);
  res.sendStatus(204);
};
