import { CarsAccess  } from '../db/carAccess'
import { AttachmentUtils } from '../db/attachmentUtils';
import { CarItem } from '../models/CarItem'
import { CreateCarRequest } from '../requests/CreateCarRequest'
import { UpdateCarRequest } from '../requests/UpdateCarRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { CarUpdate } from '../models/CarUpdate'

const logger = createLogger('cars')

const carsAccess  = new CarsAccess ()
const attachmentUtils = new AttachmentUtils()

export async function getCars(userId: string): Promise<CarItem[]> {
    logger.info(`Retrieving all cars for user ${userId}`, { userId })
  
    return await carsAccess .getCarItems(userId)
  }
  

export async function createCar(userId: string, createCarRequest: CreateCarRequest): Promise<CarItem> {
    const carId = uuid.v4()
  
    const newItem: CarItem = {
      userId,
      carId,
      createdAt: new Date().toISOString(),
      attachmentUrl: null,
      purchased: false,
      ...createCarRequest
    }
  
    logger.info(`Creating todo ${carId} for user ${userId}`, { userId, carId, carItem: newItem })
  
    await carsAccess.createCarItem(newItem)
  
    return newItem
  }

  export async function updateCar(userId: string, carId: string, updateCarRequest: UpdateCarRequest) {
    logger.info(`Updating todo ${carId} for user ${userId}`, { userId, carId, todoUpdate: updateCarRequest })
  
    const item = await carsAccess.getCarItem(carId, userId)
  
    if (!item)
      throw new Error('Item not found')  // FIXME: 404?
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to update car ${carId}`)
      throw new Error('User is not authorized to update item')  // FIXME: 403?
    }
  
    carsAccess.updateCarItem(carId, userId, updateCarRequest as CarUpdate)
  }

  export async function deleteCar(userId: string, carId: string) {
    logger.info(`Deleting car ${carId} for user ${userId}`, { userId, carId })
  
    const item = await carsAccess.getCarItem(carId, userId)
  
    if (!item)
      throw new Error('Item not found')  // FIXME: 404?
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to delete car ${carId}`)
      throw new Error('User is not authorized to delete item')  // FIXME: 403?
    }
  
    carsAccess.deleteCarItem(carId, userId)
  }

  export async function updateAttachmentUrl(userId: string, carId: string, attachmentId: string) {
    logger.info(`Generating attachment URL for attachment ${attachmentId}`)
  
    const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)
  
    logger.info(`Updating car ${carId} with attachment URL ${attachmentUrl}`, { userId, carId })
  
    const item = await carsAccess.getCarItem(carId, userId)
  
    if (!item)
      throw new Error('Item not found')  // FIXME: 404?
  
    if (item.userId !== userId) {
      logger.error(`User ${userId} does not have permission to update car ${carId}`)
      throw new Error('User is not authorized to update item')  // FIXME: 403?
    }
  
    await carsAccess.updateAttachmentUrl(carId, userId, attachmentUrl)
  }

  export async function generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Generating upload URL for attachment ${attachmentId}`)
  
    const uploadUrl = await attachmentUtils.getUploadUrl(attachmentId)
  
    return uploadUrl
  }

