import { PrismaClient, Booking, BookingStatus } from '@prisma/client'
const prisma = new PrismaClient()

export const createBooking = async (data: any) => {
  return prisma.booking.create({ data })
}

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      User: true,
      driver: {
        include: {
          unit: true,
        },
      },
    },
  })
}

export const getBookingById = async (id: number) => {
  return prisma.booking.findMany({ where: { id } })
}

export const getBookingByUserId = async (id: number) => {
  return prisma.booking.findMany({
    where: { userId: id },
    include: { driver: true },
  })
}

export const getBookingByDriverId = async (id: number) => {
  return prisma.booking.findMany({
    where: { driverId: id },
    include: { User: true },
  })
}

export const updateBooking = async (id: number, data: any) => {
  return prisma.booking.update({ where: { id }, data })
}

export const deleteBooking = async (id: number) => {
  return prisma.booking.delete({ where: { id } })
}

export const updateBookingStatus = async (
  bookingId: number,
  status: BookingStatus,
) => {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })
}
