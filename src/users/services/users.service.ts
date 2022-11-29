import { Injectable, NotFoundException } from '@nestjs/common';

// helpers
import { MessagesHelper } from '../../helpers/messages.helpers';

// dtos
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

// repositories
import { UsersRepository } from '../repositories/users.repository';

// entities
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  public async findOne(id: string): Promise<User> {
    try {
      return this.usersRepository.findOneOrFail({
        where: { id },
      });
    } catch {
      throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    try {
      return this.usersRepository.findOneByEmail(email);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  public async create({ email, ...rest }: CreateUserDto): Promise<User> {
    try {
      const userAlreadyExists = await this.usersRepository.findOneByEmail(
        email,
      );

      if (userAlreadyExists) {
        throw new Error(MessagesHelper.USER_ALREADY_EXISTS);
      }

      return this.usersRepository.create({
        email,
        ...rest,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
