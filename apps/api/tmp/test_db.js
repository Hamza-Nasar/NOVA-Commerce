const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    console.log('Connecting...');
    const c = await p.user.count();
    console.log('User count', c);
  } catch (e) {
    console.error('DB ERR', e.message || e);
  } finally {
    await p.$disconnect();
  }
})();
