const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // --- Clear existing data ---
  console.log('🗑️  Clearing existing data...');
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // --- Roles ---
  const roles = await Promise.all(
    ['VIEWER', 'ANALYST', 'ADMIN'].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const [viewerRole, analystRole, adminRole] = roles;
  console.log('✅ Roles created:', roles.map((r) => r.name).join(', '));

  // --- Users with strong passwords (bcrypt 12 rounds) ---
  const adminHash = await bcrypt.hash('Admin@2025!', 12);
  const analystHash = await bcrypt.hash('Analyst@2025!', 12);
  const viewerHash = await bcrypt.hash('Viewer@2025!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@finmetrics.com',
      name: 'Alex Admin',
      password: adminHash,
      roleId: adminRole.id,
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@finmetrics.com',
      name: 'Anna Analyst',
      password: analystHash,
      roleId: analystRole.id,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@finmetrics.com',
      name: 'Victor Viewer',
      password: viewerHash,
      roleId: viewerRole.id,
    },
  });

  console.log('✅ Users created:', [admin, analyst, viewer].map((u) => u.email).join(', '));

  // --- Transactions ---
  const transactionData = [
    { amount: 8500.00, type: 'INCOME', category: 'Salary', date: new Date('2025-01-05'), notes: 'January salary', userId: admin.id },
    { amount: 8500.00, type: 'INCOME', category: 'Salary', date: new Date('2025-02-05'), notes: 'February salary', userId: admin.id },
    { amount: 8500.00, type: 'INCOME', category: 'Salary', date: new Date('2025-03-05'), notes: 'March salary', userId: admin.id },
    { amount: 2200.00, type: 'INCOME', category: 'Freelance', date: new Date('2025-01-15'), notes: 'Web development project', userId: admin.id },
    { amount: 1500.00, type: 'INCOME', category: 'Freelance', date: new Date('2025-03-20'), notes: 'UI/UX consulting', userId: admin.id },
    { amount: 850.00, type: 'INCOME', category: 'Investments', date: new Date('2025-02-28'), notes: 'Stock market gains', userId: admin.id },
    { amount: 420.00, type: 'INCOME', category: 'Dividends', date: new Date('2025-03-15'), notes: 'Q1 dividend payout', userId: admin.id },
    { amount: 1800.00, type: 'INCOME', category: 'Rental Income', date: new Date('2025-02-01'), notes: 'Apartment B rental', userId: admin.id },
    { amount: 2400.00, type: 'EXPENSE', category: 'Rent', date: new Date('2025-01-01'), notes: 'Office space rent', userId: admin.id },
    { amount: 2400.00, type: 'EXPENSE', category: 'Rent', date: new Date('2025-02-01'), notes: 'Office space rent', userId: admin.id },
    { amount: 2400.00, type: 'EXPENSE', category: 'Rent', date: new Date('2025-03-01'), notes: 'Office space rent', userId: admin.id },
    { amount: 180.00, type: 'EXPENSE', category: 'Utilities', date: new Date('2025-01-10'), notes: 'Electricity + internet', userId: admin.id },
    { amount: 195.00, type: 'EXPENSE', category: 'Utilities', date: new Date('2025-02-10'), notes: 'Electricity + internet', userId: admin.id },
    { amount: 320.00, type: 'EXPENSE', category: 'Groceries', date: new Date('2025-01-08'), notes: 'Weekly groceries', userId: admin.id },
    { amount: 280.00, type: 'EXPENSE', category: 'Groceries', date: new Date('2025-02-12'), notes: 'Weekly groceries', userId: admin.id },
    { amount: 150.00, type: 'EXPENSE', category: 'Transport', date: new Date('2025-01-20'), notes: 'Uber rides + fuel', userId: admin.id },
    { amount: 89.99, type: 'EXPENSE', category: 'Entertainment', date: new Date('2025-02-14'), notes: 'Movie tickets & dinner', userId: admin.id },
    { amount: 250.00, type: 'EXPENSE', category: 'Healthcare', date: new Date('2025-03-10'), notes: 'Annual health checkup', userId: admin.id },
    { amount: 49.99, type: 'EXPENSE', category: 'Software', date: new Date('2025-01-01'), notes: 'Figma subscription', userId: admin.id },
    { amount: 500.00, type: 'EXPENSE', category: 'Marketing', date: new Date('2025-03-25'), notes: 'Social media ads', userId: admin.id },
  ];

  await prisma.transaction.createMany({ data: transactionData });
  console.log(`✅ ${transactionData.length} transactions created`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Test Accounts (Strong Passwords):');
  console.log('   Admin:   admin@finmetrics.com   / Admin@2025!');
  console.log('   Analyst: analyst@finmetrics.com / Analyst@2025!');
  console.log('   Viewer:  viewer@finmetrics.com  / Viewer@2025!');
  console.log('\n🔒 Passwords hashed with bcrypt (12 salt rounds)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
