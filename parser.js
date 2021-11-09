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
        // mb ok 'https://economictimes.indiatimes.com/industry/healthcare/biotech/rssfeeds/13358050.cms',
        //'https://www.pharmatimes.com/rss/news_rss.rss',
        //'https://www.news-medical.net/tag/feed/Biochemistry.aspx',
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
        //'https://www.news-medical.net/tag/feed/Pharmacy.aspx',
        //'https://www.news-medical.net/tag/feed/Pharmaceuticals.aspx',
        'http://feeds.feedburner.com/DrugTargetReview?format=xml',
    ]
})

hostnames = {
    'scitechdaily.com':'SciTechDaily',
    'www.sciencenews.org':'ScienceNews',
    'www.sciencenewsforstudents.org':'ScienceNewsForStudents',
    'phys.org':'Phys.org',
    'www.nytimes.com':'The New York Times',
    'cen.acs.org': 'C&EN',
    'www.sciencedaily.com': 'ScienceDaily',
    'www.pharmacytimes.com': 'Pharmacy Times',
    'www.pharmacist.com': 'APhA — American Pharmacists Association',
    'www.drugtopics.com': 'DrugTopics',
    'theconversation.com': 'The Conversation',
    'www.drugdiscoverytoday.com': 'Drug Discovery Today',
    'www.drugtargetreview.com': 'Drug Target Review',
    'economictimes.indiatimes.com': 'The Economic Times'
}

function itemFixer(item) {
    let hostname = new URL(item.link).host
    let rawDescription = item.description
    let cleanDescription = null
    let imageSrc = '/assets/logo/' + hostnames[hostname] + '.png'

    if (rawDescription !== null) {
        cleanDescription = rawDescription.replace(/<\/?[^>]+(>|$)/g, "");
        if (cleanDescription.length > 1023) cleanDescription = cleanDescription.substring(0, 1020) + '...'
    }



    return {
        title: item.title,
        description: cleanDescription,
        image: imageSrc,
        date: item.date.toString(),
        link: item.link,
        hostname: hostnames[hostname]
    }
}

chemistry.on('error', console.error);
pharmacology.on('error', console.error);

chemistry.on('new-item', function(item) {
    let fixedItem = itemFixer(item)
    CHEM_LIST.push(fixedItem)
});

pharmacology.on('new-item', function(item) {
    let fixedItem = itemFixer(item)
    PHARMA_LIST.push(fixedItem)
});

module.exports = {CHEM_LIST, PHARMA_LIST}

