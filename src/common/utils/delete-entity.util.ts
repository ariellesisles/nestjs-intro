import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

/**
 * Delete an entity by ID
 * @param repository TypeORM repository  of the entity
 * @param id ID of the entity to delete
 * @param entityName Name of the entity used for the error message
 * @returns An object confirming deletion, containing `deleted: true` and entity ID
 * @throws NotFoundException when entity does not exists
 */
export async function deleteEntity<T extends ObjectLiteral>(
  repository: Repository<T>,
  id: number,
  entityName: string,
): Promise<{ deleted: true; id: number }> {
  const { affected } = await repository.delete(id);

  if (!affected) {
    throw new NotFoundException(`${entityName} with ID ${id} not found`);
  }
  return {
    deleted: true,
    id,
  };
}
