import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateCar } from '../../services/carService'
import { UpdateCarRequest } from '../../requests/UpdateCarRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateCar')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateCar event', { event })

  const userId = getUserId(event)
  const carId = event.pathParameters.carId
  const updatedCar: UpdateCarRequest = JSON.parse(event.body)

  await updateCar(userId, carId, updatedCar)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}