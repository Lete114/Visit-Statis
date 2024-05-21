import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class Role extends Model {
  declare id: number
  declare uid: string
  declare name: string
  declare create_time: string
  declare update_time: string
}

export default initRole

export function initRole(sequelize: Sequelize) {
  const role = Role.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: '角色ID',
    },
    name: {
      type: DataTypes.STRING,
      comment: '角色名',
    },
  }, {
    sequelize,
    tableName: 'role',
  })

  return role
}
