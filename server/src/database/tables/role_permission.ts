import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class RolePermission extends Model {
  declare id: string
  declare rid: string
  declare pid: string
  declare create_time: string
  declare update_time: string
}

export default initRolePermission

export function initRolePermission(sequelize: Sequelize) {
  const role_permission = RolePermission.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'ID',
    },
    rid: {
      type: DataTypes.UUID,
      comment: '角色ID',
    },
    pid: {
      type: DataTypes.UUID,
      comment: '权限ID',
    },
  }, {
    sequelize,
    tableName: 'role_permission',
  })

  return role_permission
}
