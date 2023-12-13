import { PrismaClient, Booking } from '@prisma/client';
const prisma = new PrismaClient();

export const createBooking = async (data: any) => {
    return prisma.booking.create({ data });
};

export const getAllBookings = async () => {
    return prisma.booking.findMany();
};

export const getBookingById = async (id: number) => {
    return prisma.booking.findUnique({ where: { id } });
};

export const updateBooking = async (id: number, data: any) => {
    return prisma.booking.update({ where: { id }, data });
};

export const deleteBooking = async (id: number) => {
    return prisma.booking.delete({ where: { id } });
};
