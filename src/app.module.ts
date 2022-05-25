import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { DeckModule } from './deck/deck.module';
import { PlayerModule } from './player/player.module';
import { SendgidService } from './sendgid/sendgid.service';
import { SendgidController } from './sendgid/sendgid.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthModule,
    GameModule,
    DeckModule,
    PlayerModule,
  ],
  controllers: [AppController, SendgidController],
  providers: [AppService, SendgidService],
})
export class AppModule {}
