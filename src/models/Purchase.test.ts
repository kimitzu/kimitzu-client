import Purchase from './Purchase'

test('Purchase test', async () => {
  const purchases = await Purchase.getPurchases()
  console.log(purchases)
})
