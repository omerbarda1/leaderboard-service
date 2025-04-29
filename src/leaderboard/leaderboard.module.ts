import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [UsersModule, RedisModule],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
