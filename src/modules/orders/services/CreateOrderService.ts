import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError("This customer doesn't exist");
    }

    const productsIdsList = products.map(({ id }) => ({ id }));
    const allProducts = await this.productsRepository.findAllById(
      productsIdsList,
    );

    if (allProducts.length < products.length) {
      throw new AppError(
        'There are one or more products that do not exist in this order',
      );
    }

    const orderProducts: Pick<ICreateOrderDTO, 'products'> = { products: [] };
    const productsQuantityUpdate: IUpdateProductsQuantityDTO[] = [];

    products.forEach(product => {
      const productOnDatabase = allProducts.find(
        dataBaseData => dataBaseData.id === product.id,
      ) as Product;

      if (productOnDatabase.quantity < product.quantity) {
        throw new AppError(
          'There not enough products in stock to complete this order',
        );
      }

      productsQuantityUpdate.push({
        id: product.id,
        quantity: productOnDatabase.quantity - product.quantity,
      });

      orderProducts.products.push({
        product_id: product.id,
        quantity: product.quantity,
        price: productOnDatabase.price,
      });
    });

    await this.productsRepository.updateQuantity(productsQuantityUpdate);

    return this.ordersRepository.create({
      customer,
      products: orderProducts.products,
    });
  }
}

export default CreateOrderService;
