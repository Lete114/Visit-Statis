import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class UserSite extends Model {
  declare id: string
  declare uid: string
  declare sid: string
  declare create_time: string
  declare update_time: string
}

export default initUserSite

export function initUserSite(sequelize: Sequelize) {
  const user_site = UserSite.init({
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
    sid: {
      type: DataTypes.UUID,
      comment: '网站ID',
    },
  }, {
    sequelize,
    tableName: 'user_site',
  })

  return user_site
}
