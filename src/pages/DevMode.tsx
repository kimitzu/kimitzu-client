import faker from 'faker'
import React from 'react'
import { Button } from '../components/Button'
import ListingModel from '../models/Listing'

interface DevModeState {
  iterations: number
  output: string[]
}

class DevMode extends React.Component<{}, DevModeState> {
  constructor(props) {
    super(props)
    this.state = {
      iterations: 3,
      output: ['Ready'],
    }
    this.seed = this.seed.bind(this)
  }

  public generateFakeListingData(): any {
    const images = [
      {
        filename: 'image.png',
        large: 'QmWHauvVo9qf7jDs1hnCM5V2TLktoxgcSHKyZiA6rKMvMX',
        medium: 'Qmbu9Cii1Ce9hbE9LFgSfT5zigaeBK5HaDAh5zPv4k8Vci',
        original: 'QmdrfjPYp4RpbcVgar8CDbKUxipDBcXNUBE3CGZPo6NCaW',
        small: 'QmVZudFeqbAfXZnj5Q5rJuV6vwHZXjVgkkCqw2Td5J83zJ',
        tiny: 'QmTi624qDeNcX32T7rXg8U97ZNvgaJ3Mr2nsUE5Uw26qoW',
      },
      {
        filename: 'image.png',
        large: 'QmTXsWCcWFoCwgNQ6fYmu8Vqa4DMuaxu6DaxbE2AS1SBKq',
        medium: 'QmRCraQ1XKnvhNXXqtBhphc5cbn8PMxmeaNK9WYc5fs2RX',
        original: 'QmfFGdyhK3uNNn15WRKoHE5qtB3Ca9FJG8HD7z7kSL8TpJ',
        small: 'QmXT2PgXsC4XymEGZP9iFcX9FKKQZMQW5wiP7hxCvdZHxG',
        tiny: 'QmZgAEvnzhPTqPheojV7azwVo9uemfnZzFP5AdvVzGFdZU',
      },
      {
        large: 'QmfKuFeAivG25fCRuydq1cRC1BiWeJaKsE4Duq1f3z7iZo',
        medium: 'QmbSWVwquMmW6VyQjcKKH7mVtNEqzVCzbHePnrTGgNLJk6',
        original: 'QmY8qhyCtKzZMzfK57MvHjXKRjWjy9R1rLonYkSXs15msb',
        small: 'QmVeGxWVtueZwH1xVucyDvF39gFZ1ZA2MBhxmwKmsmwp3T',
        tiny: 'QmfRbRDF2yToysB7CV7jCPNbNDLbRS1fUMjxjfBS8WjGn7',
        filename: 'image.png',
      },
      {
        large: 'QmZsEBhcSuxLhGvVezhpyyyu8WTX2T4bSH46n5rkwtxd4K',
        medium: 'QmWjyHKWV23MH2WbFEimcVAEw3HkmAvqC4wemLeiCmSkYW',
        original: 'QmSbMRhuDsHdiKfxwucXv7SxoYAfoeCXaQids6t3zMUe1M',
        small: 'QmdENXeSSCN4GQUjcuEnQ2g7U3LZ88ceCgiNqWVGnZEUDe',
        tiny: 'Qme28KwUKmBXDJMvwRoiwHqovR6S8wAy57RcJwK2ZiZFnv',
        filename: 'image.png',
      },
      {
        large: 'QmRfTGFEXkdDrjT5Tj4kSLjTwN2eiZi3bEuAB44dptXD4g',
        medium: 'QmYW5xqvfkuJ2VjTfHqDHaYKqT3Bgeoc2vY297woQMioWZ',
        original: 'QmSbMRhuDsHdiKfxwucXv7SxoYAfoeCXaQids6t3zMUe1M',
        small: 'QmcVuZuvkVDvbtDH1e3axJDxvKysuU47C2aktdaTaDdcMa',
        tiny: 'QmQ82ZNP8gyqdzvUi1SY278jD7P31a4CpecHHq4DNBCdMK',
        filename: 'image.png',
      },
      {
        large: 'QmbUh5qrnA7RTkP66rXw6ajZDbd7SxGaTEM9rVN6p3YQtB',
        medium: 'Qmd77PHdjPWTHS5LTy45m3HyDhFZfmpFRJuzetrgiPhLXK',
        original: 'QmVfy47igebHshp1X5KnSr8KUKus4ENc66a8wQgemH57vV',
        small: 'QmPCixtsFN4sfcw2WzZuTDXVGpHzXqHGVqDsGauo286xzB',
        tiny: 'QmeNc7uhXBaHqUJXXutthfEAmpbARm5qzTz8qiq8wY3qw5',
        filename: 'image.png',
      },
      {
        large: 'QmVPdkrGXQmovRbCx8tc2eqVfTKfANsckwNtDw95AKp7vo',
        medium: 'QmcDpkMoPcErtgaKmAWJZ78SYPE9Uw4eK6H3tph2yzPPyv',
        original: 'QmW15P5P6SwVxvxVnNYb9fpwhuc2srEW4NRzxNEGFYWwKS',
        small: 'Qmbhy7PhgDXkdpowqMrCy66yLjZEeCyPq5wU4opuAHqtrf',
        tiny: 'QmPZUwcFPLZmCD5G1TXpRvtwpDWrn1bnJrPaJSdkxHNAw1',
        filename: 'image.png',
      },
      {
        large: 'QmY2jkeNBoifHAe7Exu3MJNcUscF5H5eQijLmSheYgV5aE',
        medium: 'QmTGXHhCZCV3AEVg3Gch3JQ75z47hirfFZzUJMS1Jijb8t',
        original: 'QmU3ModZAupxiy5cmKpq9icYSAFwT7Wt2cmxkPcuHeq9Kk',
        small: 'QmfLBYcjewdmyiEREJ4ccaDJ1bcSiMaqBUEGWwiPkYfKUA',
        tiny: 'QmeyyJp4YzDpmHWhrgx6ZuWdv4DnZT1sycbLYhbd6V8EC6',
        filename: 'image.png',
      },
      {
        large: 'QmR2EdiJXWoF5MCttDHBpDsKmdvG7vXkCouGa8rUCQgFbm',
        medium: 'QmcYG8qgWjfbLz1VBocB4MkJsq4CXspKaFP3CAYGcdd32n',
        original: 'QmWPJSEEcfk4NbKpgNPPh1LeN8Zd1LVH7PyiWhYijuUKQP',
        small: 'QmPhJSN6xKGBwq5E2jFdUeW4SVaYYTDqJpP8EqkXydrXKC',
        tiny: 'Qma44Zc5rPidLDP3utUkmEDcHLsYJTVJEGUEroXMqZvNHN',
        filename: 'image.png',
      },
      {
        large: 'Qmak7rLmDCRdDzGUT4bxRv3J4L1Z3ccvawrotZ6LvXneMQ',
        medium: 'QmQj22VGRNMg7kfd2qgrGuYvZ56XG3ssYGaatVdv29P4sW',
        original: 'QmZJNjxipPQD4b13Hv67CCKZtTSijuDbR2i8YNmv6bzZfy',
        small: 'QmXEbDvQCukhqR3sC4oaQdme8HsUbaV1Q2NzC57NEZS6be',
        tiny: 'QmTQFN9EmCfiD3kzVT2fUSoDuxruB6LxXXLbJ3o9Unx7SL',
        filename: 'image.png',
      },
      {
        large: 'QmS2rooxPDMb7jQQuzK66Mysb39uYJhbzCGZeiv6WEY9UH',
        medium: 'QmdcFue1Sh1WFxB6MiJc4jx59hBtZcw6zDGBK2Kcp5Tzi4',
        original: 'QmY8chD4du9VSX3RDipn3sBw6ZLesWXKR7rYpULiuXQHDy',
        small: 'QmUdwzFmQqr2tAnnsBmfXWiStJJkRu1CNyocCmi6rj3K1R',
        tiny: 'QmTM1Q2AtomRSpAdH1LpFGDyuFv4jAcv2rfVrkL1JJFGGK',
        filename: 'image.png',
      },
      {
        large: 'QmfGpsS9Bm37rjKqwMCvLGJG3AVA8gXSbavqqSA3iNxodk',
        medium: 'QmSqhaxavRtsSGLQtqAVaVYEmcftpEh3AJVse48BSaSMZJ',
        original: 'QmY1Cw5Z7aSrEprkLJ2Gnq9F3uSKzN4GNmd1rRfi25v7cx',
        small: 'QmaVgpMdJskmL5BoxrAM1Cm4URdRatoH7vXLXnnoYdPhve',
        tiny: 'QmQt9vqX3AnqsMd8gbSkRgbS7aaGV8RzJ9AHok6XC4woDj',
        filename: 'image.png',
      },
      {
        large: 'QmNgedgUBSugRssEguq59bA4ynk49wuCV9uFWXsPxe2zXh',
        medium: 'QmanhLvSHgDpmcJBdaMtPEvyusc6bBhwD62QaZ8k2rAmhY',
        original: 'QmZuNdjZDtvSBCT1fCGi4RDrHFWwfPQ5vazxqPjJcixZ8V',
        small: 'QmRUuFHWtbpSp4kmLtZaKpdpfYeSqwjAWyerJ5buV87r28',
        tiny: 'QmTRGA97QC726EkaHPoifmHM1BBVwGjQqfx3xxchT7ANy3',
        filename: 'image.png',
      },
      {
        large: 'QmVN4XCitrNVvXHzZX8iKwqjYqfa35JsWVcwfjsnNG4TSZ',
        medium: 'QmP2CS44tS21PBm9ehFdE9eqLZbwx6Cuxoj4djzGShHpaK',
        original: 'Qma1F7jtxZndCuqVQV2dJYoCGajkUjeWf8Nfg9nz8FZTfZ',
        small: 'QmQXZUA2a7Rc3jHPojN7rx29NtBMQY6RRAg3Ku5r4xNvwX',
        tiny: 'QmeudWfRNBRdJp9Lv6HV2XU6Q2fL5ZNXLYX45e7NkvFvY8',
        filename: 'image.png',
      },
      {
        large: 'Qmaemb2i4xNV79fh3qgqfpie6AkwP2d79kN7e26xqjZbbq',
        medium: 'QmV3eAvEsfmukrsQjHPVCYsemiWBD3z1GjFjP5gbU47RDc',
        original: 'QmTB6SvwtcYYqzLw4FN7FY6tQCcehemBbicTy7v4z5zfUE',
        small: 'QmWVrpgw2q1EQkRB3piR2Ey3n1PRbqKq116J6wXuCmzURS',
        tiny: 'QmdSBn2GcAaCpch5SA6BbcUCTzXHJr2jUohBqR5YKHbTUH',
        filename: 'image.png',
      },
      {
        large: 'QmSqhueRykEWhCV1qVAaWUAeAw6AB3fbmTCQxrsnebigG2',
        medium: 'QmVzVjoRurJjtJJAvgadD9T14P19KEfNdKwu1iuu6hr9wK',
        original: 'QmZjM7LNpFAo5RCzKr5oL24mccQjxVegeeXSag8oXZP8qg',
        small: 'QmUxmtY9552aaJ8FBt8pcsgnpdsg3b2ZhdsJCwh1JUXzsJ',
        tiny: 'QmYAsj1Wut4EJTqxW9TBSMFdBFv5ifimbuoR7YsA3WR8gj',
        filename: 'image.png',
      },
      {
        large: 'QmbDTdfka6YuKU2JmdVDZ25kL6TSw1HCd1T2SN8cfz78a8',
        medium: 'QmPDHu9ZWX3vxxS7odJrDBYkQnuzhF6UXbQaXJ8Memu96z',
        original: 'QmXgzxCWXX6kryyHurPmWSNbszCfmhekwWEJA5Ffh5hdY1',
        small: 'QmNXbvLTih1Ak9LBSYG7upQGjL1WvUpyAzd6wHAJsS4uod',
        tiny: 'QmXLEGmWqBNz7U3LoQmMFkqPtsr7fB1u7dMFDfRF66j8BC',
        filename: 'image.png',
      },
      {
        large: 'QmP9VA72WvzD6TQdn6FwudvntvFG1364ocVbEDwWuecTGj',
        medium: 'QmXPAFTj3cqp516Ma6ZRqJ4cTxEueYAAcpUBg9MiKUTarv',
        original: 'QmdZ2rdmU87zToKcMNmzWCDMMiwjJVGBMA73BvvLEcpuiE',
        small: 'QmQCJcu8x3z9ioAtFfPjeyeTkpPDg2h9jD7QzEbJGBCydY',
        tiny: 'QmV6Fb9FxodjjwdWCYH4ZHmCZqAv3L5zxfg4DSD17jypXf',
        filename: 'image.png',
      },
      {
        large: 'QmTzcoHbpkswE2v2SNGqVhqnTQZbnSp18B1bQPz6298dS8',
        medium: 'QmersbMeyXEmjnxR5p5cXu4QAu3bkTLBVPWpBQhiQpJAiV',
        original: 'QmRWrxkNXK9oZRim4VsGCChJvGC3kmprqRkvC1Z1uiH74T',
        small: 'Qmb3iGMrbc3qD85Ej5JUzx9mjQB1tiFLBfoaqfUfLRPLds',
        tiny: 'QmTgrF8re2fQjDk3UsZLP8xUHcmdCywqZ32zLBfLLDrg89',
        filename: 'image.png',
      },
      {
        large: 'QmYt744HxiVvYaWpHcjDnh9r5TAV3RpUHbZWd9EHh327pd',
        medium: 'QmfXMo2GY9BvA8wjgVZ9VbcrHHHYnCSZ1BU9Xo1F5YExwf',
        original: 'QmQPbhXnKiHgjfJzVChYCzS9ExAx8CMk6sUJmCZvStvJuZ',
        small: 'QmXGD6z64pQwUjuyKPz6gmpqLGBhqLUD9iq7wUe8YRCzRR',
        tiny: 'QmRhZnVqnNR5VJGhwJX3PLNh2xgShxYDVsDhByAWN4YpV5',
        filename: 'image.png',
      },
      {
        large: 'QmSWBVoUSnji9Mfw58cUWqbq4kE4R5qrztVyzwbuW11gUy',
        medium: 'QmSuqixqZ2tXdhFX2fSgdSxC2waF8Ej2E7THAQdzR1WaXk',
        original: 'QmVJGfrS3yDjJ3NtsEVeVwF6hvW9mxAdp8hfJMPREM3ygx',
        small: 'QmcxcxMFu2FTdUtHr3583S4wo7m8n4xj2Bje6TXMrgg42q',
        tiny: 'QmYMKvbAxbmo2nHgWCxdFoi5QBodpy2Ltkb6gpZ93kXziQ',
        filename: 'image.png',
      },
      {
        large: 'QmX2EQNGhtwsrNWWTU235VFTDhrbuV48Btgz9a9pjyZwV6',
        medium: 'QmUPciV5dNRkbxSBSCfNR4vXeKXgw8qMeUcpSTcxrwPBUu',
        original: 'QmZz7Bhn5uZM7wo1V6zaPMLtYRMU64gPTX9stghUrsXuHE',
        small: 'QmSEujoEKddnXeQhCyYMYUEJCVec2yEgUPXiEbjRuQd19a',
        tiny: 'QmQry1ZEbMixAwjNwvDyVngvD4WHVfkNd1e1ut12kGhqLX',
        filename: 'image.png',
      },
      {
        large: 'QmeuUDXyeyMDWjFg5MoCcDJEcaNoETTRjs9VzYnwuq2Ajs',
        medium: 'QmV7hgsxuKsgbbs7zfLi65vCHLhztfCSNYfSnrMyWC2wPv',
        original: 'QmaN1PfskwYjkm5gij1HJpK28FKJASZLFmGEr6D1qe6yec',
        small: 'QmdjbGBZ6sUtAaSvGxu2ih4ugk6k7rECQND8mQrhgmwjkj',
        tiny: 'QmVUn5LyVQSZYEojJ4bUKo2TXgdUFrWwmycdP845S8x6Fr',
        filename: 'image.png',
      },
      {
        large: 'QmcMzGWMrLDmqsYKyANzpxBMuCvsyG43u3Dz8HHduGbn26',
        medium: 'QmeqGRTK3WJUN7APDxQbG6opfKLg1a26YKar2k7sNaxqLY',
        original: 'QmRxMeoV2QqRXvoUKdreabVrqZCGjrqHD8CVaAKHrkkDAT',
        small: 'QmeGGq1oMokCkTULywMXwAn7Rjh831ZbUjhLbn88wEuAQU',
        tiny: 'QmPNqm6D8bJZtPezuchXMdm6DxkfbUJf3QYaQjYj36xZKR',
        filename: 'image.png',
      },
      {
        large: 'QmUyqTTCV9F88DdGht8jzNUHM98uL6qvCtmt9LKxqRcWKK',
        medium: 'QmVZhC8u35KTvtM3zMebdinN53g3A8qDsmnu2LeGvREkjL',
        original: 'QmWDbTnnpoyKzT3Mhrn8wqkXXZtjuXQ9y3iLzryAX4xHHE',
        small: 'QmR2dkhZ93T3ZL2KHvwrgQyXcmG4mzQw9kMBn4oWmngEJG',
        tiny: 'QmQLVkVY6VJBSJsA73KDdjzvZdrdLjRSbRcuyJfc6xNYyP',
        filename: 'image.png',
      },
      {
        large: 'QmYoy1BrHrMkvjhRmr6sMxCakBVXepUo23BemrgmTmmgR1',
        medium: 'QmSE6LqL5SQrvZZSNZEzaBS5BAHTCn1evtChzWgUHxsNyp',
        original: 'QmSqBN5WobdhNm4EAY2RWV8NvkcSZHuAfZbxGxPRdiXGge',
        small: 'QmXRxd4v6EDVVYUpvfKiBmsbfqEy3eA9rLnfJ3RC7bJUF5',
        tiny: 'QmUum2T5nJ3n4ydhs1B5qUixCVAo6tGLELmWxmFhEnQpK3',
        filename: 'image.png',
      },
      {
        large: 'QmegY5vG612TTgsmbVopJq1EWUjPoNjKjFyNeaZkoGnbSD',
        medium: 'QmdUotLjYrRFK82Z12sqyvgVoXC5mwZJZCgyDxHqAvCjun',
        original: 'QmVSFW1WM9E58wA5uTUce6uUddiNdUF8vGG2vNoep7CAwn',
        small: 'QmdsShrz7QRRbzaHy9rzmdtvLRKfmN1NPQfv8W52YEAbpo',
        tiny: 'QmWbFfVbPLnrbX7UuLqpVj8pavyvk1cQNKp4pBrMLWnT7Z',
        filename: 'image.png',
      },
      {
        large: 'QmSwVquy13KeVSVL9DgGTJ1x9QRh7139cgdJurL5a5Qq1a',
        medium: 'QmUyPm5SFgMfb3qv5UVsJy9EHBRcFL9jjvEYymF428RGas',
        original: 'QmaqZr4b61gt2WZ3RQVDbNS1obMqpDFWoqrdygmM18AR6C',
        small: 'QmUny554pRfysStkbm93UXgzDBo4BACGKtMWMY4Zvgo7Zd',
        tiny: 'QmRD8vY8BQthDdw4tL9ZAbGKBtHNFtRm1tkkLDPzuTrSKf',
        filename: 'image.png',
      },
    ]

    const services = [
      '251-0',
      '2511-0',
      '2512-0',
      '2513-0',
      '2514-0',
      '2519-0',
      '252-0',
      '2521-0',
      '2522-0',
      '2523-0',
      '2529-0',
    ]

    const randomClassification = services[faker.random.number({ min: 0, max: services.length - 1 })]

    const listingObject = {
      isOwner: false,
      item: {
        title: faker.random.words(2),
        description: faker.random.words(16),
        processingTime: '1 day',
        price: faker.random.number({ min: 10, max: 50, precision: 2 }),
        tags: faker.random.words(4).split(' '),
        images: [images[faker.random.number({ min: 0, max: images.length - 1 })]],
        categories: [randomClassification],
        grams: 0,
        condition: 'New',
        options: [],
        skus: [{ quantity: -1, productID: '' }],
      },
      averageRating: 0,
      hash: '',
      location: {
        addressOne: '',
        addressTwo: '',
        city: 'Iloilo City',
        country: 'PH',
        latitude: '10.735312',
        longitude: '122.545813',
        plusCode: '7Q24PGPW+48',
        state: 'Iloilo',
        zipCode: '5000',
      },
      parentPeer: '',
      peerSlug: '',
      price: { amount: 0, currencyCode: '', modifier: 0 },
      ratingCount: 0,
      thumbnail: { medium: '', small: '', tiny: '' },
      nsfw: false,
      signature: '',
      slug: '',
      currentSlug: '',
      vendorID: { peerID: '', handle: '', pubkeys: { identity: '', bitcoin: '' }, bitcoinSig: '' },
      metadata: {
        version: 0,
        contractType: 'SERVICE',
        format: 'FIXED_PRICE',
        expiry: '2019-11-11T11:09:49.604Z',
        acceptedCurrencies: ['TBTC', 'TZEC', 'TLTC', 'TBCH'],
        pricingCurrency: 'USD',
        language: '',
        escrowTimeoutHours: 0,
        coinType: '',
        coinDivisibility: 100000000,
        priceModifier: 0,
        serviceRateMethod: 'PER_HOUR',
        serviceClassification: randomClassification,
      },
      shippingOptions: [],
      coupons: [
        {
          title: faker.random.words(1),
          discountCode: faker.random.words(1),
          percentDiscount: faker.random.number({ min: 10, max: 90 }),
          type: 'percent',
          uniqueId: '0.5594808438923105',
        },
      ],
      moderators: [],
      termsAndConditions: faker.random.words(24),
      refundPolicy: faker.random.words(24),
    }

    return listingObject
  }

  public async seed() {
    const seeds: ListingModel[] = []
    let output = this.state.output
    for (let index = 0; index < this.state.iterations; index++) {
      output = [...output, `[${index}] Seeding...`]
      const newRandomListing = this.generateFakeListingData()
      const listing = new ListingModel(newRandomListing)
      seeds.push(listing)
    }

    this.setState({
      output,
    })

    const requests = seeds.map((seed, index) => {
      output = [...output, `[${index}] Complete: ${seed.item.title}`]

      return seed.save()
    })

    await Promise.all(requests)
    this.setState({
      output,
    })
  }

  public render() {
    return (
      <div className="uk-container">
        <div className="uk-flex uk-flex-column">
          <div className="uk-card uk-card-default uk-margin-bottom uk-padding">
            <div className="uk-flex uk-flex-row uk-width-1-4">
              <input
                className="uk-input"
                id="form-stacked-text"
                type="text"
                placeholder="Iterations"
                value={this.state.iterations}
                onChange={evt => {
                  this.setState({
                    iterations: Number(evt.target.value),
                  })
                }}
              />
              <Button className="uk-button uk-button-primary uk-margin-left" onClick={this.seed}>
                Seed
              </Button>
            </div>
          </div>
          {this.state.output.map((comp, id) => (
            <div key={id}>{comp}</div>
          ))}
        </div>
      </div>
    )
  }
}

export default DevMode
