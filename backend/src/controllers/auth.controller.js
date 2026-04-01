const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      // Store user in session
      req.session.user = user;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('finmetrics.sid');
        return res.status(200).json({
          success: true,
          message: 'Logged out successfully',
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res) {
    return res.status(200).json({
      success: true,
      data: req.session.user,
    });
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.session.user.id,
        currentPassword,
        newPassword
      );
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
