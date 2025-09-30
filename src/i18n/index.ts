import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Preload English
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import travelEN from './locales/en/travel.json';
import technologyEN from './locales/en/technology.json';
import ecosystemEN from './locales/en/ecosystem.json';
import communityEN from './locales/en/community.json';
import explorerEN from './locales/en/explorer.json';
import newsEN from './locales/en/news.json';
import helpEN from './locales/en/help.json';
import roadmapEN from './locales/en/roadmap.json';
import gamesEN from './locales/en/games.json';

// Preload Chinese
import commonZH from './locales/zh/common.json';
import homeZH from './locales/zh/home.json';
import travelZH from './locales/zh/travel.json';
import technologyZH from './locales/zh/technology.json';
import ecosystemZH from './locales/zh/ecosystem.json';
import communityZH from './locales/zh/community.json';
import explorerZH from './locales/zh/explorer.json';
import newsZH from './locales/zh/news.json';
import helpZH from './locales/zh/help.json';
import roadmapZH from './locales/zh/roadmap.json';
import gamesZH from './locales/zh/games.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // default language
    ns: [
      'common', 'home', 'travel', 'technology', 'ecosystem', 
      'community', 'explorer', 'news', 'help', 'roadmap', 'games'
    ],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        common: commonEN,
        home: homeEN,
        travel: travelEN,
        technology: technologyEN,
        ecosystem: ecosystemEN,
        community: communityEN,
        explorer: explorerEN,
        news: newsEN,
        help: helpEN,
        roadmap: roadmapEN,
        games: gamesEN,
      },
      zh: {
        common: commonZH,
        home: homeZH,
        travel: travelZH,
        technology: technologyZH,
        ecosystem: ecosystemZH,
        community: communityZH,
        explorer: explorerZH,
        news: newsZH,
        help: helpZH,
        roadmap: roadmapZH,
        games: gamesZH,
      },
    },
    react: {
      useSuspense: false, 
    },
  });

export default i18n;
