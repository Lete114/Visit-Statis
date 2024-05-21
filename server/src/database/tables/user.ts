import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class User extends Model {
  declare id: string
  declare mail: string
  declare password: string
  declare create_time: string
  declare update_time: string
}

export default initUser

export function initUser(sequelize: Sequelize) {
  const user = User.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: '用户ID',
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '邮箱',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '密码',
    },
  }, {
    sequelize,
    tableName: 'user',
  })

  return user
}
