const prisma = require('../config/db');

class TransactionService {
  async getAll(filters = {}) {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      search,
    } = filters;

    const where = { isDeleted: false };

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (search) {
      where.OR = [
        { category: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getById(id) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!transaction) {
      throw Object.assign(new Error('Transaction not found'), { status: 404 });
    }

    return transaction;
  }

  async create(data, userId) {
    return prisma.transaction.create({
      data: {
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes || null,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id, data) {
    const updateData = {};
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.type) updateData.type = data.type;
    if (data.category) updateData.category = data.category;
    if (data.date) updateData.date = new Date(data.date);
    if (data.notes !== undefined) updateData.notes = data.notes;

    return prisma.transaction.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async softDelete(id) {
    return prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });
  }

  async getCategories() {
    const categories = await prisma.transaction.findMany({
      where: { isDeleted: false },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }
}

module.exports = new TransactionService();
