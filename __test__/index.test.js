/* eslint import/first: "off" */
jest.mock('@octokit/rest', () => {
  class Octokit {
    constructor() {
      this.repos = {
        getCombinedStatusForRef: Octokit.getCombinedStatusForRef
      }
    }
  }

  Octokit.getCombinedStatusForRef = jest.fn()

  return Octokit
})
import Octokit from '@octokit/rest'
import pWaitFor from 'p-wait-for'
import consola from 'consola'
import combinedStatusResponse from './combined-status-response'
import combinedStatusFailedResponse from './combined-status-failed-response'

beforeEach(() => {
  Octokit.getCombinedStatusForRef.mockReset()
  consola.mockTypes(() => jest.fn())

  process.env.TRAVIS_REPO_SLUG = 'manniL/lichter.io'
  process.env.TRAVIS_PULL_REQUEST_SHA = '50ad1b7dccafa9b08ee3fe70b18df5cce3b6c4b0'
  process.env.GITHUB_API_TOKEN = '111'
})

const requireMain = () => {
  jest.isolateModules(() => {
    require('../main')
  })
}

test('it throws when deploy preview failed', async () => {
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {})

  Octokit.getCombinedStatusForRef.mockResolvedValue({
    data: combinedStatusFailedResponse
  })

  try {
    requireMain()
    await pWaitFor(() => consola.errors.mock.calls.length > 0)
  } catch (e) {}

  expect(exit).toHaveBeenCalledWith(1)

  // Disable mocks
  exit.mockRestore()
})

test('it calls console.log with deployed url', async () => {
  Octokit.getCombinedStatusForRef.mockResolvedValue({
    data: combinedStatusResponse
  })

  requireMain()
  await pWaitFor(() => consola.log.mock.calls.length > 0)

  expect(consola.log).toHaveBeenCalledWith(expect.stringContaining(
    combinedStatusResponse.statuses[0].target_url
  ))
})

test('it works with deploy/netlify status', async () => {
  /* eslint-disable camelcase */
  const target_url = `https://deploy-preview-26--something-different.netlify.com`
  const combinedStatusResponseWithChangedContext = {
    ...combinedStatusResponse,
    repository: {
      ...combinedStatusResponse.repository,
      full_name: `dschau/some-repo`
    },
    statuses: [
      {
        ...combinedStatusResponse.statuses[0],
        context: 'deploy/netlify',
        target_url
      }
    ]
  }
  process.env.TRAVIS_REPO_SLUG = combinedStatusResponseWithChangedContext.repository.full_name

  Octokit.getCombinedStatusForRef.mockResolvedValue({
    data: combinedStatusResponseWithChangedContext
  })

  requireMain()
  await pWaitFor(() => consola.log.mock.calls.length > 0)

  expect(consola.log).toHaveBeenCalledWith(
    expect.stringContaining(target_url)
  )
})
