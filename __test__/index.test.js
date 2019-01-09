import nock from 'nock'
import pWaitFor from 'p-wait-for'
import consola from 'consola'
import combinedStatusResponse from './combined-status-response'

process.env.TRAVIS_REPO_SLUG = 'manniL/lichter.io'
process.env.TRAVIS_PULL_REQUEST_SHA = '50ad1b7dccafa9b08ee3fe70b18df5cce3b6c4b0'
process.env.GITHUB_API_TOKEN = '111'

beforeEach(() => {
  consola.mockTypes(() => jest.fn())
})

nock('https://api.github.com')
  .persist()
  .get(`/repos/${process.env.TRAVIS_REPO_SLUG}/commits/${process.env.TRAVIS_PULL_REQUEST_SHA}/status`)
  .query({ access_token: '111' })
  .reply(200, combinedStatusResponse)

test('it calls console.log with deployed url', async () => {
  require('..')
  await pWaitFor(() => consola.log.mock.calls.length > 0)

  const consolaMessages = consola.log.mock.calls.map(c => c[0])
  expect(consolaMessages).toContain(combinedStatusResponse.statuses[0].target_url)
}, 30000)
