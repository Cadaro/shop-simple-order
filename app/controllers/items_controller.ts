import type { HttpContext } from '@adonisjs/core/http';
import StockService from '#services/stock_service';
import { IItem } from '#types/item';
import { IResponseError, StatusCodeEnum } from '#types/response';
import ResponseErrorHandler from '#exceptions/response';

export default class ItemsController {
  async index({ response }: HttpContext) {
    const stockService = new StockService();

    const stockList = await stockService.fetchAvailableStock();

    return response.status(200).send(stockList);
  }

  async show({ params, response }: HttpContext) {
    const stockService = new StockService();
    const item = await stockService.fetchSingleItem(params.id);
    if (!item) {
      const error: IResponseError = { errors: [{ message: `Item ${params.id} not found` }] };
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, error);
    }
    return response.status(200).send(item.serialize() as IItem);
  }
}
