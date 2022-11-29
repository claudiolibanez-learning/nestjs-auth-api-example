import { Injectable, NotFoundException } from '@nestjs/common';

// helpers
import { MessagesHelper } from '../../helpers/messages.helpers';

// reoisitories
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  public async findOne(id: string) {
    try {
      return this.rolesRepository.findOneOrFail({
        where: { id },
      });
    } catch {
      throw new NotFoundException(MessagesHelper.ROLE_NOT_FOUND);
    }
  }

  public async findOneByName(name: string) {
    return this.rolesRepository.findOneByName(name);
  }

  public async findOneByNameOrFail(name: string) {
    try {
      return this.rolesRepository.findOneByNameOrFail(name);
    } catch {
      throw new NotFoundException(MessagesHelper.ROLE_NOT_FOUND);
    }
  }

  public async findAll() {
    return this.rolesRepository.findAll();
  }

  public async create(createRoleDto) {
    const role = await this.rolesRepository.findOneByName(createRoleDto.name);

    if (role) {
      throw new NotFoundException(MessagesHelper.ROLE_ALREADY_EXISTS);
    }

    return this.rolesRepository.create(createRoleDto);
  }

  public async update(id: string, updateRoleDto) {
    try {
      return this.rolesRepository.update(id, updateRoleDto);
    } catch {
      throw new NotFoundException(MessagesHelper.ROLE_NOT_FOUND);
    }
  }

  public async delete(id: string) {
    try {
      return this.rolesRepository.delete(id);
    } catch {
      throw new NotFoundException(MessagesHelper.ROLE_NOT_FOUND);
    }
  }
}
