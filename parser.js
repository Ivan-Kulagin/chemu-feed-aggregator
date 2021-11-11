const axios = require("axios")
const cheerio = require("cheerio")
const RssFeedEmitter = require('rss-feed-emitter');
const chemistry = new RssFeedEmitter();
const pharmacology = new RssFeedEmitter();

const CHEM_LIST = [];
const PHARMA_LIST = [];


chemistry.add({
    url: [
        //'https://www.chemistryworld.com/413.rss',
        'https://scitechdaily.com/news/chemistry/feed/',
        'https://scitechdaily.com/tag/biochemistry/feed/',
        'https://www.sciencenews.org/topic/chemistry/feed',
        'https://www.sciencenewsforstudents.org/topic/chemistry/feed',
        'https://phys.org/rss-feed/chemistry-news/biochemistry/',
        'https://www.nytimes.com/svc/collections/v1/publish/http://www.nytimes.com/topic/subject/chemistry/rss.xml',
        'https://economictimes.indiatimes.com/industry/healthcare/biotech/rssfeeds/13358050.cms',
        'https://www.news-medical.net/tag/feed/Biochemistry.aspx',
        'https://pubsapp.acs.org/cen/rss/latestnews.xml',
        'https://www.sciencedaily.com/rss/matter_energy/chemistry.xml',
    ]
});

pharmacology.add({
    url: [
        'https://scitechdaily.com/tag/pharmacology/feed/',
        'http://www.drugdiscoverytoday.com/rss/news/',
        'https://theconversation.com/us/topics/drug-discovery-27422/articles.atom',
        'https://theconversation.com/global/topics/pharmacology-923/articles.atom',
        'https://www.drugtopics.com/rss',
        'https://www.pharmacist.com/Pharmacy-News/rss/531',
        'https://www.pharmacytimes.com/rss',
        'https://www.sciencedaily.com/rss/health_medicine/pharmacology.xml',
        'https://www.sciencedaily.com/rss/health_medicine/pharmaceuticals.xml',
        'https://economictimes.indiatimes.com/prime/pharma-and-healthcare/rssfeeds/60187434.cms',
        'https://www.pharmatimes.com/rss/news_rss.rss',
        'https://www.news-medical.net/tag/feed/Pharmacy.aspx',
        'https://www.news-medical.net/tag/feed/Pharmaceuticals.aspx',
        'http://feeds.feedburner.com/DrugTargetReview?format=xml',
    ]
})

hostnames = {
    'scitechdaily.com': ['SciTechDaily', '.entry-content.clearfix'],
    'www.sciencenews.org': ['ScienceNews', '.header-default__thumbnail___3TQ8l'],
    'www.sciencenewsforstudents.org': ['ScienceNewsForStudents', '.header-default__thumbnail___3TQ8l'],
    'phys.org': ['Phys.org', '.article-img'],
    'www.nytimes.com': ['The New York Times', '.css-bsn42l'],
    'cen.acs.org': ['C&EN', false],
    'www.sciencedaily.com': ['ScienceDaily', false],
    'www.pharmacytimes.com': ['Pharmacy Times', false],
    'www.pharmacist.com': ['APhA — American Pharmacists Association', false],
    'www.drugtopics.com': ['DrugTopics', false],
    'theconversation.com': ['The Conversation', '.image'],
    'www.drugdiscoverytoday.com': ['Drug Discovery Today', '.feature-img'],
    'www.drugtargetreview.com': ['Drug Target Review', false],
    'economictimes.indiatimes.com': ['The Economic Times', false],
    'www.pharmatimes.com': ['PharmaTimes', '.section-content.standard'],
    'www.news-medical.net': ['News Medical', '.contentImage']
}

async function itemFixer(item) {
    let hostname = new URL(item.link).host
    let rawDescription = item.description
    let cleanDescription = null
    let scrapeLink = item.link
    let imageSrc = await scrapeImage(scrapeLink, hostnames[hostname][1])
    let imageSrcRsv = '/assets/logo/' + hostnames[hostname][0] + '.png'


    if (rawDescription !== null) {
        cleanDescription = rawDescription.replace(/<\/?[^>]+(>|$)/g, "");
        if (cleanDescription.length > 1023) cleanDescription = cleanDescription.substring(0, 1020) + '...'
    }



    return {
        title: item.title,
        description: cleanDescription,
        image: imageSrc,
        image2: imageSrcRsv,
        date: item.date.toString(),
        link: item.link,
        hostname: hostnames[hostname][0]
    }
}

async function scrapeImage(url, domEl) {
    try {
        if (domEl) {
            const {data} = await axios.get(url);
            const $ = cheerio.load(data);
            return $(domEl).find('img')['0'].attribs.src;
        } else {
            return false
        }

    } catch (err) {
        // console.error(err);
    }
}

chemistry.on('error', console.error);
pharmacology.on('error', console.error);

chemistry.on('new-item', async function(item) {
    let fixedItem = await itemFixer(item)
    CHEM_LIST.push(fixedItem)
});

pharmacology.on('new-item', async function(item) {
    let fixedItem = await itemFixer(item)
    PHARMA_LIST.push(fixedItem)
});

module.exports = {CHEM_LIST, PHARMA_LIST}

