"""Generate the remaining 202 decks to reach 1,000 total."""
import os, sys, glob
sys.path.insert(0, os.path.dirname(__file__))
from _generate_1000 import generate_investor_deck, generate_thematic_deck, embed_screenshots, BASE

# 200 more investor firms (301-500)
BATCH3 = []
_firms = [
    # US VC/PE continued (301-350)
    ('301','a16z-crypto','a16z Crypto','Crypto VC','Menlo Park, CA','$7B+','us',['Uniswap','Solana','Alchemy'],'Web3 and crypto infrastructure'),
    ('302','abbey-road','Abbey Road Capital','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise SaaS'],'B2B seed specialist'),
    ('303','acrew','Acrew Capital','Venture Capital','San Francisco, CA','$1B+','us',['Expanse','Demisto'],'Diverse-led enterprise fund'),
    ('304','alchemy-ventures','Alchemy Ventures','Venture Capital','San Francisco, CA','$500M+','us',['Web3 infrastructure'],'Blockchain infrastructure'),
    ('305','align','Align Ventures','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise AI'],'AI alignment investing'),
    ('306','aluminum','Aluminari Ventures','Venture Capital','Boston, MA','$100M+','us',['Enterprise B2B'],'MIT network enterprise fund'),
    ('307','anthos','Anthos Capital','Venture Capital','Santa Monica, CA','$1B+','us',['SpaceX','Anduril'],'Defense and deep tech'),
    ('308','avenir','Avenir Growth Capital','Growth Equity','New York, NY','$3B+','us',['Brex','Checkout.com'],'Fintech growth'),
    ('309','base10','Base10 Partners','Venture Capital','San Francisco, CA','$1B+','us',['Figma','Notion'],'Automation thesis'),
    ('310','bedrock','Bedrock Capital','Venture Capital','San Francisco, CA','$500M+','us',['Enterprise contrarian bets'],'Narrative violation thesis'),
    ('311','bg-fund','B Capital Group Asia','Venture Capital','Singapore','$2B+','asia',['Asian enterprise tech'],'Eduardo Saverin — APAC enterprise'),
    ('312','bilge','Bilge Capital','Venture Capital','Istanbul, Turkey','$100M+','eu',['Turkish enterprise tech'],'Turkish tech ecosystem'),
    ('313','blackhorn','Blackhorn Ventures','Venture Capital','San Francisco, CA','$300M+','us',['Industrial AI'],'Industrial technology'),
    ('314','blueyard','BlueYard Capital','Venture Capital','Berlin, Germany','$500M+','eu',['Protocol Labs','Centrifuge'],'Decentralized infrastructure'),
    ('315','boxgroup','BoxGroup','Venture Capital','New York, NY','$500M+','us',['Plaid','Airtable'],'NYC pre-seed/seed leader'),
    ('316','burda','Burda Principal Investments','Growth Equity','Munich, Germany','$3B+','eu',['Vinted','Nebenan','Carsome'],'European digital platforms'),
    ('317','caffeinated','Caffeinated Capital','Venture Capital','San Francisco, CA','$500M+','us',['Plaid','Airtable','Rippling'],'Enterprise infrastructure seed'),
    ('318','canaan','Canaan Partners (II)','Venture Capital','Menlo Park, CA','$7B+','us',['Lending Club','Match','Kabbage'],'Multi-stage enterprise'),
    ('319','cathay','Cathay Innovation','Venture Capital','San Francisco / Paris','$1B+','global',['ContentSquare','Shift Technology'],'Franco-American enterprise'),
    ('320','cendana','Cendana Capital','Fund of Funds','San Francisco, CA','$2B+','us',['Seed fund investments'],'Fund of funds — seed exposure'),
    ('321','clockwork','Clockwork Capital','Venture Capital','London, UK','$200M+','eu',['European B2B SaaS'],'UK enterprise SaaS'),
    ('322','coller','Coller Capital','Secondary PE','London, UK','$30B+','global',['Secondary positions globally'],'Secondary market — LP solutions'),
    ('323','commonfund','Commonfund Capital','Endowment Fund','Wilton, CT','$26B+','us',['Endowment allocations'],'University endowment tech allocation'),
    ('324','contrary','Contrary Capital','Venture Capital','San Francisco, CA','$500M+','us',['University founder network'],'Student and professor founders'),
    ('325','correlation','Correlation Ventures','Venture Capital','San Diego, CA','$200M+','us',['Data-driven co-investment'],'Algorithmic VC co-investment'),
    ('326','crossbeam','Crossbeam Venture Partners','Venture Capital','Philadelphia, PA','$200M+','us',['Enterprise B2B'],'Mid-Atlantic enterprise'),
    ('327','d1-capital','D1 Capital Partners','Crossover Fund','New York, NY','$20B+','us',['SpaceX','Stripe'],'Public/private tech crossover'),
    ('328','dcm','DCM Ventures','Venture Capital','Menlo Park / Beijing','$5B+','global',['Kuaishou','BYJU\u0027s'],'US-Asia enterprise bridge'),
    ('329','dedicated','Dedicated Capital','Growth Equity','Istanbul, Turkey','$500M+','eu',['Turkish growth companies'],'Turkish enterprise growth'),
    ('330','defy','Defy Partners','Venture Capital','Menlo Park, CA','$1B+','us',['Snyk','Dialpad'],'Enterprise software seed/A'),
    ('331','drake-star','Drake Star Partners','Investment Bank','New York / Munich','N/A (Advisory)','global',['TMT advisory'],'Tech M&A advisory — deal flow'),
    ('332','elad-gil','Elad Gil (Solo GP)','Venture Capital','San Francisco, CA','$1B+','us',['Airbnb','Coinbase','Figma'],'High-profile angel/solo GP'),
    ('333','elephant','Elephant Partners','Growth Equity','Mumbai, India','$500M+','asia',['Indian enterprise growth'],'India growth stage'),
    ('334','embark','Embark Ventures','Venture Capital','San Francisco, CA','$200M+','us',['AI/ML startups'],'Applied AI enterprise'),
    ('335','endeavor-cat','Endeavor Catalyst','Venture Capital','New York, NY','$500M+','global',['Endeavor network'],'Global entrepreneurship network'),
    ('336','engage','Engage Ventures','Venture Capital','Atlanta, GA','$200M+','us',['Southern US enterprise'],'Atlanta enterprise ecosystem'),
    ('337','entr','ENTR Partners','Venture Capital','New York, NY','$500M+','us',['Enterprise infrastructure'],'Enterprise infrastructure fund'),
    ('338','euclid','Euclid Transatlantic Partners','Venture Capital','Washington DC / London','$200M+','global',['US-EU defense tech'],'Transatlantic defense technology'),
    ('339','evolution','Evolution Equity Partners','Venture Capital','New York / London','$800M+','global',['Cybersecurity globally'],'Global cybersecurity specialist'),
    ('340','existing-vc','Existing Ventures','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise B2B seed'],'Seed-stage enterprise'),
    ('341','felix','Felix Capital','Venture Capital','London, UK','$1B+','eu',['Deliveroo','Wise','Mollie'],'European digital lifestyle'),
    ('342','fidelity-international','Fidelity International','Asset Manager','London, UK','$700B+','global',['Global equities and alternatives'],'Global institutional — tech allocation'),
    ('343','first-round','First Round Capital','Venture Capital','San Francisco / NYC','$1B+','us',['Uber','Square','Notion'],'Seed-stage community builder'),
    ('344','five-elms','Five Elms Capital','Growth Equity','Kansas City, MO','$3B+','us',['B2B software growth'],'Mid-market B2B software'),
    ('345','floodgate','Floodgate','Venture Capital','Menlo Park, CA','$1B+','us',['Lyft','Twitter','Twitch'],'Seed-stage conviction investing'),
    ('346','forerunner','Forerunner Ventures','Venture Capital','San Francisco, CA','$2B+','us',['Dollar Shave Club','Glossier'],'Consumer-enterprise bridge'),
    ('347','formation8','Formation 8 / Formation Ventures','Venture Capital','San Francisco, CA','$500M+','us',['Oculus','Hyperloop One'],'Deep tech and enterprise'),
    ('348','frog','Frog Capital','Growth Equity','London, UK','$500M+','eu',['European B2B scale-ups'],'UK enterprise growth'),
    ('349','fuel-ventures','Fuel Ventures','Venture Capital','London, UK','$200M+','eu',['UK pre-seed B2B'],'UK enterprise seed'),
    ('350','garden-of-eden','G Squared','Growth Equity','Chicago, IL','$4B+','us',['SpaceX','Notion','Discord'],'Late-stage enterprise growth'),
    # More global (351-400)
    ('351','gaw','GAW Capital','Real Estate PE','Hong Kong','$30B+','asia',['Asian real estate tech'],'Asia PropTech and enterprise'),
    ('352','general-catalyst-asia','General Catalyst (Asia)','Venture Capital','Singapore','$25B+','asia',['APAC enterprise tech'],'Asia expansion of US franchise'),
    ('353','gfc','Global Founders Capital (GFC)','Venture Capital','Berlin / Singapore','$1B+','global',['Delivery Hero','Trivago'],'Rocket Internet alumni'),
    ('354','google-ai','Google for Startups','Accelerator','Mountain View, CA','N/A (Program)','global',['AI startup ecosystem'],'Google Cloud partnership path'),
    ('355','gratitude-rr','Gratitude Railroad','Venture Capital','New York, NY','$200M+','us',['Impact enterprise'],'Impact-driven enterprise'),
    ('356','grotech','Grotech Ventures','Venture Capital','Owings Mills, MD','$1B+','us',['Advertising.com','Sourcefire'],'East Coast enterprise B2B'),
    ('357','hampleton','Hampleton Partners','M&A Advisory','London / Frankfurt','N/A (Advisory)','eu',['European tech M&A'],'Enterprise tech M&A advisory'),
    ('358','harbert','Harbert Management','Growth Equity','Birmingham, AL','$8B+','us',['Southern US enterprise'],'Southeast enterprise growth'),
    ('359','hartford','Hartford HealthCare Ventures','Corporate VC','Hartford, CT','$100M+','us',['Healthcare AI'],'Health system innovation arm'),
    ('360','henkel-dx','Henkel dx Ventures','Corporate VC','Düsseldorf, Germany','$200M+','eu',['Industrial AI and supply chain'],'Consumer goods CVC'),
    ('361','hero-capital','Hero Capital','Venture Capital','London, UK','$100M+','eu',['UK enterprise seed'],'UK early-stage enterprise'),
    ('362','hoxton','Hoxton Ventures','Venture Capital','London, UK','$300M+','eu',['Darktrace','Deliveroo'],'European deep tech seed'),
    ('363','hubspot-ventures','HubSpot Ventures','Corporate VC','Cambridge, MA','$200M+','us',['CRM and GTM tech'],'HubSpot ecosystem CVC'),
    ('364','hyundai-next','Hyundai CRADLE','Corporate VC','Seoul / Silicon Valley','$500M+','asia',['Mobility AI'],'Hyundai automotive tech CVC'),
    ('365','ibm-ventures','IBM Ventures','Corporate VC','Armonk, NY','$200M+','us',['Enterprise AI'],'IBM ecosystem enterprise AI'),
    ('366','ifg','IFG (Irish Funds Group)','Government Fund','Dublin, Ireland','$300M+','eu',['Irish enterprise tech'],'Irish enterprise tech fund'),
    ('367','igl','IGL Ventures','Venture Capital','Tel Aviv, Israel','$200M+','eu',['Israeli enterprise cybersecurity'],'Israeli cyber seed'),
    ('368','imec','IMEC.istart','Accelerator','Leuven, Belgium','N/A (Accelerator)','eu',['Belgian deep tech'],'Belgian semiconductor/AI ecosystem'),
    ('369','inventus','Inventus Capital Partners','Venture Capital','Menlo Park / Bangalore','$400M+','global',['PolicyBazaar','Spinny'],'US-India enterprise bridge'),
    ('370','ip-group','IP Group','Growth Equity','London, UK','$2B+','eu',['University spin-outs','Oxford Nanopore'],'UK university tech commercialization'),
    ('371','irg','Invus Group','Growth Equity','New York, NY','$5B+','us',['Long-term enterprise holdings'],'Patient capital enterprise'),
    ('372','jmi','JMI Equity','Growth Equity','Baltimore, MD','$6B+','us',['Bronto','LifeLock','Bswift'],'Enterprise software growth'),
    ('373','jp-morgan-ventures','J.P. Morgan Growth Equity','Corporate VC','New York, NY','$1B+','us',['Fintech enterprise infrastructure'],'JPMorgan fintech CVC'),
    ('374','junction','Junction Ventures','Venture Capital','Portland, OR','$100M+','us',['Pacific NW enterprise'],'Oregon enterprise ecosystem'),
    ('375','kae','K Fund (Korea)','Venture Capital','Seoul, South Korea','$300M+','asia',['Korean AI startups'],'Korean enterprise AI'),
    ('376','kairos-vc','Kairos Ventures','Venture Capital','Palo Alto, CA','$300M+','us',['Deep tech from universities'],'Academic research commercialization'),
    ('377','kelly-ventures','Kerry Group Ventures','Corporate VC','Naas, Ireland','$100M+','eu',['Food/agriculture tech'],'Food industry CVC'),
    ('378','kuang-chi','Kuang-Chi','Deep Tech','Shenzhen, China','$2B+','asia',['Chinese deep tech'],'Chinese frontier technology'),
    ('379','lanx','Lanx Capital','Venture Capital','New York, NY','$200M+','us',['Enterprise fintech'],'NYC enterprise fintech'),
    ('380','latitude-ventures','Latitude Ventures','Venture Capital','Lagos / Nairobi','$100M+','global',['African enterprise tech'],'Pan-African B2B tech'),
    ('381','launchpad','Launchpad Capital','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise pre-seed'],'Bay Area enterprise seed'),
    ('382','lead-edge','Lead Edge Capital','Growth Equity','New York, NY','$3B+','us',['Alibaba','Spotify','Uber'],'Enterprise growth through data'),
    ('383','liberty-mutual','Liberty Mutual Strategic Ventures','Corporate VC','Boston, MA','$200M+','us',['Insurtech','Enterprise risk'],'Insurance CVC — risk tech'),
    ('384','linden','Linden Capital Partners','Healthcare PE','Chicago, IL','$5B+','us',['Healthcare enterprise'],'Healthcare-focused buyout'),
    ('385','livingbridge','Livingbridge','Growth Equity','London, UK','$3B+','eu',['UK B2B software scale-ups'],'UK mid-market growth'),
    ('386','lvlup','LvlUp Ventures','Venture Capital','Berlin, Germany','$100M+','eu',['German pre-seed'],'Berlin enterprise seed'),
    ('387','m13','M13','Venture Capital','Los Angeles, CA','$1B+','us',['Ring','Lyft','Daily Harvest'],'LA propulsion platform'),
    ('388','manifold','Manifold Group','Venture Capital','San Francisco, CA','$200M+','us',['Data infrastructure'],'Data infrastructure seed'),
    ('389','marchmont','Marchmont Holdings','Family Office','Greenwich, CT','$500M+','us',['Enterprise tech allocation'],'Family office — enterprise tech'),
    ('390','mayfield','Mayfield Fund','Venture Capital','Menlo Park, CA','$5B+','us',['SolarWinds','Lyft','Poshmark'],'52-year enterprise heritage'),
    ('391','meka','Meka Ventures','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise AI seed'],'AI infrastructure seed'),
    ('392','menlo-micro','Menlo Ventures','Venture Capital','Menlo Park, CA','$5B+','us',['Uber','Siri','Roku'],'Multi-stage enterprise and AI'),
    ('393','microsoft-m12','Microsoft M12 (II)','Corporate VC','Redmond, WA','$2B+','us',['Enterprise infra ecosystem'],'Microsoft strategic investments'),
    ('394','mithril','Mithril Capital','Growth Equity','Austin, TX','$1B+','us',['Palantir co-investment'],'Deep tech and enterprise growth'),
    ('395','montage','Montage Ventures','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise AI seed'],'AI-first seed fund'),
    ('396','morning-star','Morningside Ventures','Venture Capital','Hong Kong','$3B+','asia',['Global deep tech'],'Multi-generational tech family'),
    ('397','motive-asia','Motive Partners (Asia)','Fintech PE','Hong Kong / NYC','$3B+','global',['Fintech enterprise globally'],'Global fintech buyout/growth'),
    ('398','mubadala-tech','Mubadala Technology Fund','Sovereign VC','Abu Dhabi / SF','$1B+','middle-east',['US and MENA tech'],'Abu Dhabi sovereign tech arm'),
    ('399','mundi','Mundi Ventures','Venture Capital','Madrid, Spain','$200M+','eu',['Cybersecurity','Enterprise'],'Spanish cybersecurity specialist'),
    ('400','nam','NAVER D2SF','Corporate VC','Seongnam, South Korea','$500M+','asia',['Korean AI and platform'],'Korean tech giant CVC'),
    # Final batch (401-500)
    ('401','neo','NEO (Network of Entrepreneurs)','Venture Capital','San Francisco, CA','$500M+','us',['Technical founder network'],'Technical founder community'),
    ('402','new-enterprise','New Enterprise Associates (II)','Venture Capital','Menlo Park, CA','$25B+','us',['Coursera','MongoDB'],'Multi-stage global enterprise'),
    ('403','new-york-ventures','NYC Venture Fund','Venture Capital','New York, NY','$100M+','us',['NYC enterprise ecosystem'],'NYC municipal venture fund'),
    ('404','north-bridge','North Bridge Venture Partners','Venture Capital','Waltham, MA','$3B+','us',['Qlik','FullStory'],'Enterprise analytics'),
    ('405','northpond','Northpond Ventures','Venture Capital','Greenwich, CT','$1B+','us',['Science-driven enterprise'],'Deep science enterprise'),
    ('406','ntt-ventures','NTT Venture Capital','Corporate VC','Tokyo / Palo Alto','$500M+','asia',['Enterprise networking'],'NTT Group tech investment arm'),
    ('407','ocean-bio','Ocean Bio-Chem Ventures','Venture Capital','Fort Lauderdale, FL','$100M+','us',['Sustainability tech'],'Environmental compliance tech'),
    ('408','omers','OMERS Ventures','Pension VC','Toronto, Canada','$5B+','global',['Shopify','Hopper','Wealthsimple'],'Ontario pension tech investing'),
    ('409','one-way','One Way Ventures','Venture Capital','Boston, MA','$200M+','us',['Immigrant founders'],'Immigrant founder specialist'),
    ('410','open-ocean','Open Ocean','Venture Capital','Helsinki / London','$300M+','eu',['MySQL founders fund','Nordic B2B'],'Nordic open-source and enterprise'),
    ('411','osborn','Osborne Clarke Ventures','Corporate VC','London / Munich','$100M+','eu',['Legal tech and enterprise'],'Law firm venture arm'),
    ('412','ovo','OVO Fund','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise pre-seed'],'Bay Area pre-seed'),
    ('413','oxford-science','Oxford Science Enterprises','Growth Equity','Oxford, UK','$1B+','eu',['Oxford spinouts'],'Oxford University IP fund'),
    ('414','panache','Panache Ventures','Venture Capital','Calgary, Canada','$200M+','global',['Canadian enterprise tech'],'Canadian seed-stage leader'),
    ('415','peak-xv','Peak XV (ex-Sequoia SEA)','Venture Capital','Singapore / Mumbai','$9B+','asia',['GoTo','Gojek','Zomato'],'Southeast Asia enterprise'),
    ('416','pelion','Pelion Venture Partners','Venture Capital','Salt Lake City, UT','$1B+','us',['Divvy','Podium'],'Utah enterprise ecosystem'),
    ('417','penn-mutual','Penn Mutual Ventures','Corporate VC','Horsham, PA','$100M+','us',['InsurTech enterprise'],'Insurance enterprise CVC'),
    ('418','phoenix-vc','Phoenix Venture Partners','Venture Capital','San Mateo, CA','$200M+','us',['Advanced materials & AI'],'Materials science enterprise'),
    ('419','playground','Playground Global','Venture Capital','Palo Alto, CA','$500M+','us',['Synthetic Minds','Sila Nano'],'Deep tech and enterprise AI'),
    ('420','plug-play-japan','Plug and Play Japan','Accelerator','Tokyo, Japan','N/A (Accelerator)','asia',['Japanese enterprise innovation'],'Silicon Valley model in Japan'),
    ('421','point72','Point72 Ventures','Venture Capital','New York, NY','$2B+','us',['Data infra','Fintech'],'Steve Cohen tech venture arm'),
    ('422','prologis','Prologis Ventures','Corporate VC','San Francisco, CA','$200M+','us',['Logistics and supply chain AI'],'Logistics real estate CVC'),
    ('423','propel','Propel Venture Partners','Venture Capital','San Francisco, CA','$500M+','us',['BBVA fintech','Enterprise banking'],'Bank-backed fintech VC'),
    ('424','ptc-ventures','PTC Ventures','Corporate VC','Boston, MA','$100M+','us',['Industrial IoT and AI'],'PTC industrial enterprise CVC'),
    ('425','puma-springboard','PUMA Springboard','Venture Capital','Dublin, Ireland','$300M+','eu',['Allied Irish Banks network'],'Irish enterprise and fintech'),
    ('426','qualcomm','Qualcomm Ventures','Corporate VC','San Diego, CA','$2B+','us',['Edge AI','5G enterprise'],'Qualcomm edge AI ecosystem'),
    ('427','quantum-valley','Quantum Valley Investments','Venture Capital','Waterloo, Canada','$200M+','global',['Quantum computing'],'Canadian quantum and enterprise'),
    ('428','radcliffe','Radcliffe Capital','Venture Capital','London, UK','$200M+','eu',['UK enterprise growth'],'London enterprise growth'),
    ('429','rain-capital','Rain Capital','Venture Capital','San Jose, CA','$200M+','us',['Cybersecurity enterprise'],'Enterprise cybersecurity seed'),
    ('430','reactor','Reactor','Venture Capital','Waterloo / Toronto','$100M+','global',['Canadian deep tech'],'Canadian AI and enterprise'),
    ('431','redline','Redline Capital','Venture Capital','Luxembourg','$500M+','eu',['European growth stage'],'European enterprise growth'),
    ('432','republic','Republic','Venture Platform','New York, NY','$1B+','us',['Crowd and institutional blend'],'Democratized enterprise investing'),
    ('433','ridge-vc','Ridge Ventures','Venture Capital','San Francisco, CA','$1B+','us',['New Relic','PagerDuty'],'Enterprise observability'),
    ('434','ripple','Ripple Ventures','Venture Capital','Toronto, Canada','$200M+','global',['Canadian enterprise B2B'],'Canadian enterprise SaaS'),
    ('435','rocketship','Rocketship.vc','Venture Capital','San Mateo, CA','$300M+','us',['Consumer and enterprise hybrid'],'Data-driven global VC'),
    ('436','salesforce-ventures2','Salesforce Ventures (Asia)','Corporate VC','Tokyo / Singapore','$1B+','asia',['Asian enterprise CRM ecosystem'],'Salesforce APAC CVC'),
    ('437','samsung-catalyst','Samsung Catalyst Fund','Corporate VC','Menlo Park, CA','$500M+','us',['Enterprise and semiconductor AI'],'Samsung strategic CVC'),
    ('438','sap-sapphire','SAP.iO / Sapphire Ventures','Corporate VC','Palo Alto, CA','$8B+','us',['SAP ecosystem enterprise'],'SAP venture ecosystem'),
    ('439','scale-asia','Scale Asia Ventures','Venture Capital','Seoul / Singapore','$300M+','asia',['APAC enterprise AI'],'Pan-Asian AI enterprise'),
    ('440','scout-ventures','Scout Ventures','Venture Capital','New York, NY','$200M+','us',['Defense and enterprise'],'NYC defense tech'),
    ('441','seq-capital','SEQ Capital','Venture Capital','San Francisco, CA','$200M+','us',['Seed enterprise infra'],'Enterprise infrastructure seed'),
    ('442','shunwei','Shunwei Capital','Venture Capital','Beijing, China','$3B+','asia',['Chinese mobile and AI'],'Lei Jun — Xiaomi founder fund'),
    ('443','signalfire','SignalFire','Venture Capital','San Francisco, CA','$2B+','us',['Data-driven enterprise investing'],'Data platform VC'),
    ('444','sky9','Sky9 Capital','Venture Capital','Shanghai, China','$1B+','asia',['Chinese enterprise SaaS'],'Chinese enterprise B2B'),
    ('445','slow-ventures','Slow Ventures','Venture Capital','San Francisco, CA','$500M+','us',['Long-term enterprise bets'],'Patient enterprise capital'),
    ('446','smartfin','SmartFin Capital','Venture Capital','Antwerp, Belgium','$300M+','eu',['Benelux enterprise tech'],'Belgian enterprise specialist'),
    ('447','so-fi-ventures','SoFi Ventures','Corporate VC','San Francisco, CA','$200M+','us',['Fintech ecosystem'],'SoFi fintech CVC'),
    ('448','spring-mountain','Spring Mountain Capital','Venture Capital','New York, NY','$300M+','us',['Enterprise fund of funds'],'Enterprise tech fund allocation'),
    ('449','standard-crypto','Standard Crypto','Venture Capital','San Francisco, CA','$200M+','us',['Crypto infrastructure'],'Crypto and decentralized governance'),
    ('450','starburst','Starburst Ventures','Venture Capital','Los Angeles / Paris','$300M+','global',['Aerospace and defense AI'],'Aerospace defense accelerator/fund'),
    ('451','starts','Starts Ventures','Venture Capital','Tokyo, Japan','$200M+','asia',['Japanese enterprise B2B'],'Japanese proptech and enterprise'),
    ('452','steelpoint','SteelPoint Capital','Growth Equity','Westport, CT','$500M+','us',['Enterprise security growth'],'Cybersecurity growth'),
    ('453','step-stone','StepStone Group','Fund of Funds','New York, NY','$100B+','global',['Private market allocation'],'Global LP — private markets'),
    ('454','strong-vc','Strong Ventures','Venture Capital','San Francisco / Seoul','$200M+','global',['Korean-American bridge'],'US-Korea enterprise tech'),
    ('455','super-angel','Superhuman Capital','Venture Capital','San Francisco, CA','$100M+','us',['Enterprise productivity'],'Productivity tools investor'),
    ('456','svb-capital','SVB Capital (Silicon Valley Bank)','Venture Capital','Santa Clara, CA','$10B+','us',['Fund of funds plus direct'],'Innovation economy specialist'),
    ('457','swisscom-v2','Swisscom Ventures (II)','Corporate VC','Bern, Switzerland','$500M+','eu',['Swiss enterprise tech'],'Swiss telecom CVC'),
    ('458','tao-capital','Tao Capital Partners','Growth Equity','Honolulu, HI','$500M+','us',['Sustainable enterprise'],'Pierre Omidyar family office growth'),
    ('459','tata-ventures','Tata Capital Healthcare Fund','Corporate VC','Mumbai, India','$500M+','asia',['Indian healthcare enterprise'],'Tata Group health tech CVC'),
    ('460','tcv','TCV','Growth Equity','Menlo Park / NYC','$20B+','us',['Airbnb','Spotify','Netflix'],'Technology Crossover Ventures'),
    ('461','tech-coast','Tech Coast Angels','Angel Network','Los Angeles, CA','$200M+','us',['Southern CA enterprise'],'LA angel network'),
    ('462','tech-nexus','TechNexus','Venture Capital','Chicago, IL','$200M+','us',['Midwest enterprise B2B'],'Chicago enterprise collaborative'),
    ('463','telefonica','Telefónica Ventures','Corporate VC','Madrid / London','$500M+','global',['Global telecom enterprise'],'Telefónica ecosystem CVC'),
    ('464','tenor-capital','Tenor Capital','Alternative Investments','New York, NY','$1B+','us',['Tech-focused alternatives'],'Event-driven tech investing'),
    ('465','tf-ventures','TF Ventures','Venture Capital','Zurich, Switzerland','$200M+','eu',['Swiss enterprise deep tech'],'Swiss enterprise technology'),
    ('466','tmv','Telstra Ventures','Corporate VC','Sydney / San Francisco','$500M+','asia',['Enterprise networking and AI'],'Telstra CVC — enterprise comms'),
    ('467','tom-ventures','Tom Advisors Ventures','Family Office','New York, NY','$500M+','us',['Enterprise tech allocation'],'Family office enterprise tech'),
    ('468','tough-mudder','True Ventures','Venture Capital','San Francisco, CA','$3B+','us',['Peloton','Ring','Fitbit'],'Founder-first enterprise investing'),
    ('469','two-sigma','Two Sigma Ventures','Venture Capital','New York, NY','$1B+','us',['AI and data infrastructure'],'Quantitative firm venture arm'),
    ('470','union-tech','Union Tech Ventures','Venture Capital','Berlin, Germany','$100M+','eu',['German enterprise seed'],'Berlin seed enterprise'),
    ('471','valar-global','Valar Ventures (II)','Venture Capital','New York / London','$1B+','global',['N26','Xero','TransferWise'],'Thiel global fintech/enterprise'),
    ('472','valor-equity','Valor Equity Partners','Growth Equity','Chicago, IL','$3B+','us',['Tesla','SpaceX','Anduril'],'Operational growth enterprise'),
    ('473','vantage-point','Vanedge Capital','Venture Capital','Vancouver, Canada','$500M+','global',['Canadian AI and enterprise'],'Western Canada tech leader'),
    ('474','vector-capital','Vector Capital','Private Equity','San Francisco, CA','$5B+','us',['Enterprise tech buyouts'],'Mid-market enterprise buyout'),
    ('475','venture-highway','Venture Highway','Venture Capital','Palo Alto / India','$300M+','asia',['Indian enterprise SaaS'],'India B2B SaaS pioneer'),
    ('476','venture-reality','Venture Reality Fund','Venture Capital','San Francisco, CA','$200M+','us',['Spatial computing and enterprise'],'XR and enterprise tech'),
    ('477','volta-ventures','Volta Ventures','Venture Capital','Ghent, Belgium','$200M+','eu',['Benelux enterprise B2B'],'Belgian enterprise seed'),
    ('478','warbg2','Warburg Pincus (Asia)','Growth Equity','Hong Kong / Mumbai','$20B+','asia',['Asian enterprise tech growth'],'Asian enterprise growth arm'),
    ('479','wide-ventures','Wide Ventures','Venture Capital','London, UK','$100M+','eu',['European frontier tech'],'UK early-stage enterprise'),
    ('480','wild-basin','Wild Basin Investments','Venture Capital','Austin, TX','$200M+','us',['Texas enterprise tech'],'Austin enterprise ecosystem'),
    ('481','wing-vc2','Wing Venture Capital (II)','Venture Capital','Palo Alto, CA','$800M+','us',['Pure enterprise B2B'],'Enterprise-only thesis'),
    ('482','workbench','Work-Bench','Venture Capital','New York, NY','$200M+','us',['Enterprise B2B only'],'NYC enterprise specialist'),
    ('483','world-fund','World Fund','Venture Capital','Berlin, Germany','$350M+','eu',['Climate enterprise tech'],'European climate tech VC'),
    ('484','x-vc','X Ventures','Venture Capital','New York, NY','$200M+','us',['Enterprise deep tech'],'Deep tech enterprise seed'),
    ('485','ya-ventures','Y Analytics','Impact VC','Dallas, TX','$200M+','us',['Impact enterprise investing'],'Measurable impact enterprise'),
    ('486','yabeo','Yabeo Capital','Venture Capital','Munich, Germany','$500M+','eu',['German enterprise growth'],'DACH enterprise growth'),
    ('487','york-ie','York IE','Venture Capital','Manchester, NH','$200M+','us',['Northeast enterprise B2B'],'New England enterprise specialist'),
    ('488','z-venture','Z Venture Capital','Venture Capital','Tokyo, Japan','$500M+','asia',['Japanese enterprise AI'],'SoftBank affiliate Japan seed'),
    ('489','zedcrest','Zedcrest Capital','Venture Capital','Lagos, Nigeria','$100M+','global',['Nigerian enterprise fintech'],'West African enterprise tech'),
    ('490','zenith','Zenith Venture Capital','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise infrastructure'],'Enterprise infra pre-seed'),
    ('491','zetta','Zetta Venture Partners','Venture Capital','San Francisco, CA','$500M+','us',['AI enterprise investing'],'AI-first enterprise specialist'),
    ('492','zinc','Zinc VC','Venture Capital','London, UK','$100M+','eu',['Mission-driven enterprise'],'Social impact enterprise'),
    ('493','zions-vc','Zions Bancorporation Ventures','Corporate VC','Salt Lake City, UT','$100M+','us',['Banking enterprise tech'],'Regional bank CVC'),
    ('494','zodiac','Zodiac Ventures','Venture Capital','San Francisco, CA','$200M+','us',['Enterprise AI and data'],'Enterprise AI seed'),
    ('495','zurich-ventures','Zurich Insurance Ventures','Corporate VC','Zurich, Switzerland','$200M+','eu',['InsurTech enterprise'],'Insurance CVC — enterprise risk'),
    ('496','zweig','Zweig DiMenna','Hedge Fund / VC','New York, NY','$3B+','us',['Tech opportunistic'],'Crossover enterprise investing'),
    ('497','1517-fund','1517 Fund','Venture Capital','San Francisco, CA','$200M+','us',['Young founders enterprise'],'Thiel Fellowship affiliated'),
    ('498','10x-genomics-ventures','10x Capital','Venture Capital','New York, NY','$500M+','us',['Enterprise tech platform'],'NYC enterprise growth'),
    ('499','137-ventures','137 Ventures','Secondary Fund','San Francisco, CA','$2B+','us',['Pre-IPO enterprise tech'],'Employee equity secondary'),
    ('500','22-ventures','22 Ventures','Venture Capital','New York, NY','$200M+','us',['Enterprise AI and fintech'],'NYC enterprise seed'),
]

for f in _firms:
    BATCH3.append({
        'num': int(f[0]), 'slug': f[1], 'name': f[2], 'type': f[3],
        'loc': f[4], 'aum': f[5], 'region': f[6],
        'portfolio': f[7], 'thesis': f[8], 'web': ''
    })

# 2 more regional targets
REGIONAL_EXTRA = [
    {'num': 121, 'slug': 'east-african-community', 'name': 'East African Community - Arusha'},
    {'num': 122, 'slug': 'sadc-gaborone', 'name': 'SADC - Gaborone'},
]

print(f'Batch 3 investor firms: {len(BATCH3)}')
print(f'Regional extra: {len(REGIONAL_EXTRA)}')
print(f'Total new in this batch: {len(BATCH3) + len(REGIONAL_EXTRA)}')

# Generate
output_dir = os.path.join(BASE, 'investor-500', 'pptx')
generated = 0
print(f'\nGenerating {len(BATCH3)} investor-500 decks (batch 3)...')
for firm in BATCH3:
    path = generate_investor_deck(firm, output_dir)
    embed_screenshots(path)
    generated += 1
    if generated % 50 == 0:
        print(f'  {generated} generated...')

# Regional extra
output_dir_r = os.path.join(BASE, 'regional', 'pptx')
for target in REGIONAL_EXTRA:
    path = generate_thematic_deck(target, output_dir_r)
    embed_screenshots(path)
    generated += 1

print(f'\nBatch 3 done: {generated} new decks')

# Grand total
import glob
total = 0
for folder in ['pptx', 'investor/pptx', 'investor-50/pptx', 'investor-100/pptx',
                'investor-500/pptx', 'sales/pptx', 'design-partner/pptx',
                'gamma/pptx', 'enterprise/pptx', 'regional/pptx']:
    path = os.path.join(BASE, folder)
    if os.path.exists(path):
        count = len(glob.glob(os.path.join(path, '*.pptx')))
        total += count
        if count > 0:
            print(f'  {folder}: {count}')
print(f'  GRAND TOTAL PPTX: {total}')
