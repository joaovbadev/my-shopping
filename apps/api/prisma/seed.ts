import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Store',
      domain: 'demo',
    },
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: Role.ADMIN,
      tenantId: tenant.id,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: 'Electronics',
      tenantId: tenant.id,
    },
  });

  const products = [
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 199.99, images: ['https://placehold.co/400x400?text=Headphones'] },
    { name: 'Smart Watch', description: 'Fitness tracking smartwatch', price: 299.99, images: ['https://placehold.co/400x400?text=SmartWatch'] },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker', price: 79.99, images: ['https://placehold.co/400x400?text=Speaker'] },
    { name: 'USB-C Hub', description: '7-in-1 USB-C adapter', price: 49.99, images: ['https://placehold.co/400x400?text=USBHub'] },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard', price: 149.99, images: ['https://placehold.co/400x400?text=Keyboard'] },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        tenantId: tenant.id,
        categoryId: category.id,
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log(`Tenant: ${tenant.name} (${tenant.id})`);
  console.log('Admin: admin@demo.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
