// ==UserScript==
// @name           Link Navigation Init
// @namespace      linknav
// @description    Inserts LINK elements with rel=prev, next, up.. on a number of sites
// @include        http://0day.kiev.ua/*
// @include        http://www.sinfest.net/*
// @include        http://torrents.net.ua/*
// @include        http://torrents.net.ua/*
// @include        http://torrents.ru/* 
// @include        http://price.ua/* 
// @include        http://dilbert.com/*
// @include        http://digg.com/*
// @include        http://sexylosers.com/*
// @include        http://www.menagea3.net/*
// @include        http://xkcd.com/*
// @include        http://thenoobcomic.com/*
// @include        http://questionablecontent.net/*
// @include        http://www.girlgeniusonline.com/*
// @include        http://www.jezuk.co.uk/*
// @include        http://cad-comic.com/*
// @include        http://www.dieselsweeties.com/*
// @include        http://www.quantz.com/*
// @include        http://www.goats.com/*
// @include        http://jerkcity.com/*
// @include        http://www.penny-arcade.com/*
// @include        http://samandfuzzy.com/*
// @include        http://ars.userfriendly.org/*
// ==/UserScript==

function BuildMatcher() {}

BuildMatcher.build = function(type) {
    var fun;
    switch(type) {
    case 'imgSrc':
        fun = BuildMatcher.imgSrc;
        break;
    case 'imgAlt':
        fun = BuildMatcher.imgAlt;
        break;
    case 'id':
        fun = BuildMatcher.id;
        break;
    case 'class':
        fun = BuildMatcher.byClass;
        break;
    case 'text':
        fun = BuildMatcher.text;
        break;
    case 'wrapClass':
        fun = BuildMatcher.wrapClass;
        break;
    case 'title':
        fun = BuildMatcher.title;
        break;
    case 'areaAlt':
        fun = BuildMatcher.areaAlt;
        break;
    default:
        return;
    }
    return BuildMatcher.buildSet(fun);
}

// Matchers
BuildMatcher.byClass = function(pattern) {
    return BuildMatcher.uriTemplate("//a[contains(@class, '{pattern}')]", {'pattern':pattern});
}

BuildMatcher.id = function(pattern) {
    return BuildMatcher.uriTemplate("//a[contains(@id, '{pattern}')]", {'pattern':pattern});
}

BuildMatcher.imgSrc = function(pattern) {
    return BuildMatcher.uriTemplate("//a/img[contains(@src,'{pattern}')]/parent::*", {'pattern':pattern});
}

BuildMatcher.imgAlt = function(pattern) {
    return "//a/img["+BuildMatcher.containsIgnoreCase('@alt', pattern)+"]/parent::*";
}

BuildMatcher.areaAlt = function(pattern) {
    return "//area["+BuildMatcher.containsIgnoreCase('@alt', pattern)+"]";
}

BuildMatcher.text = function(pattern) {
    return "//a["+BuildMatcher.containsIgnoreCase('text()', pattern)+"]";
}

BuildMatcher.wrapClass = function(pattern) {
    return "//*["+BuildMatcher.containsIgnoreCase('@class', pattern)+"]/a";
}

BuildMatcher.title = function(pattern) {
    return "//a["+BuildMatcher.containsIgnoreCase('@class', pattern)+"]";
}

// Helpers
BuildMatcher.contains = function(part, pattern) {
    return BuildMatcher.uriTemplate("contains({part},'{pattern}')", {'part': part, 'pattern': pattern});
}

BuildMatcher.containsIgnoreCase = function(part, pattern) {
    return BuildMatcher.contains(BuildMatcher.lowerCase(part,pattern), pattern.toLowerCase());
}

BuildMatcher.lowerCase = function(part, pattern) {
    return BuildMatcher.uriTemplate("translate({part}, '{up}','{down}')", {'part': part, 'up': pattern.toUpperCase(), 'down': pattern.toLowerCase()});
}

BuildMatcher.uriTemplate = function(template, set) {
  var working = template;
  while (/{([^}]*)}/.exec(working)) {
    var key = RegExp.lastParen;
    re = new RegExp('{'+key+'}');
    working = working.replace(re, set[key]);
  }
  return working;
}

BuildMatcher.buildSet = function(fun) {
  var patterns = ['first', 'next', 'prev', 'last'];
  var set = {};
  for (var i=0; i<patterns.length; i++) {
    set[patterns[i]] = fun(patterns[i]);
  }
  return set;
}

// patterns
default_navs = {
  'image alt': BuildMatcher.build('imgAlt'),
  'image src': BuildMatcher.build('imgSrc'),
  'id': BuildMatcher.build('id'),
  'class': BuildMatcher.build('class'),
  'text': BuildMatcher.build('text'),
  'wrapper class': BuildMatcher.build('wrapClass'),
  'title': BuildMatcher.build('title'),
}

nav = {
    '0day.kiev.ua': {
        'prev': "//img[@title='Предыдущая страница']/parent::*",
        'next': "//img[@title='Следующая страница']/parent::*",
        },
    'www.menagea3.net': {
        'first': "//img[@name='first_day']/parent::*",    
        'prev':  "//img[@name='previous_day']/parent::*",
        'next':  "//img[@name='next_day']/parent::*",
        'last':  "//img[@name='last_day']/parent::*",
    },        
    'torrents.net.ua': {
        'next': "//a[text()='далі']",
        'prev': "//a[text()='назад']"
    },
    'yandex.ru': {
        'prev': "//a[id('previous_page')]",
        'next': "//a[id('next_page')]",
    },
    'torrents.ru': {
        'next': "//a[text()='След.']",
        'prev': "//a[text()='Пред.']",
    },
    'price.ua': {
        'next': "//a[text()='Следующая страница >']",
        'prev': "//a[text()='< Предыдущая страница']",
    },
    'dilbert.com': {
        'prev': "//a[@class='STR_Prev']",
        'next': "//a[@class='STR_Next']",
    },
    'sexylosers.com': {
        'first': "//font[text()='|<'][@color='#ffaaaa']/parent::*",
        'prev' : "//font[text()='<<'][@color='#ffaaaa']/parent::*",
        'next' : "//font[text()='>>'][@color='#ffaaaa']/parent::*",
        'last' : "//font[text()='>|'][@color='#ffaaaa']/parent::*",
    },
    'digg.com': {
        'prev': "//a[text()='« Previous']",
        'next': "//a[text()='Next »']",
    },
    'xkcd.com': {
        'next' : BuildMatcher.build('text')['next'],
        'prev' : BuildMatcher.build('text')['prev'],
        'first': BuildMatcher.text('|<'),
        'last' : BuildMatcher.text('>|'),
    },
    'questionablecontent.net': {
        'first': BuildMatcher.build('text')['first'],
        'prev' : BuildMatcher.build('text')['prev'],
        'next' : BuildMatcher.build('text')['next'],
        'last' : BuildMatcher.text('latest'),
    },
    'www.girlgeniusonline.com': {
        'first': BuildMatcher.build('imgAlt')['first'],
        'prev' : BuildMatcher.build('imgAlt')['prev'],
        'next' : BuildMatcher.build('imgAlt')['next'],
        'last' : BuildMatcher.imgAlt('The Most Recent Comic'),
     },
    'cad-comic.com': {
        'first': BuildMatcher.build('imgSrc')['first'],
        'next' : BuildMatcher.build('imgSrc')['next'],
        'prev' : BuildMatcher.imgSrc('back'),
        'last' : BuildMatcher.imgSrc('latest1'),
    },
    'jerkcity.com': {
        'prev' : BuildMatcher.build('text')['prev'],
        'next' : BuildMatcher.build('text')['next'],
        'last' : BuildMatcher.text('home'),
    },
    'www.penny-arcade.com': {
        'first': BuildMatcher.build('wrapClass')['first'],
        'next' : BuildMatcher.build('wrapClass')['next'],
        'prev' : BuildMatcher.wrapClass('back'),
        'last' : BuildMatcher.wrapClass('new'),
    },
    'samandfuzzy.com': {
        'first': BuildMatcher.build('imgAlt')['first'],
        'prev' : BuildMatcher.build('imgAlt')['prev'],
        'next' : BuildMatcher.build('imgAlt')['next'],
        'last' : BuildMatcher.imgSrc('start'),
    },
    
    'ars.userfriendly.org': {
        'prev' : BuildMatcher.build('areaAlt')['prev'],
        'next' : BuildMatcher.build('areaAlt')['next'],
        'last' : BuildMatcher.areaAlt('up'),
    },

    'www.sinfest.net': BuildMatcher.build('imgAlt'),
    'thenoobcomic.com': BuildMatcher.build('class'),
    'www.jezuk.co.uk': BuildMatcher.build('id'),
    'www.dieselsweeties.com': BuildMatcher.build('imgSrc'),
    'www.qwantz.com': BuildMatcher.build('text'),
    'www.goats.com': BuildMatcher.build('text'),
}

addNavigationRels();

function addNavigationRels() {
  rels = ['next','prev','first', 'last'];


  for (var i in rels) {
    var rel = rels[i];
    addRel(rel);
  }
}

function addRel(rel) {
  var host = location.host;
  // are there patterns for this host?
  if (nav[host]) {
    var host_patterns = nav[host];
    
    // is there a pattern for this rel?
    if (host_patterns[rel]) {
      var pattern = host_patterns[rel];

      var orig_link = findMatchingLink(pattern);
    }
  } else {
    // iterate through standard matchers
    // for (i in patterns) {
    //   orig_link = findMatchingLink(patterns[i]);
    //   if (orig_link != null) {
    //     break;
    //   }
    // }
  }
  
  if (orig_link != null) {
    addRelToElement(orig_link, rel);
  }
}

function findMatchingLink(pattern) {
  if (/^\/\//.test(pattern)) {
    orig_link = document.evaluate(pattern, document, null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  } else {
    orig_link = document.querySelect(pattern);
  }
  return orig_link;
}

function addRelToElement(element, value) {
	if (!element.rel) {
		element.rel = value;
	} else {
		var newRel = element.rel;
		rel += " ";
		rel += value;
		element.rel = newRel;
	}
}



// matchers = {
//   imgSrc: BuildMatcher.imgAlt,
//   imgAlt: BuildMatcher.imgAlt,
//   id:  BuildMatcher.id,
//   class: BuildMatcher.byClass,
//   text: BuildMatcher.text,
//   wrapClass: BuildMatcher.wrapClass,
//   title: BuildMatcher.title,
//   areaAlt: BuildMatcher.areaAlt
// }
// insertRel = (rel ->
//  strategy = strategies.find(strategy ->
//    strategyWorks?(strategy, doc, rel)
//  )
//  insertRelByStrategy(strategy, doc, rel)
// )

