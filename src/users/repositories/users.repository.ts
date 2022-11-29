import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

// dtos
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

// entities
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles'],
    });
  }

  public async findOneOrFail(options?: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(options);

    return user;
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
      withDeleted: true,
    });

    return user;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneOrFail({ where: { id } });

    const userMerged = this.usersRepository.merge(user, updateUserDto);

    return this.usersRepository.save(userMerged);
  }

  public async delete(id: string): Promise<void> {
    const user = await this.findOneOrFail({ where: { id } });

    this.usersRepository.softDelete(user.id);
  }
}
