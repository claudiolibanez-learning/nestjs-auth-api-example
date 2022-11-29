import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// dtos
import { CreateTokenDto } from '../dtos/create-token.dto';

// entities
import { Token } from '../entities/token.entity';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  public async findOne(id: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByToken(tokenId: string, userId: string): Promise<Token> {
    return this.tokenRepository.findOne({
      where: {
        id: tokenId,
        userId,
      },
    });
  }

  async create({ userId, type, expiresAt }: CreateTokenDto): Promise<Token> {
    const data = new Token();
    data.userId = userId;
    data.type = type;
    data.expiresAt = expiresAt;

    return this.tokenRepository.save(data);
  }

  async deleteAllTokensByType(userId: string, type: string): Promise<void> {
    await this.tokenRepository.delete({
      userId,
      type,
    });
  }
}
