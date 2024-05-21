import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class Site extends Model {
  declare id: string
  declare domain: string
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
  }, {
    sequelize,
    tableName: 'site',
  })

  return site
}
