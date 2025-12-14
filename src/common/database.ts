import { PrismaClient } from '@prisma/client';

const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_MODE;

export const prisma = new PrismaClient(isTest ? {} : undefined);
