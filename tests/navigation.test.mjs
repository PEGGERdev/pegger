import assert from 'node:assert/strict'
import test from 'node:test'
import { projectNodeAction } from '../src/runtime/catalog/nodeActions.js'
import { createPeggerRuntime } from '../src/runtime/index.js'

test('normal star-map workflow exposes one shared project/contact action projection', () => {
  const view = createPeggerRuntime().getStarMapView()
  assert.equal(view.actionsByNode.portfolio.href, 'https://portfolio.pegger.dev/')
  assert.equal(view.actionsByNode.dev.href, 'https://dev.pegger.dev/')
  assert.equal(view.actionsByNode.contact.href, 'mailto:patrik.egger@email.ch')
  assert.equal(view.actionsByNode.contact.target, null)
  assert.equal(view.actionsByNode.linux, null)
  assert.equal(view.actionsByNode.portfolio.target, '_blank')
  assert.equal(view.actionsByNode.portfolio.rel, 'noopener noreferrer')
})

test('only absolute HTTPS without credentials or control characters becomes a link', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,unsafe', 'http://example.com', '//example.com', '/relative', 'https:example.com', 'https:\\example.com', 'https://user:pass@example.com', 'https://example.com\n', '', 'https://', 123]) {
    assert.equal(projectNodeAction({ label: 'Unsafe', data: { url } }), null, String(url))
  }
  assert.equal(projectNodeAction({ label: 'Safe', data: { url: 'https://example.com/path' } }).href, 'https://example.com/path')
})

test('mail has no headers, control characters or encoded payload and no implicit URL fallback', () => {
  for (const email of ['person@example.com?subject=unsafe', 'person@example.com\r\nBcc:other@example.com', 'person%0d@example.com', '.person@example.com', 'person..name@example.com', 'not-an-email', 'person@localhost']) {
    assert.equal(projectNodeAction({ data: { email } }), null, email)
  }
  assert.equal(projectNodeAction({ data: { email: 'person+work@example.com' } }).href, 'mailto:person+work@example.com')
  assert.equal(projectNodeAction({ data: { url: 'javascript:bad', email: 'person@example.com' } }), null)
})

test('missing nodes or targets have no navigational side effects', () => {
  for (const node of [null, undefined, {}, { data: {} }, { data: { facts: ['no destination'] } }]) assert.equal(projectNodeAction(node), null)
})
