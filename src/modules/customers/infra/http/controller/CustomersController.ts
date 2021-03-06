import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const createCustomer = container.resolve(CreateCustomerService);

    const newCustomer = await createCustomer.execute({
      name,
      email,
    });

    return response.json(classToClass(newCustomer));
  }
}
