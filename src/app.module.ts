import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { SharedModule } from './common/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ProductModule } from './product/product.module';
import { TopicModule } from './topic/topic.module';
// import { CartModule } from './cart/cart.module';
import { CartModule } from './newCart/cart.module';
import { MONGO_DB_CONNECTION } from './config/configuration';
// import { OrderModule } from './order/order.module';
import { OrderModule } from './newOrder/order.module';
import { XenditModule } from './xendit/xendit.module';
import { RajaongkirModule } from './rajaongkir/rajaongkir.module';

import { ProvinceModule } from './provinces/province.module';
import { SubdistrictModule } from './subdistricts/subdistrict.module';

import { PaymentAccountModule } from './payment/account/account.module';
import { PaymentMethodModule } from './payment/method/method.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    MONGO_DB_CONNECTION,
    // SharedModule,
    AuthModule,
    UserModule,
    ProfileModule,
    TopicModule,
    ProductModule,
    // CartModule,
    CartModule,
    OrderModule,
    XenditModule,
    RajaongkirModule,
    ProvinceModule,
    SubdistrictModule,
    PaymentAccountModule,
    PaymentMethodModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
