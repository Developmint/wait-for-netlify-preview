import nock from 'nock'
import pWaitFor from 'p-wait-for'
import consola from 'consola'
import combinedStatusResponse from './combined-status-response'
import combinedStatusFailedResponse from './combined-status-failed-response'

nock.disableNetConnect()

beforeEach(() => {
  consola.mockTypes(() => jest.fn())
  nock.cleanAll()
})

process.env.TRAVIS_REPO_SLUG = 'manniL/lichter.io'
process.env.TRAVIS_PULL_REQUEST_SHA = '50ad1b7dccafa9b08ee3fe70b18df5cce3b6c4b0'
process.env.GITHUB_API_TOKEN = '111'

test('it throws when deploy preview failed', async () => {
  nock('https://api.github.com')
    .persist()
    .get(`/repos/${process.env.TRAVIS_REPO_SLUG}/commits/${process.env.TRAVIS_PULL_REQUEST_SHA}/status`)
    .reply(200, combinedStatusFailedResponse)

  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {})
  try {
    require('../main')
    await pWaitFor(() => false, { timeout: 15000 })
  } catch (e) {}

  expect(exit).toHaveBeenCalledWith(1)

  // Disable mocks
  exit.mockRestore()
}, 30000)

test('it calls console.log with deployed url', async () => {
  nock('https://api.github.com')
    .persist()
    .get(`/repos/${process.env.TRAVIS_REPO_SLUG}/commits/${process.env.TRAVIS_PULL_REQUEST_SHA}/status`)
    .reply(200, combinedStatusResponse)

  require('../main')
  await pWaitFor(() => consola.log.mock.calls.length > 0)

  const consolaMessages = consola.log.mock.calls.map(c => c[0])
  expect(consolaMessages).toContain(combinedStatusResponse.statuses[0].target_url)
}, 30000)
