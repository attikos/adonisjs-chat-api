'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('content', 2048).notNullable()
      table.integer('user_id').notNullable().references('id').inTable('users')
      table.boolean('uploaded').notNullable().defaultTo(false)
      table.boolean('viewed').notNullable().defaultTo(false)
      table.enu('type', ['text', 'image'], { useNative: true, enumName: 'messages_type' }).defaultTo('text')
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema
