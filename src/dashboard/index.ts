import '../app.pcss'
import Dashboard from '../components/Dashboard.svelte'
import { storageSync } from '../storage'

async function render() {
  const target = document.getElementById('app')
  let forcedState =
    window.location.search === ''
      ? undefined
      : (window.location.search.slice(1) as DashboardForcedState)
  const { token, repo } = await storageSync.get()
  if (!token || !repo) {
    forcedState = 'welcome'
  }
  if (target) {
    new Dashboard({ target, props: { forcedState } })
  }
}

document.addEventListener('DOMContentLoaded', render)
