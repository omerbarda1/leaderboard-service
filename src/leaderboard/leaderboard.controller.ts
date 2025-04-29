import { Controller, Get, Param, Query, Post, Body, Patch } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getTopUsers(@Query('limit') limit: number = 10) {
    return this.leaderboardService.getTopUsers(limit);
  }

  @Get(':userId/position')
  getUserRank(@Param('userId') userId: string) {
    return this.leaderboardService.getUserRankAndSurrounding(userId);
  }

  @Post()
  addUser(
    @Body()
    body: { name: string; imageUrl?: string; score?: number },
  ) {
    return this.leaderboardService.addUser(body.name, body.imageUrl, body.score);
  }

  @Patch(':userId')
  updateScore(
    @Param('userId') userId: string,
    @Body() body: { score: number },
  ) {
    return this.leaderboardService.updateUserScore(userId, body.score);
  }
}
