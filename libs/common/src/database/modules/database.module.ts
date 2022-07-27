import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose_autopopulate from 'mongoose-autopopulate';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // connectionFactory: (connection) => {
        //   const AutoIncrement = AutoIncrementFactory(connection);
        //   connection.plugin(AutoIncrement, { inc_field: 'seq' });
        //   return connection;
        // },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
