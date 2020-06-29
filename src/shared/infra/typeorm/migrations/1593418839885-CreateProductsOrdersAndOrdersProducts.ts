import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProductsOrdersAndOrdersProducts1593418839885
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const productTable = new Table({
      name: 'products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'name',
          type: 'varchar',
          isUnique: true,
        },
        {
          name: 'price',
          type: 'decimal',
          scale: 2,
          precision: 10,
        },
        {
          name: 'quantity',
          type: 'int',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });
    await queryRunner.createTable(productTable);

    const ordersTable = new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'customer_id',
          type: 'uuid',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          name: 'customerOfOrder',
          referencedTableName: 'customers',
          referencedColumnNames: ['id'],
          columnNames: ['customer_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
    });
    await queryRunner.createTable(ordersTable);

    const ordersProductsTable = new Table({
      name: 'orders_products',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'order_id',
          type: 'uuid',
        },
        {
          name: 'product_id',
          type: 'uuid',
        },
        {
          name: 'price',
          type: 'decimal',
          scale: 2,
          precision: 10,
        },
        {
          name: 'quantity',
          type: 'int',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          name: 'productOfOrder',
          referencedTableName: 'products',
          referencedColumnNames: ['id'],
          columnNames: ['product_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        {
          name: 'orderOfOrders',
          referencedTableName: 'orders',
          referencedColumnNames: ['id'],
          columnNames: ['order_id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
    });
    await queryRunner.createTable(ordersProductsTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders_products');
    await queryRunner.dropTable('orders');
    await queryRunner.dropTable('products');
  }
}
