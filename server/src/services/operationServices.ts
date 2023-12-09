import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type Customer = {
  id: number
  firstName: string
  lastName: string
  address: string
}

type Driver = {
  id: number
  firstName: string
  lastName: string
  licenseNumber: string
  address: string
  birthdate: string
}

type Unit = {
  id: number
  model: String
  make: String
  number: String
  plateNumber: String
  runTime?: Date
  status: String
  driver: Driver
}

type OperationData = {
  unitId: number
  customerId: number
  location: string
  status: string
}

export const retrieveOperations = async () => {
  return await prisma.operation.findMany({
    include: {
      unit: {
        include: {
          driver: true,
        }
      },
      customer: true,
    }
  })
}

export const createOperation = async (operationData: OperationData) => {
  return await prisma.operation.create({
    data: {
      unitId: operationData.unitId,
      customerId: operationData.customerId,
      location: operationData.location,
      status: 'In Progress',
    },
  })
}

//TODO: update Operation
