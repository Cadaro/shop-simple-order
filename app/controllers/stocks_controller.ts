import ResponseErrorHandler from '#exceptions/response';
import StockService from '#services/stock_service';
import { IResponseError, StatusCodeEnum } from '#types/response';
import { IStock } from '#types/stock';
import { createStockValidator } from '#validators/stock';
import type { HttpContext } from '@adonisjs/core/http';

export default class StocksController {
  async index({ response }: HttpContext) {
    const stockService = new StockService();

    const stocks = await stockService.fetchAvailableStock();

    return response.ok(stocks);
  }

  async show({ params, response }: HttpContext) {
    const stockService = new StockService();
    const singleStockItem = await stockService.fetchSingleStockItem(params.id);
    if (!singleStockItem) {
      const error: IResponseError = { errors: [{ message: `Stock item ${params.id} not found` }] };
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.NotFound, error);
    }
    return response.ok(singleStockItem.serialize() as IStock);
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized();
    }

    const singleStockItem = await request.validateUsing(createStockValidator);
    try {
      const stockService = new StockService();
      const createdSingleStockId = await stockService.createSingleItemStock(singleStockItem);
      return response.ok({ createdStockId: createdSingleStockId });
    } catch (e) {
      return new ResponseErrorHandler().handleError(response, StatusCodeEnum.BadRequest, e);
    }
  }
}
