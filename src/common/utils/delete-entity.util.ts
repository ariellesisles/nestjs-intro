import { Delete, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { DeleteType } from '../../posts/enums/delete-type.enum';

/**
 * Delete an entity by ID
 * @param repository TypeORM repository  of the entity
 * @param id ID of the entity to delete
 * @param entityName Name of the entity used for the error message
 * @param deleteType - Specifies whether to perform a hard or soft delete.
 * @returns An object confirming deletion, containing `deleted: true` and entity ID
 * @throws NotFoundException when entity does not exists
 */
export async function deleteEntity<T extends ObjectLiteral>(
  repository: Repository<T>,
  id: number,
  entityName: string,
  deleteType: DeleteType = DeleteType.HARD,
): Promise<{ deleted: true; id: number }> {
  const { affected } =
    deleteType === DeleteType.HARD
      ? await repository.delete(id)
      : await repository.softDelete(id);

  if (!affected) {
    throw new NotFoundException(`${entityName} with ID ${id} not found`);
  }
  return {
    deleted: true,
    id,
  };
}
