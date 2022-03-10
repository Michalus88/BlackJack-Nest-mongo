import { forwardRef, Module } from '@nestjs/common';
import { DeckModule } from 'src/deck/deck.module';
import { UserModule } from 'src/user/user.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [forwardRef(() => DeckModule), forwardRef(() => UserModule)],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
