import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class Stats extends Model {
  declare id: string
  declare total_visitors: string
  declare total_visits: number
  declare create_time: string
  declare update_time: string
}

export default initStats

export function initStats(sequelize: Sequelize) {
  const stats = Stats.init({
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      comment: 'ID (区分不同页面)',
    },
    sid: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
      comment: '网站ID (网站表的外键)',
    },
    total_visitors: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
      comment: '总访客数',
    },
    total_visits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '总访问量',
    },
  }, {
    sequelize,
    tableName: 'stats',
  })

  return stats
}
