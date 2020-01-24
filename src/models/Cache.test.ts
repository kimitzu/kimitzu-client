import { Cache } from './Cache'

test('Properly initialize initial object state', () => {
  const cache = new Cache()
  expect(JSON.stringify(cache)).toEqual(JSON.stringify({ cache: {} }))
})

test('Add cache entry', () => {
  const cache = new Cache()
  const realDateNow = Date.now.bind(global.Date)
  const dateNowStub = jest.fn(() => 3600000)
  global.Date.now = dateNowStub
  cache.store('test-key', 'test-value')

  expect(cache.retrieve('test-key')).toEqual('test-value')
  expect(JSON.stringify(cache)).toEqual(
    JSON.stringify({
      cache: {
        'test-key': {
          data: 'test-value',
          expiresOn: 3600000 + 3600000,
        },
      },
    })
  )
})

test('Cache expiration', () => {
  const cache = new Cache()
  const realDateNow = Date.now.bind(global.Date)
  const dateNowStub = jest.fn(() => 3600000)
  global.Date.now = dateNowStub
  cache.store('test-key', 'test-value')

  const dateExpireStub = jest.fn(() => 3600000 + 3600000)
  global.Date.now = dateExpireStub

  expect(cache.hasExpired('test-key')).toBe(true)
  expect(cache.retrieve('test-key')).toBe(false)

  global.Date.now = realDateNow
})
