/* eslint-disable require-atomic-updates */
'use strict'
import express, {Router} from 'express'
import {join} from 'path'
import serverless from 'serverless-http'
import {json} from 'body-parser'
import {getSiteMenu} from '../scraping/beresalexandra/converted-menu'
import {FoodData} from '../scraping/beresalexandra/utils/FoodData'
import {dummyFoodDataForAWeek} from '../scraping/beresalexandra/utils/test-utils'

export const app = express()

const router = Router()
router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write('<h1>Hello from Express.js!</h1>')
  res.end()
})

const beresalexandra = Router()
router.use('/beresalexandra', beresalexandra)
beresalexandra.get('/', (req, res) => res.send('hello!!!!!!!!!!!!!!!'))
beresalexandra.get('/current', async (req, res) => res.json(await beresalexandraCurrentMenu()))
beresalexandra.get('/next', async (req, res) => res.json(await beresalexandraNextMenu()))
beresalexandra.get('/dummy', async (req, res) => res.json(await dummyFoodDataForAWeek()))

app.use(json())
app.use('/.netlify/functions', router)  // path must route to lambda
app.use('/', (req, res) => res.sendFile(join(__dirname, './index.html')))

export const handler = serverless(app)

let currentMenu, nextMenu: FoodData[]

async function beresalexandraCurrentMenu() {
  if (!currentMenu) {
    currentMenu = await getSiteMenu()
  }
  return currentMenu
}

async function beresalexandraNextMenu() {
  if (!nextMenu) {
    nextMenu = await getSiteMenu({next: true})
  }
  return nextMenu
}
