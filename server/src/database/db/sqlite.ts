import { join } from 'node:path'
import { cwd } from 'node:process'
import { Sequelize } from 'sequelize'

const storage = join(cwd(), 'storage/database.sqlite')

export function init() {
  // const sequelize = new Sequelize('sqlite::memory:')
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false,
    query: { raw: true },
    define: {
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  })

  return sequelize
}

export default { init }
