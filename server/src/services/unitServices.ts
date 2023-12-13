import { PrismaClient, Unit } from '@prisma/client';
const prisma = new PrismaClient();

export const createUnit = async (data: Unit) => {
    return prisma.unit.create({ data });
};

export const getAllUnits = async () => {
    return prisma.unit.findMany();
};

export const getUnitById = async (id: number) => {
    return prisma.unit.findUnique({ where: { id } });
};

export const updateUnit = async (id: number, data: Unit) => {
    return prisma.unit.update({ where: { id }, data });
};

export const deleteUnit = async (id: number) => {
    return prisma.unit.delete({ where: { id } });
};
