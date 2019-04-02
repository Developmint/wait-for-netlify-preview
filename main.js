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
const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_API_TOKEN}`
})

const [owner, repo] = process.env.TRAVIS_REPO_SLUG.split('/')
const ref = process.env.TRAVIS_PULL_REQUEST_SHA

const hasDeployPreview = context => [/^netlify\/.*\/deploy-preview$/, /^deploy\/netlify$/].some(expr => expr.test(context))
const successPreview = state => state === 'success'
const failedPreview = state => state === 'failure'

const getSuccessfulDeployment = async () => {
  const { data: { statuses } } = await octokit.repos.getCombinedStatusForRef({ owner, ref, repo })
  
  if (statuses.find(({ context, state }) => hasDeployPreview(context) && failedPreview(state))) {
    consola.error('Deploy preview failed')
    // Fail CI
    process.exit(1)
  }

  return statuses.find(({ context, state }) => hasDeployPreview(context) && successPreview(state))
}

const deployed = async () => Boolean(await getSuccessfulDeployment())
;(async () => {
  await pWaitFor(deployed, { interval: 15000 })

  const { target_url: targetUrl } = await getSuccessfulDeployment()
  consola.log(targetUrl)
  return targetUrl
})()
