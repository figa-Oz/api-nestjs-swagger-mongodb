import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderSchema } from './schemas/order.schema';

import { ProductModule } from '../product/product.module';
import { CartModule } from '../newCart/cart.module';
import { PaymentAccountModule } from '../payment/account/account.module';
import { PaymentMethodModule } from '../payment/method/method.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema }
    ]),
    AuthModule,
    CartModule,
    ProductModule,
    PaymentAccountModule,
    PaymentMethodModule,
    PaymentModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
