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

export const retrieveUnits = async (unitId?: number) => {
  
  if (unitId) {
    return await prisma.unit.findUnique({
      where: {
        id: unitId,
      },
      include: {
        operations: true,
        driver: true,
      }
    })
  }

  return await prisma.unit.findMany({
    include: {
      driver: true,
    }
  })
}

//TODO: update, create, delete units
