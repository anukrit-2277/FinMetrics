const bcrypt = require('bcrypt');
const prisma = require('../config/db');

class UserService {
  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: { select: { name: true } },
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: { select: { name: true } },
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }

    return user;
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        roleId: parseInt(data.roleId),
      },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: { select: { name: true } },
        isActive: true,
        createdAt: true,
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.roleId) updateData.roleId = parseInt(data.roleId);
    if (typeof data.isActive === 'boolean') updateData.isActive = data.isActive;

    return prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: { select: { name: true } },
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async deactivate(id) {
    return prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });
  }

  async getRoles() {
    return prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
  }
}

module.exports = new UserService();
