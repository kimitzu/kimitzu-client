import Sale from './Sale'

test('Sale test', async () => {
  const sales = await Sale.getSales()
  console.log(sales)
})
