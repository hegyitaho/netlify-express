import fs from 'fs'
import {loadSite} from '../converted-menu'

export function loadBeresAlexandraTestDouble(): CheerioStatic {
  const body = fs.readFileSync('test-resources/beresalexandra-aktualis-etlap.html')
  return loadSite(body)
}
