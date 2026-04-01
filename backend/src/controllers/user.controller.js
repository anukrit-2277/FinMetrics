const userService = require('../services/user.service');

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req, res, next) {
    try {
      const user = await userService.deactivate(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req, res, next) {
    try {
      const roles = await userService.getRoles();
      return res.status(200).json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
