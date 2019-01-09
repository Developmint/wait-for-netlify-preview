import Octokit from '@octokit/rest'
import pWaitFor from 'p-wait-for'
import consola from 'consola'

const SimpleReporter = class {
  constructor({ stream } = {}) {
    this.stream = stream || process.stdout
  }

  log(logObj) {
    this.stream.write(`${logObj.args[0]}\n`)
  }
}

consola.setReporters(new SimpleReporter())
const octokit = new Octokit()

const [owner, repo] = process.env.TRAVIS_REPO_SLUG.split('/')
const ref = process.env.TRAVIS_PULL_REQUEST_SHA

const getSuccessfulDeployment = async () => {
  octokit.authenticate({ token: process.env.GITHUB_API_TOKEN, type: 'oauth' })

  const { data: { statuses } } = await octokit.repos.getCombinedStatusForRef({ owner, ref, repo })

  return statuses.find(({ context, state }) => /^netlify\/.*\/deploy-preview$/.test(context) && state === 'success')
}

const deployed = async () => Boolean(await getSuccessfulDeployment())

;(async () => {
  await pWaitFor(deployed, { interval: 15000 })

  const { target_url: targetUrl } = await getSuccessfulDeployment()
  // eslint-disable-next-line no-console
  consola.log(targetUrl)
  return targetUrl
})()
