import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

// dtos
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

// entities
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  public async findOne(id: string): Promise<Role> {
    return this.rolesRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findOneOrFail(options?: FindOneOptions<Role>): Promise<Role> {
    return this.rolesRepository.findOneOrFail(options);
  }

  public async findOneByName(name: string): Promise<Role> {
    return this.rolesRepository.findOne({
      where: {
        name,
      },
    });
  }

  public async findOneByNameOrFail(name: string): Promise<Role> {
    return this.rolesRepository.findOneOrFail({
      where: {
        name,
      },
    });
  }

  public async findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  public async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);

    return this.rolesRepository.save(role);
  }

  public async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.rolesRepository.findOneOrFail({
      where: {
        id,
      },
    });

    const roleMerge = this.rolesRepository.merge(role, updateRoleDto);

    return this.rolesRepository.save(roleMerge);
  }

  public async delete(id: string): Promise<void> {
    const role = await this.rolesRepository.findOneOrFail({
      where: {
        id,
      },
    });

    await this.rolesRepository.remove(role);
  }
}
