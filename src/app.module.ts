import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'leaderboard',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    RedisModule,
    LeaderboardModule,
  ],
})
export class AppModule { }
