import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(username: string, imageUrl?: string, score = 0): Promise<User> {
    const user = this.usersRepository.create({ username, imageUrl, score });
    return this.usersRepository.save(user);
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateUserScore(id: string, score: number): Promise<void> {
    await this.usersRepository.update(id, { score });
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    return this.usersRepository.findByIds(ids);
  }
}
