const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const publishers = [
    {
        name: "AP News",
        address: "https://apnews.com/hub/politics",
        base: "https://www.apnews.com",
        slug: "apnews",
    },
    {
        name: "USA Today",
        address: "https://www.usatoday.com/news/politics/",
        base: "https://www.usatoday.com",
        slug: "usatoday",
    },
    {
        name: "Propublica",
        address: "https://www.propublica.org/",
        base: "",
        slug: "propublica",
    },
    // {
    //   name: 'The Washington Post',
    //   address: 'https://www.washingtonpost.com/politics/',
    //   base: '',
    //   slug: 'thewashingtonpost'
    // },
    {
        name: "New York Times",
        address: "https://www.nytimes.com/topic/organization/us-congress",
        base: "https://www.nytimes.com",
        slug: "nytimes",
    },
    //  {
    //    name: 'Wall Street Journal',
    //    address: 'https://www.wsj.com/news/types/washington-wire',
    //    base: '',
    //    slug: 'wsj'
    //  },
    {
        name: "Politico",
        address: "https://www.politico.com/congress",
        base: "",
        slug: "politico",
    },
];

const keywords = [
    "amendment", "biden", "ballot", " bill ", "congress", "capitol", "capitol hill", "constitution", " dems ", "democrats", "election", "filibuster", " gop ", "house floor", "house of representatives", "investing", " law ", "majority leader", "midterms", "midterm elections", "minority leader", "nuclear war", "obama", "omnibus", "pelosi", "republicans", "runoff election", "senate", "senate floor", "speaker of the house", "stock", "tax", "trump", "us congress", "vote", "war in", "washington dc", "white house"
];

const storyList = [];

async function getNews() {
    for (var publisher of publishers) {
        if (publisher.slug == "apnews") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $(".FeedCard");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) => $(story).text().toLowerCase().includes(word))
                    ) {
                        const title = $(story).find(".CardHeadline").find("a").text().trim();
                        const shortDescription = $(story).find("p").text().trim();
                        const url = $(story).find("a").attr("href");
                        const imageUrl = $(story).find("img").attr("src") || "";
                        const date = $(story).find("span").last().text().split(" GMT")[0];
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "usatoday") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $(".gnt_m a");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) => $(story).text().toLowerCase().includes(word))
                    ) {
                        const title = $(story).text().trim();
                        const shortDescription = $(story).attr("data-c-br");
                        const url = $(story).attr("href");
                        const imageUrl = ""; // `${$(story).find('img').attr('srcset')}`.split('?')[0] || ''
                        const date = url.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/)[0]; // $(story).find('div').last().attr('data-c-dt')
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "propublica") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $(".home__river .home__story");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) => $(story).text().toLowerCase().includes(word))
                    ) {
                        const title = $(story).find(".home__story-hed").text();
                        const shortDescription = $(story)
                            .find(".home__story-dek")
                            .text()
                            .trim();
                        const url = $(story).find("h3").find("a").attr("href");
                        const imageUrl =
                            `${$(story).find(".lead-art").find("img").attr("srcset")}`.split(
                                "?"
                            )[0] || "";
                        const date = $(story)
                            .find("p")
                            .last()
                            .find("time")
                            .text()
                            .split(",")[0];
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "thewashingtonpost") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $("article div .w-100");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) =>
                            $(story)
                                .find(".story-headline")
                                .find("h3")
                                .text()
                                .toLowerCase()
                                .includes(word)
                        )
                    ) {
                        const title = $(story).find(".story-headline").find("h3").text();
                        const shortDescription = $(story)
                            .find(".story-headline")
                            .find("p")
                            .text();
                        const url = $(story).find("div a").last().attr("href");
                        const imageUrl =
                            `${$(story).find(".border-box").find("img").attr("src")}`.split(
                                "?src="
                            )[1] || "";
                        const date = $(story).find("span").last().text();
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "nytimes") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $("li");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) =>
                            $(story).find("a").find("h2").text().toLowerCase().includes(word)
                        )
                    ) {
                        const title = $(story).find("a").find("h2").text();
                        const shortDescription = $(story).find("p").text();
                        const url = $(story).find("a").attr("href");
                        const imageUrl = $(story)
                            .find("a")
                            .find("img")
                            .attr("src")
                            .split("?")[0];
                        const date = imageUrl.match(
                            /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/
                        )[0];
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "wsj") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $("article");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) =>
                            $(story).find("h2").text().toLowerCase().includes(word)
                        )
                    ) {
                        const title = $(story).find("h2").text();
                        const shortDescription = $(story).find("span").last().text();
                        const url = $(story).find("a").attr("href");
                        const imageUrl = $(story).find("img").attr("src").split("?")[0] || "";
                        const date = $(story).find("p").last().text();
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        } else if (publisher.slug == "politico") {
            console.log(publisher.name);
            await axios.get(publisher.address).then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const stories = $("article");

                stories.each((index, story) => {
                    if (
                        keywords.find((word) => $(story).text().toLowerCase().includes(word))
                    ) {
                        const title = $(story).find("h3").text().trim();
                        const shortDescription = $(story).find(".subhead").text();
                        const url = $(story).find("a").attr("href");
                        const imageUrl =
                            $(story)
                                .find(".thumb")
                                .find("div")
                                .find("a")
                                .find("img")
                                .attr("src") || "";
                        const date = url.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/)[0]; // $(story).find('.timestamp').text()
                        if (title.split(" ").length > 4) {
                            // console.log(`${publisher.name} Title: ${title}`);
                            storyList.push({
                                index,
                                title,
                                shortDescription,
                                url: publisher.base + url,
                                source: publisher.name,
                                slug: publisher.slug,
                                imageUrl,
                                date,
                            });
                        }
                    }
                });
            });
        }
    };
}

getNews(publishers).then(() => {
    fs.writeFile(
        "top_congressional_news.json",
        JSON.stringify(storyList),
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
});


