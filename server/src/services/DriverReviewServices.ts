import { PrismaClient, DriverReview } from '@prisma/client';
const prisma = new PrismaClient();

export const createReview = async (reviewData: DriverReview) => {
    return prisma.driverReview.create({ data: reviewData });
};

export const getReviewById = async (id: number) => {
    return prisma.driverReview.findUnique({ where: { id } });
};

export const getReviewsByDriverId = async (driverId: number) => {
    return prisma.driverReview.findMany({ where: { driverId } });
};

export const updateReview = async (id: number, reviewData: Partial<DriverReview>) => {
    return prisma.driverReview.update({ where: { id }, data: reviewData });
};

export const deleteReview = async (id: number) => {
    return prisma.driverReview.delete({ where: { id } });
};

export const calculateAverageRating = async (driverId: number) => {
    const aggregate = await prisma.driverReview.aggregate({
        where: { driverId },
        _avg: { rating: true },
    });
    return aggregate._avg.rating;
};
