// const PORT = 8000
var http = require('http')
var axios = require('axios')
var cheerio = require('cheerio')
var express = require('express');
const { url } = require('inspector');

const app = express();
const router = express.Router();

const publishers = [
  // {
  //   name: 'US News',
  //   address: 'https://www.usnews.com/',
  //   base: '',
  //   slug: 'usnews'
  // },
  {
    name: 'The Washington Post | Politics',
    address: 'https://www.washingtonpost.com/politics/',
    base: '',
    slug: 'thewashingtonpost'
  },
  {
    name: 'New York Times | US Congress',
    address: 'https://www.nytimes.com/topic/organization/us-congress',
    base: 'https://www.nytimes.com',
    slug: 'nytimes'
  },
  {
    name: 'Wall Street Journal | Washington Wire',
    address: 'https://www.wsj.com/news/types/washington-wire',
    base: '',
    slug: 'wsj'
  },
  {
    name: 'Politico | Congress',
    address: 'https://www.politico.com/congress',
    base: '',
    slug: 'politico'
  }
]

const keywords = ["election", "us congress", "capitol", "capitol hill", "gop", "dems", "republicans", "democrats", "senate", "house of representatives", "speaker of the house", "stock", "investing", "tax", "majority leader", "minority leader", "filibuster", "constitution"]

const storyList = []

publishers.forEach(publisher => {
  if (publisher.slug == 'usnews') {
    console.log(publisher.name)
    axios.get(publisher.address)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const stories = $('h3')

        stories.each((index, story) => {
          if (keywords.find((word) => $(story).text().toLowerCase().includes(word))) {
            const title = $(story).text()
            const url = $(story).find('a').attr('href')
            const imageUrl = ''
            const date = ''
            storyList.push({ index, title, url: publisher.base + url, source: publisher.name, slug: publisher.slug, imageUrl, date })

          }
        })
      })
  } else if (publisher.slug == 'thewashingtonpost') {
    console.log(publisher.name)
    axios.get(publisher.address)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const stories = $('.story-headline')

        stories.each((index, story) => {
          if (keywords.find((word) => $(story).find('a').find('h3').text().toLowerCase().includes(word))) {
            const title = $(story).find('a').find('h3').text()
            const url = $(story).find('a').attr('href')
            const imageUrl = ''
            const date = $(story).find('span').last().text()
            storyList.push({ index, title, url: publisher.base + url, source: publisher.name, slug: publisher.slug, imageUrl, date })

          }
        })
      })
  } else if (publisher.slug == 'nytimes') {
    console.log(publisher.name)
    axios.get(publisher.address)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const stories = $('li')

        stories.each((index, story) => {
          if (keywords.find((word) => $(story).find('a').find('h2').text().toLowerCase().includes(word))) {
            const title = $(story).find('a').find('h2').text()
            const url = $(story).find('a').attr('href')
            const imageUrl = $(story).find('a').find('img').attr('src').split('?')[0]
            const date = ''
            storyList.push({ index, title, url: publisher.base + url, source: publisher.name, slug: publisher.slug, imageUrl, date })
          }
        })
      })
  } else if (publisher.slug == 'wsj') {
    console.log(publisher.name)
    axios.get(publisher.address)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const stories = $('a')

        stories.each((index, story) => {
          if (keywords.find((word) => $(story).text().toLowerCase().includes(word))) {
            const title = $(story).text()
            const url = $(story).attr('href')
            const imageUrl = ''
            const date = ''
            storyList.push({ index, title, url: publisher.base + url, source: publisher.name, slug: publisher.slug, imageUrl, date })
          }
        })
      })
  } else if (publisher.slug == 'politico') {
    console.log(publisher.name)
    axios.get(publisher.address)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const stories = $('a')

        stories.each((index, story) => {
          if (keywords.find((word) => $(story).text().toLowerCase().includes(word))) {
            const title = $(story).text()
            const url = $(story).attr('href')
            const imageUrl = ''
            const date = ''
            storyList.push({ index, title, url: publisher.base + url, source: publisher.name, slug: publisher.slug, imageUrl, date })
          }
        })
      })
  }
})

router.get('/blakbonz', (req, res) => { res.json('Welcome to the US Congress News API') })


router.get('/news', (req, res) => {
  console.log(storyList)

  res.json(storyList)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'US Congress News API' });
});

module.exports = router;