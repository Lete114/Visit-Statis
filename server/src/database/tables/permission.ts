import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class Permission extends Model {
  declare id: string
  declare name: string
  declare create_time: string
  declare update_time: string
}

export default initPermission

export function initPermission(sequelize: Sequelize) {
  const permission = Permission.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: '权限ID',
    },
    name: {
      type: DataTypes.STRING,
      comment: '权限名',
    },
  }, {
    sequelize,
    tableName: 'permission',
  })

  return permission
}
