import type { HttpContext } from '@adonisjs/core/http';
import StockService from '#services/stock_service';

export default class ItemsController {
  async index({ response }: HttpContext) {
    const stockService = new StockService();

    const stockList = await stockService.fetchStock();

    return response.status(200).send(stockList);
  }

  async show({ params, response }: HttpContext) {
    const stockService = new StockService();
    const item = await stockService.fetchSingleItem(params.id);
    if (!item) {
      return response.notFound();
    }
    return response.status(200).send(item);
  }
}
