const prisma = require('./src/utils/prismaClient');

async function seedData() {
  try {
    // Get or create organization (assuming first org exists)
    let organization = await prisma.organization.findFirst();
    
    if (!organization) {
      console.log('No organization found. Please create an organization first.');
      return;
    }

    // Create sample financial records
    const records = [
      {
        amount: 5000.00,
        type: 'INCOME',
        category: 'SALARY',
        description: 'Monthly Salary',
        notes: 'April 2026 salary',
        date: new Date('2026-04-01'),
        organizationId: organization.id
      },
      {
        amount: 1500.00,
        type: 'INCOME',
        category: 'INVESTMENT',
        description: 'Stock Dividend',
        notes: 'Q1 2026 dividend payments',
        date: new Date('2026-04-05'),
        organizationId: organization.id
      },
      {
        amount: 1200.00,
        type: 'EXPENSE',
        category: 'RENT',
        description: 'Monthly Rent',
        notes: 'April rent payment',
        date: new Date('2026-04-01'),
        organizationId: organization.id
      },
      {
        amount: 300.00,
        type: 'EXPENSE',
        category: 'FOOD',
        description: 'Grocery Shopping',
        notes: 'Weekly groceries',
        date: new Date('2026-04-03'),
        organizationId: organization.id
      },
      {
        amount: 150.00,
        type: 'EXPENSE',
        category: 'UTILITIES',
        description: 'Electricity Bill',
        notes: 'March electricity bill',
        date: new Date('2026-04-02'),
        organizationId: organization.id
      },
      {
        amount: 200.00,
        type: 'EXPENSE',
        category: 'TRANSPORT',
        description: 'Gas and Car Maintenance',
        notes: 'Monthly transportation costs',
        date: new Date('2026-04-04'),
        organizationId: organization.id
      },
      {
        amount: 100.00,
        type: 'EXPENSE',
        category: 'ENTERTAINMENT',
        description: 'Netflix and Spotify',
        notes: 'Monthly subscriptions',
        date: new Date('2026-04-01'),
        organizationId: organization.id
      },
      {
        amount: 500.00,
        type: 'EXPENSE',
        category: 'HEALTHCARE',
        description: 'Health Insurance Premium',
        notes: 'Monthly health insurance',
        date: new Date('2026-04-01'),
        organizationId: organization.id
      }
    ];

    // Insert records
    for (const record of records) {
      await prisma.financialRecord.create({ data: record });
    }

    console.log(`✅ Created ${records.length} sample financial records`);
    
    // Display summary
    const totalIncome = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalExpenses = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
    
    console.log(`📊 Summary:`);
    console.log(`   Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`   Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`   Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
