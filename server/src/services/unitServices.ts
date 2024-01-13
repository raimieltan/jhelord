import { PrismaClient, Unit } from '@prisma/client';
const prisma = new PrismaClient();

export const createUnit = async (data: any) => {
    return prisma.unit.create({ data });
};

export const getAllUnits = async () => {
    return prisma.unit.findMany({
        include: {
            driver: {
                include: {
                    User: true,
                }
            }
        }
    });
};

export const getUnitById = async (id: number) => {
    return prisma.unit.findUnique({ where: { id } });
};

export const updateUnit = async (id: number, data: any) => {
    return prisma.unit.update({ where: { id }, data });
};

export const deleteUnit = async (id: number) => {
    return prisma.unit.delete({ where: { id } });
};
// In services/unitServices.ts

export const updateUnitLocation = async (id: number, location: any) => {
    return prisma.unit.update({
        where: { id },
        data: { location },
    });
};


