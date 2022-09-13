import { forwardRef, Module } from '@nestjs/common';
import { DeckModule } from 'src/deck/deck.module';
import { PlayerModule } from 'src/player/player.module';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    forwardRef(() => DeckModule),
    forwardRef(() => UserModule),
    forwardRef(() => PlayerModule),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
