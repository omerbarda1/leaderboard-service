import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class LeaderboardService {
    private readonly redisKey = 'leaderboard';

    constructor(
        private readonly redisService: RedisService,
        private readonly usersService: UsersService,
    ) { }

    private get redis() {
        return this.redisService.getClient();
    }

    async addUser(name: string, imageUrl?: string, score = 0): Promise<User> {
        const user = await this.usersService.createUser(name, imageUrl, score);

        await this.redis.zadd(this.redisKey, score, user.id);

        return user;
    }

    async updateUserScore(userId: string, newScore: number): Promise<void> {
        await this.redis.zadd(this.redisKey, newScore, userId);

        await this.usersService.updateUserScore(userId, newScore);
    }

    async getTopUsers(count: number): Promise<{ user: User; score: number }[]> {
        const idsWithScores = await this.redis.zrevrange(
            this.redisKey,
            0,
            count - 1,
            'WITHSCORES',
        );

        const ids: string[] = [];
        const scores: number[] = [];

        for (let i = 0; i < idsWithScores.length; i += 2) {
            ids.push(idsWithScores[i]);
            scores.push(Number(idsWithScores[i + 1]));
        }

        const users = await this.usersService.getUsersByIds(ids);

        // match order
        const usersById = new Map(users.map((u) => [u.id, u]));

        return ids.map((id, index) => {
            const user = usersById.get(id)
            if (!user) throw new Error(`Cannot find user with the Id ${id}`);
            return {
                user,
                score: scores[index],
            }
        });
    }

    async getUserRankAndSurrounding(userId: string): Promise<{ user: User; score: number; rank: number }[]> {
        const rank = await this.redis.zrevrank(this.redisKey, userId);
        if (rank === null) return [];

        const start = Math.max(rank - 5, 0);
        const end = rank + 5;

        const idsWithScores = await this.redis.zrevrange(this.redisKey, start, end, 'WITHSCORES');

        const ids: string[] = [];
        const scores: number[] = [];

        for (let i = 0; i < idsWithScores.length; i += 2) {
            ids.push(idsWithScores[i]);
            scores.push(Number(idsWithScores[i + 1]));
        }

        const users = await this.usersService.getUsersByIds(ids);

        const usersById = new Map(users.map((u) => [u.id, u]));

        return ids.map((id, idx) => {
            const user = usersById.get(id);
            if (!user) {
                throw new Error(`Cannot find user with the Id ${id}`);
            }

            return {
                user,
                score: scores[idx],
                rank: start + idx + 1,
            };
        });
    }
}
