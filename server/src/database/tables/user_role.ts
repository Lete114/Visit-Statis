import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class UserRole extends Model {
  declare id: string
  declare uid: string
  declare rid: string
  declare mail: string
  declare create_time: string
  declare update_time: string
}

export default initUserRole

export function initUserRole(sequelize: Sequelize) {
  const user_role = UserRole.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'ID',
    },
    uid: {
      type: DataTypes.UUID,
      comment: '用户ID',
    },
    rid: {
      type: DataTypes.UUID,
      comment: '角色ID',
    },
  }, {
    sequelize,
    tableName: 'user_role',
  })

  return user_role
}
