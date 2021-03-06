import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'


import { CarItem } from '../models/CarItem'
import { CarUpdate } from '../models/CarUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('carsAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class CarsAccess {

  constructor(  
    private readonly docClient: DocumentClient = new DocumentClient(),
    private readonly carsTable = process.env.CARS_TABLE,
  ) {}

  async carItemExists(carId: string, userId: string): Promise<boolean> {
    const item = await this.getCarItem(carId, userId)
    return !!item
  }

  async getCarItems(userId: string): Promise<CarItem[]> {
    logger.info(`Getting all cars for user ${userId} from ${this.carsTable}`)

    const result = await this.docClient.query({
      TableName: this.carsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} cars for user ${userId} in ${this.carsTable}`)

    return items as CarItem[]
  }

  async getCarItem(carId: string, userId: string): Promise<CarItem> {
    logger.info(`Getting car ${carId} from ${this.carsTable}`)

    const result = await this.docClient.get({
      TableName: this.carsTable,
      Key: {
        userId: userId,
        carId: carId
      }
    }).promise()

    const item = result.Item

    return item as CarItem
  }

  async createCarItem(carItem: CarItem) {
    logger.info(`Putting car ${carItem.carId} into ${this.carsTable}`)

    await this.docClient.put({
      TableName: this.carsTable,
      Item: carItem,
    }).promise()
  }

  async updateCarItem(carId: string, userId: string, carUpdate: CarUpdate) {
    logger.info(`Updating car item ${carId} for user ${userId}: ${carUpdate.purchased}`)

    await this.docClient.update({
      TableName: this.carsTable,
      Key: {
        userId: userId,
        carId: carId
      },
      UpdateExpression: 'set purchased = :purchased',
      ExpressionAttributeValues: {
        ':purchased': carUpdate.purchased      
      },
      ReturnValues: "UPDATED_NEW"
      }).promise()   
  }

  async deleteCarItem(carId: string, userId: string) {
    logger.info(`Deleting car item ${carId} from ${this.carsTable}`)

    await this.docClient.delete({
      TableName: this.carsTable,
      Key: {
        userId: userId,
        carId: carId
      }
    }).promise()    
  }

  async updateAttachmentUrl(carId: string, userId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for car ${carId} in ${this.carsTable}`)

    await this.docClient.update({
      TableName: this.carsTable,
      Key: {
        userId: userId,
        carId: carId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

}
