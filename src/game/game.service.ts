import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DeckService } from 'src/deck/deck.service';
import { UserData } from 'src/interfaces/user';
import { PlayerService } from 'src/player/player.service';
import { UserService } from 'src/user/user.service';
import { sanitizeUser } from 'src/utils/sanitize-user';
import {
  GameResults,
  MAX_NUMBER_OF_POINTS,
  NUMBER_TO_WHICH_DEALER_MUST_TAKE_CARD,
} from './constant';
import { PlayerBetDto } from './dto/player-bet.dto';

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    private deckService: DeckService,
    private playerService: PlayerService,
  ) {}

  async initialize(user: UserData) {
    const player = await this.userService.findByEmail(user.email);
    this.checkToReset(player);
    this.deckService.dealCards(player);
    this.playerService.setPoints(player);

    await player.save();
    return sanitizeUser(player);
  }

  async setBet(user: UserData, playerBetDto: PlayerBetDto) {
    const player = await this.userService.findByEmail(user.email);
    this.isBetValidate(player, playerBetDto);

    player.means -= playerBetDto.bet;
    player.playerBet = playerBetDto.bet;
    player.isBet = true;

    await player.save();
    return sanitizeUser(player);
  }

  async playerChooseTheCard(user: UserData) {
    const player = await this.userService.findByEmail(user.email);
    this.checkToReset(player);
    this.gameValidate(player);

    player.playerCards.push(this.deckService.pickCard(player.deck));
    player.playerPoints = this.playerService.calculatePoints(
      player.playerCards,
    );

    if (player.playerPoints > MAX_NUMBER_OF_POINTS) {
      player.gameResult = GameResults.LOOSE;
      this.playerService.setMeans(player);

      player.save();
      return sanitizeUser(player);
    } else {
      player.save();
      return sanitizeUser(player);
    }
  }

  async playerStand(user: UserData) {
    const player = await this.userService.findByEmail(user.email);
    const { dealerPoints, dealerCards } = player;
    let dealerPointsUpdate = dealerPoints;
    this.checkToReset(player);
    this.gameValidate(player);

    while (dealerPointsUpdate <= NUMBER_TO_WHICH_DEALER_MUST_TAKE_CARD) {
      dealerCards.push(this.deckService.pickCard(player.deck));
      dealerPointsUpdate = this.playerService.calculatePoints(dealerCards);
    }
    if (dealerPoints >= NUMBER_TO_WHICH_DEALER_MUST_TAKE_CARD) {
      this.playerService.setGameResult(player);
    }
    this.playerService.setMeans(player);

    await player.save();
    return sanitizeUser(player);
  }

  checkToReset(player: UserData): void {
    if (player.gameResult !== GameResults.NO_RESULT) {
      this.playerService.resetAfterRoud(player);
    }
  }

  isBetValidate(player: UserData, playerBetDto: PlayerBetDto) {
    if (!player.isDeal) {
      throw new ForbiddenException('First you must have your cards dealt');
    }
    if (player.isBet) {
      throw new BadRequestException('Bet is already set');
    }
    if (playerBetDto.bet > player.means) {
      throw new BadRequestException(`You can't bet more than ${player.means}`);
    }
  }

  gameValidate(player: UserData) {
    if (player.means === 0 && player.playerBet === 0) {
      throw new ForbiddenException('You have no means');
    }
    if (!player.isDeal) {
      throw new ForbiddenException('First you must have your cards dealt');
    }
    if (!player.isBet) {
      throw new ForbiddenException('You have to bet first');
    }
  }
}
