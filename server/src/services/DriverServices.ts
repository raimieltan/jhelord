import { PrismaClient, Driver } from '@prisma/client';
const prisma = new PrismaClient();

export const createDriver = async (data: Driver) => {
    return prisma.driver.create({ data });
};

export const getAllDrivers = async () => {
    return prisma.driver.findMany();
};

export const getDriverById = async (id: number) => {
    return prisma.driver.findUnique({ where: { id } });
};

export const updateDriver = async (id: number, data: Driver) => {
    return prisma.driver.update({ where: { id }, data });
};

export const deleteDriver = async (id: number) => {
    return prisma.driver.delete({ where: { id } });
};
