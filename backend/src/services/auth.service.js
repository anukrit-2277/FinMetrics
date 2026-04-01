const bcrypt = require('bcrypt');
const prisma = require('../config/db');

class AuthService {
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    if (!user.isActive) {
      throw Object.assign(new Error('Account is deactivated. Contact an administrator.'), { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw Object.assign(new Error('Invalid email or password'), { status: 401 });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      role: user.role.name,
      roleId: user.roleId,
      isActive: user.isActive,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw Object.assign(new Error('Current password is incorrect'), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();
