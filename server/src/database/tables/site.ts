import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'
import { SITE_VALID_ENUM } from '../../global'

export class Site extends Model {
  declare id: string
  declare domain: string
  declare valid: typeof SITE_VALID_ENUM[keyof typeof SITE_VALID_ENUM]
  declare create_time: string
  declare update_time: string
}

export default initSite

export function initSite(sequelize: Sequelize) {
  const site = Site.init({
    id: {
      unique: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'ID',
    },
    domain: {
      unique: true,
      type: DataTypes.STRING,
      primaryKey: true,
      comment: '域名',
    },
    valid: {
      type: DataTypes.INTEGER,
      defaultValue: SITE_VALID_ENUM.Invalid,
      comment: '是否有效',
    },
  }, {
    sequelize,
    tableName: 'site',
  })

  return site
}
