/* eslint-disable require-atomic-updates */
'use strict'
import express, {Router} from 'express'
import {join} from 'path'
import serverless from 'serverless-http'
import {json} from 'body-parser'
import {getSiteMenu} from '../scraping/beresalexandra/converted-menu'
import {FoodData} from '../scraping/beresalexandra/utils/FoodData'
import {loadBeresAlexandraTestDouble} from '../scraping/beresalexandra/utils/test-utils'

export const app = express()

const router = Router()
router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write('<h1>Hello from Express.js!</h1>')
  res.end()
})
router.get('/beresalexandra/current', async (req, res) => res.json(await beresalexandraCurrentMenu()))
router.get('/beresalexandra/next', async (req, res) => res.json(await beresalexandraNextMenu()))
router.get('/beresalexandra/dummy', async (req, res) => res.json(loadBeresAlexandraTestDouble()))
router.post('/', (req, res) => res.json({postBody: req.body}))

app.use(json())
app.use('/.netlify/functions/server', router)  // path must route to lambda
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
