import { runTests } from '../src/test/harness/index.js'

const results = runTests()

console.log('='.repeat(56))
console.log('PEGGER TEST SUITE')
console.log('='.repeat(56))
console.log(`Passed: ${results.passed}`)
console.log(`Failed: ${results.failed}`)
console.log(`Total:  ${results.total}`)

results.results.forEach(result => {
  const icon = result.status === 'success' ? 'OK' : 'FAIL'
  console.log(`${icon} ${result.type}: ${result.name}`)
})

if (results.failed > 0) {
  process.exit(1)
}
