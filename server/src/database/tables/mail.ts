import type { Sequelize } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export class Mail extends Model {
  declare id: string
  declare name: string
  declare password: string
  declare mail: string
  declare create_time: string
  declare update_time: string
}

export default initMail

export function initMail(sequelize: Sequelize) {
  const mail = Mail.init({
    mail: {
      unique: true,
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
      comment: '邮箱',
    },
    code: {
      allowNull: false,
      type: DataTypes.NUMBER,
      comment: '验证码',
    },
    expired_time: {
      allowNull: false,
      type: DataTypes.NUMBER,
      comment: '过期时间',
    },
  }, {
    sequelize,
    tableName: 'mail',
  })

  return mail
}
