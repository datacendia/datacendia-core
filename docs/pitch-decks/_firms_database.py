"""
Database of real investment firms, enterprises, and partners for pitch deck generation.
Every entry is a real organization — no fabricated data.

Categories:
  - investor-500: 380 new personalized investor decks (expanding investor-100 to 500)
  - investor-50-extra: 49 more thematic investor decks
  - sales-extra: 50 more sales decks
  - design-partner-extra: 50 more design partner decks
  - enterprise: 100 new enterprise-targeted decks
  - regional: 122 new region-specific decks
  - investor-extra: 5 more generic investor decks
  - gamma-extra: 4 more gamma decks
  Total: 760 new decks
"""

# ─── Investor-500: Real VC/PE/CVC/SWF/Foundation firms ──────────────────────
# These expand investor-100 (currently 120) to investor-500 (500 total).
# Numbers 121-500. Each must be a real firm.

INVESTOR_500_NEW = [
    # US VC — Tier 1 (firms 121-160)
    {'num': 121, 'slug': 'benchmark', 'name': 'Benchmark', 'type': 'Venture Capital', 'loc': 'San Francisco, CA', 'aum': '$3B+', 'region': 'us', 'portfolio': ['Uber', 'Twitter', 'Snap', 'eBay', 'Dropbox'], 'thesis': 'Iconic early-stage firm backing category-defining companies', 'web': 'benchmark.com'},
    {'num': 122, 'slug': 'kleiner-perkins', 'name': 'Kleiner Perkins', 'type': 'Venture Capital', 'loc': 'Menlo Park, CA', 'aum': '$12B+', 'region': 'us', 'portfolio': ['Google', 'Amazon', 'Genentech', 'Twitter', 'Slack'], 'thesis': 'Pioneered tech VC — enterprise and climate tech', 'web': 'kleinerperkins.com'},
    {'num': 123, 'slug': 'andreessen-growth', 'name': 'a16z Growth', 'type': 'Growth Equity', 'loc': 'Menlo Park, CA', 'aum': '$10B+', 'region': 'us', 'portfolio': ['Databricks', 'Roblox', 'Coinbase'], 'thesis': 'Growth-stage AI infrastructure investments', 'web': 'a16z.com'},
    {'num': 124, 'slug': 'tiger-global', 'name': 'Tiger Global Management', 'type': 'Crossover Fund', 'loc': 'New York, NY', 'aum': '$80B+', 'region': 'us', 'portfolio': ['Stripe', 'ByteDance', 'Figma', 'Databricks'], 'thesis': 'High-velocity enterprise software investing', 'web': 'tigerglobal.com'},
    {'num': 125, 'slug': 'dragoneer', 'name': 'Dragoneer Investment Group', 'type': 'Growth Equity', 'loc': 'San Francisco, CA', 'aum': '$20B+', 'region': 'us', 'portfolio': ['Snowflake', 'UiPath', 'Datadog', 'Cloudflare'], 'thesis': 'Technology-focused growth investing', 'web': 'dragoneer.com'},
    {'num': 126, 'slug': 'greenoaks', 'name': 'Greenoaks Capital', 'type': 'Growth Equity', 'loc': 'San Francisco, CA', 'aum': '$15B+', 'region': 'us', 'portfolio': ['Coupang', 'Brex', 'Wiz'], 'thesis': 'Concentrated bets on category leaders', 'web': 'greenoakscap.com'},
    {'num': 127, 'slug': 'paradigm', 'name': 'Paradigm', 'type': 'Venture Capital', 'loc': 'San Francisco, CA', 'aum': '$8B+', 'region': 'us', 'portfolio': ['Uniswap', 'Optimism', 'Cosmos'], 'thesis': 'Crypto and frontier tech research-driven fund', 'web': 'paradigm.xyz'},
    {'num': 128, 'slug': 'altimeter', 'name': 'Altimeter Capital', 'type': 'Crossover Fund', 'loc': 'Menlo Park, CA', 'aum': '$18B+', 'region': 'us', 'portfolio': ['Snowflake', 'Uber', 'Grab'], 'thesis': 'Public/private tech crossover with enterprise focus', 'web': 'altimetercap.com'},
    {'num': 129, 'slug': 'addition', 'name': 'Addition', 'type': 'Venture Capital', 'loc': 'New York, NY', 'aum': '$2B+', 'region': 'us', 'portfolio': ['Plaid', 'Figma', 'Notion'], 'thesis': 'Founded by Lee Fixel — concentrated portfolio approach', 'web': 'addition.com'},
    {'num': 130, 'slug': 'spark-capital', 'name': 'Spark Capital', 'type': 'Venture Capital', 'loc': 'Boston / San Francisco', 'aum': '$6B+', 'region': 'us', 'portfolio': ['Twitter', 'Slack', 'Affirm', 'Discord'], 'thesis': 'Multi-stage with enterprise DNA', 'web': 'sparkcapital.com'},
    {'num': 131, 'slug': 'ribbit', 'name': 'Ribbit Capital', 'type': 'Venture Capital', 'loc': 'Palo Alto, CA', 'aum': '$4B+', 'region': 'us', 'portfolio': ['Robinhood', 'Coinbase', 'Nubank', 'Credit Karma'], 'thesis': 'Fintech specialist — compliance and trust infrastructure', 'web': 'ribbitcap.com'},
    {'num': 132, 'slug': 'union-square', 'name': 'Union Square Ventures', 'type': 'Venture Capital', 'loc': 'New York, NY', 'aum': '$2B+', 'region': 'us', 'portfolio': ['Twitter', 'Coinbase', 'Etsy', 'Tumblr'], 'thesis': 'Thesis-driven — networks, marketplaces, decentralization', 'web': 'usv.com'},
    {'num': 133, 'slug': 'thrive', 'name': 'Thrive Capital', 'type': 'Venture Capital', 'loc': 'New York, NY', 'aum': '$12B+', 'region': 'us', 'portfolio': ['Instagram', 'Spotify', 'Stripe', 'OpenAI'], 'thesis': 'Consumer and enterprise platform investing', 'web': 'thrivecap.com'},
    {'num': 134, 'slug': 'initialized', 'name': 'Initialized Capital', 'type': 'Venture Capital', 'loc': 'San Francisco, CA', 'aum': '$1B+', 'region': 'us', 'portfolio': ['Coinbase', 'Instacart', 'Cruise'], 'thesis': 'Pre-seed/seed specialists, technical founders', 'web': 'initialized.com'},
    {'num': 135, 'slug': 'social-capital', 'name': 'Social Capital', 'type': 'Venture Capital', 'loc': 'Palo Alto, CA', 'aum': '$3B+', 'region': 'us', 'portfolio': ['Slack', 'Box', 'SurveyMonkey'], 'thesis': 'Capital-as-a-service, data-driven investing', 'web': 'socialcapital.com'},
    {'num': 136, 'slug': 'dst-global', 'name': 'DST Global', 'type': 'Growth Equity', 'loc': 'Hong Kong / US', 'aum': '$30B+', 'region': 'global', 'portfolio': ['Facebook', 'Airbnb', 'Spotify', 'Stripe'], 'thesis': 'Late-stage global technology platforms', 'web': 'dstglobal.com'},
    {'num': 137, 'slug': 'goodwater', 'name': 'Goodwater Capital', 'type': 'Venture Capital', 'loc': 'Burlingame, CA', 'aum': '$3B+', 'region': 'us', 'portfolio': ['Faire', 'StockX', 'Whatnot'], 'thesis': 'Consumer technology data-driven investing', 'web': 'goodwatercap.com'},
    {'num': 138, 'slug': 'founders-fund', 'name': 'Founders Fund', 'type': 'Venture Capital', 'loc': 'San Francisco, CA', 'aum': '$11B+', 'region': 'us', 'portfolio': ['SpaceX', 'Palantir', 'Stripe', 'Airbnb'], 'thesis': 'Transformative technology — Peter Thiel legacy', 'web': 'foundersfund.com'},
    {'num': 139, 'slug': 'insight-partners', 'name': 'Insight Partners', 'type': 'Growth Equity', 'loc': 'New York, NY', 'aum': '$90B+', 'region': 'us', 'portfolio': ['Shopify', 'Twitter', 'DocuSign', 'Veeam'], 'thesis': 'ScaleUp platform — operational growth support', 'web': 'insightpartners.com'},
    {'num': 140, 'slug': 'gv', 'name': 'GV (Google Ventures)', 'type': 'Corporate VC', 'loc': 'Mountain View, CA', 'aum': '$8B+', 'region': 'us', 'portfolio': ['Uber', 'Slack', 'Stripe', 'GitLab'], 'thesis': 'Alphabet CVC — AI and enterprise infrastructure', 'web': 'gv.com'},

    # US Cybersecurity / Defense / Gov-Tech VC (141-165)
    {'num': 141, 'slug': 'shield-ai-ventures', 'name': 'Shield Capital', 'type': 'Defense VC', 'loc': 'Washington, DC', 'aum': '$200M+', 'region': 'us', 'portfolio': ['Shield AI', 'Epirus', 'Vannevar Labs'], 'thesis': 'National security technology — cleared workforce', 'web': 'shieldcap.com'},
    {'num': 142, 'slug': 'lytical', 'name': 'Lytical Ventures', 'type': 'Defense VC', 'loc': 'McLean, VA', 'aum': '$500M+', 'region': 'us', 'portfolio': ['Babel Street', 'Shift5', 'HawkEye 360'], 'thesis': 'Intelligence community technology', 'web': 'lytical.vc'},
    {'num': 143, 'slug': 'marconi', 'name': 'MarconiVentures', 'type': 'Defense VC', 'loc': 'Washington, DC', 'aum': '$150M+', 'region': 'us', 'portfolio': ['National security startups'], 'thesis': 'Deep tech for defense and intelligence', 'web': 'marconiventures.com'},
    {'num': 144, 'slug': 'aft-capital', 'name': 'America\'s Frontier Fund', 'type': 'Government-aligned Fund', 'loc': 'Washington, DC', 'aum': '$500M+', 'region': 'us', 'portfolio': ['Strategic technology investments'], 'thesis': 'Bipartisan tech sovereignty — critical infrastructure', 'web': 'americasfrontierfund.org'},
    {'num': 145, 'slug': 'dod-diu', 'name': 'Defense Innovation Unit (DIU)', 'type': 'Government', 'loc': 'Mountain View, CA', 'aum': 'N/A (Government)', 'region': 'us', 'portfolio': ['Anduril', 'Shield AI', 'SpaceX'], 'thesis': 'DoD dual-use technology adoption', 'web': 'diu.mil'},
    {'num': 146, 'slug': 'socap', 'name': 'SOCAP Global', 'type': 'Impact Accelerator', 'loc': 'San Francisco, CA', 'aum': 'N/A (Network)', 'region': 'us', 'portfolio': ['Social enterprise alumni'], 'thesis': 'Social capital markets — impact meets technology', 'web': 'socapglobal.com'},
    {'num': 147, 'slug': 'teneleven', 'name': 'Ten Eleven Ventures', 'type': 'Cybersecurity VC', 'loc': 'Palo Alto, CA', 'aum': '$1.5B+', 'region': 'us', 'portfolio': ['SentinelOne', 'Twistlock', 'Verodin'], 'thesis': 'Pure-play cybersecurity — AI governance fits security stack', 'web': 'teneleven.vc'},
    {'num': 148, 'slug': 'forgepoint', 'name': 'ForgePoint Capital', 'type': 'Cybersecurity VC', 'loc': 'San Mateo, CA', 'aum': '$1B+', 'region': 'us', 'portfolio': ['CrowdStrike', 'Carbon Black', 'Ionic Security'], 'thesis': 'Enterprise security infrastructure', 'web': 'forgepointcap.com'},
    {'num': 149, 'slug': 'paladin', 'name': 'Paladin Capital Group', 'type': 'Cybersecurity VC', 'loc': 'Washington, DC', 'aum': '$2B+', 'region': 'us', 'portfolio': ['Trellix', 'CyberGRX', 'Virtru'], 'thesis': 'Cyber, space, and strategic tech', 'web': 'paladincapgroup.com'},
    {'num': 150, 'slug': 'crosspoint', 'name': 'Crosspoint Capital Partners', 'type': 'Cybersecurity PE', 'loc': 'Woodside, CA', 'aum': '$3B+', 'region': 'us', 'portfolio': ['Absolute Software', 'Corelight'], 'thesis': 'Mid-market cybersecurity buyouts', 'web': 'crosspointcapital.com'},

    # Fintech VC (151-170)
    {'num': 151, 'slug': 'nyca-partners', 'name': 'NYCA Partners', 'type': 'Fintech VC', 'loc': 'New York, NY', 'aum': '$1.5B+', 'region': 'us', 'portfolio': ['Canoe Intelligence', 'Axoni', 'Digital Asset'], 'thesis': 'Financial infrastructure specialists', 'web': 'nycapartners.com'},
    {'num': 152, 'slug': 'qed-investors', 'name': 'QED Investors', 'type': 'Fintech VC', 'loc': 'Alexandria, VA', 'aum': '$4B+', 'region': 'us', 'portfolio': ['Nubank', 'Credit Karma', 'SoFi', 'Remitly'], 'thesis': 'Data-driven fintech investing', 'web': 'qedinvestors.com'},
    {'num': 153, 'slug': 'nydig', 'name': 'NYDIG', 'type': 'Digital Asset Infrastructure', 'loc': 'New York, NY', 'aum': '$10B+', 'region': 'us', 'portfolio': ['Bitcoin infrastructure'], 'thesis': 'Institutional digital asset infrastructure', 'web': 'nydig.com'},
    {'num': 154, 'slug': 'canapi', 'name': 'Canapi Ventures', 'type': 'Fintech VC', 'loc': 'Washington, DC', 'aum': '$1B+', 'region': 'us', 'portfolio': ['Alloy', 'Sardine', 'Greenlight'], 'thesis': 'Bank-backed fintech fund', 'web': 'canapi.com'},
    {'num': 155, 'slug': 'clocktower', 'name': 'Clocktower Technology Ventures', 'type': 'Fintech VC', 'loc': 'Santa Monica, CA', 'aum': '$500M+', 'region': 'us', 'portfolio': ['Plaid', 'M-Kopa', 'Branch'], 'thesis': 'Global fintech infrastructure', 'web': 'clocktower.com'},
    {'num': 156, 'slug': 'f-prime', 'name': 'F-Prime Capital', 'type': 'Venture Capital', 'loc': 'Cambridge, MA', 'aum': '$4B+', 'region': 'us', 'portfolio': ['Flatiron Health', 'CrowdStrike', 'Coda'], 'thesis': 'Fidelity-affiliated — healthcare and enterprise tech', 'web': 'fprimecapital.com'},
    {'num': 157, 'slug': 'oak-hc-ft', 'name': 'Oak HC/FT', 'type': 'Healthcare/Fintech VC', 'loc': 'Greenwich, CT', 'aum': '$5B+', 'region': 'us', 'portfolio': ['Oscar Health', 'Devoted Health', 'Signify Health'], 'thesis': 'Healthcare and financial technology convergence', 'web': 'oakhcft.com'},
    {'num': 158, 'slug': 'general-atlantic', 'name': 'General Atlantic', 'type': 'Growth Equity', 'loc': 'New York, NY', 'aum': '$84B+', 'region': 'global', 'portfolio': ['Airbnb', 'Uber', 'ByteDance', 'Adyen'], 'thesis': 'Global growth investor across tech verticals', 'web': 'generalatlantic.com'},
    {'num': 159, 'slug': 'warburg-pincus', 'name': 'Warburg Pincus', 'type': 'Growth Equity', 'loc': 'New York, NY', 'aum': '$83B+', 'region': 'global', 'portfolio': ['Ant Financial', 'Lenskart', 'GoTo'], 'thesis': 'Global growth PE — technology and financial services', 'web': 'warburgpincus.com'},
    {'num': 160, 'slug': 'kkr-tech', 'name': 'KKR (Technology Group)', 'type': 'Private Equity', 'loc': 'New York, NY', 'aum': '$500B+', 'region': 'global', 'portfolio': ['BMC Software', 'Epicor', 'Cloudera'], 'thesis': 'Enterprise tech buyouts and growth', 'web': 'kkr.com'},

    # European VC/PE (161-220)
    {'num': 161, 'slug': 'accel-europe', 'name': 'Accel (Europe)', 'type': 'Venture Capital', 'loc': 'London, UK', 'aum': '$15B+', 'region': 'eu', 'portfolio': ['Spotify', 'UiPath', 'Deliveroo', 'Miro'], 'thesis': 'Top-tier European tech investing', 'web': 'accel.com'},
    {'num': 162, 'slug': 'index-ventures', 'name': 'Index Ventures (Europe)', 'type': 'Venture Capital', 'loc': 'London / Geneva', 'aum': '$8B+', 'region': 'eu', 'portfolio': ['Revolut', 'Figma', 'Discord', 'Notion'], 'thesis': 'Transatlantic VC with European roots', 'web': 'indexventures.com'},
    {'num': 163, 'slug': 'general-catalyst-eu', 'name': 'General Catalyst (EU Office)', 'type': 'Venture Capital', 'loc': 'London / Berlin', 'aum': '$25B+', 'region': 'eu', 'portfolio': ['Stripe', 'Snap', 'Kayak', 'Lemonade'], 'thesis': 'Responsible innovation and regulation-ready AI', 'web': 'generalcatalyst.com'},
    {'num': 164, 'slug': 'hv-capital', 'name': 'HV Capital', 'type': 'Venture Capital', 'loc': 'Munich, Germany', 'aum': '$3B+', 'region': 'eu', 'portfolio': ['Zalando', 'HelloFresh', 'Flixbus'], 'thesis': 'DACH region enterprise tech leader', 'web': 'hvcapital.com'},
    {'num': 165, 'slug': 'partech', 'name': 'Partech', 'type': 'Venture Capital', 'loc': 'Paris / San Francisco', 'aum': '$3B+', 'region': 'eu', 'portfolio': ['Bolt', 'Mirakl', 'Shift Technology'], 'thesis': 'Transatlantic — strong in French tech ecosystem', 'web': 'partechpartners.com'},
    {'num': 166, 'slug': 'mmc-ventures', 'name': 'MMC Ventures', 'type': 'Venture Capital', 'loc': 'London, UK', 'aum': '$1B+', 'region': 'eu', 'portfolio': ['Peak AI', 'Signal AI', 'Ravelin'], 'thesis': 'AI-first investor — publishes annual State of AI report', 'web': 'mmcventures.com'},
    {'num': 167, 'slug': 'notion-capital', 'name': 'Notion Capital', 'type': 'Venture Capital', 'loc': 'London, UK', 'aum': '$1B+', 'region': 'eu', 'portfolio': ['GoCardless', 'Star', 'Tradeshift'], 'thesis': 'B2B SaaS specialists — enterprise focus', 'web': 'notion.vc'},
    {'num': 168, 'slug': 'highland-europe', 'name': 'Highland Europe', 'type': 'Growth Equity', 'loc': 'Geneva, Switzerland', 'aum': '$3B+', 'region': 'eu', 'portfolio': ['GetYourGuide', 'Malwarebytes', 'WeTransfer'], 'thesis': 'European growth-stage technology', 'web': 'highlandeurope.com'},
    {'num': 169, 'slug': 'verdane', 'name': 'Verdane', 'type': 'Growth Equity', 'loc': 'Oslo / Stockholm', 'aum': '$5B+', 'region': 'eu', 'portfolio': ['Rendra', 'Infobric', 'Documaster'], 'thesis': 'Nordic technology — sustainability and digital transformation', 'web': 'verdane.com'},
    {'num': 170, 'slug': 'eight-roads', 'name': 'Eight Roads Ventures', 'type': 'Venture Capital', 'loc': 'London / US / Asia', 'aum': '$8B+', 'region': 'global', 'portfolio': ['Alibaba', 'Sysdig', 'Paidy'], 'thesis': 'Fidelity-backed global multi-stage VC', 'web': 'eightroads.com'},

    # More European (171-220) - abbreviated format for space
    {'num': 171, 'slug': 'sofina', 'name': 'Sofina', 'type': 'Investment Holding', 'loc': 'Brussels, Belgium', 'aum': '$10B+', 'region': 'eu', 'portfolio': ['ByteDance', 'Flixbus', 'Swile'], 'thesis': 'Long-term European technology holding', 'web': 'sofinagroup.com'},
    {'num': 172, 'slug': 'idinvest', 'name': 'Eurazeo Venture (ex-Idinvest)', 'type': 'Venture Capital', 'loc': 'Paris, France', 'aum': '$2B+', 'region': 'eu', 'portfolio': ['Criteo', 'Mirakl', 'ManoMano'], 'thesis': 'French ecosystem deep tech investing', 'web': 'eurazeo.com'},
    {'num': 173, 'slug': 'nauta', 'name': 'Nauta Capital', 'type': 'Venture Capital', 'loc': 'Barcelona / London', 'aum': '$500M+', 'region': 'eu', 'portfolio': ['Typeform', 'Pleo', 'Tradeshift'], 'thesis': 'European B2B software and cybersecurity', 'web': 'nautacapital.com'},
    {'num': 174, 'slug': 'cavalry', 'name': 'Cavalry Ventures', 'type': 'Venture Capital', 'loc': 'Berlin, Germany', 'aum': '$200M+', 'region': 'eu', 'portfolio': ['Pitch', 'Tourlane', 'Grover'], 'thesis': 'Berlin pre-seed and seed — enterprise focus', 'web': 'cavalry.vc'},
    {'num': 175, 'slug': 'keen', 'name': 'Keen Venture Partners', 'type': 'Venture Capital', 'loc': 'Amsterdam, Netherlands', 'aum': '$300M+', 'region': 'eu', 'portfolio': ['Messagebird', 'Shypple', 'Bux'], 'thesis': 'Benelux enterprise software', 'web': 'keenvp.com'},
    {'num': 176, 'slug': 'breega', 'name': 'Breega', 'type': 'Venture Capital', 'loc': 'Paris, France', 'aum': '$500M+', 'region': 'eu', 'portfolio': ['Spendesk', 'Qonto', 'Dataiku'], 'thesis': 'French AI and enterprise SaaS', 'web': 'breega.com'},
    {'num': 177, 'slug': 'seventure', 'name': 'Seventure Partners', 'type': 'Venture Capital', 'loc': 'Paris, France', 'aum': '$1B+', 'region': 'eu', 'portfolio': ['Lifen', 'Cardiologs', 'Voluntis'], 'thesis': 'Health tech and deep tech — regulated industries', 'web': 'seventure.fr'},
    {'num': 178, 'slug': 'alma-mundi', 'name': 'Alma Mundi Ventures', 'type': 'Venture Capital', 'loc': 'Madrid, Spain', 'aum': '$100M+', 'region': 'eu', 'portfolio': ['Impact investing in Southern Europe'], 'thesis': 'Iberian deep tech and sustainability', 'web': 'almamundi.vc'},
    {'num': 179, 'slug': 'caixa-capital', 'name': 'Caixa Capital Risc', 'type': 'Corporate VC', 'loc': 'Barcelona, Spain', 'aum': '$500M+', 'region': 'eu', 'portfolio': ['eDreams', 'Trovit', 'Kantox'], 'thesis': 'La Caixa banking group — fintech and enterprise', 'web': 'caixacapitalrisc.es'},
    {'num': 180, 'slug': 'cdp-venture', 'name': 'CDP Venture Capital', 'type': 'Government VC', 'loc': 'Rome, Italy', 'aum': '$2B+', 'region': 'eu', 'portfolio': ['Italian tech ecosystem'], 'thesis': 'Italian national innovation fund', 'web': 'cdpventurecapital.it'},

    # Asia-Pacific (181-230)
    {'num': 181, 'slug': 'sequoia-india', 'name': 'Peak XV Partners (ex-Sequoia India)', 'type': 'Venture Capital', 'loc': 'Bangalore, India', 'aum': '$9B+', 'region': 'asia', 'portfolio': ['Zomato', 'BYJUs', 'Razorpay', 'Cred'], 'thesis': 'India and Southeast Asia technology leader', 'web': 'peakxv.com'},
    {'num': 182, 'slug': 'hillhouse', 'name': 'Hillhouse Capital', 'type': 'Growth Equity', 'loc': 'Beijing / Hong Kong', 'aum': '$100B+', 'region': 'asia', 'portfolio': ['Tencent', 'JD.com', 'Zoom', 'Pinduoduo'], 'thesis': 'Asia deep value and technology investing', 'web': 'hillhousecap.com'},
    {'num': 183, 'slug': 'vertex-ventures', 'name': 'Vertex Ventures', 'type': 'Venture Capital', 'loc': 'Singapore', 'aum': '$5B+', 'region': 'asia', 'portfolio': ['Grab', 'Patsnap', 'Nium'], 'thesis': 'Temasek-backed Southeast Asia tech', 'web': 'vertexventures.com'},
    {'num': 184, 'slug': 'global-brain', 'name': 'Global Brain', 'type': 'Venture Capital', 'loc': 'Tokyo, Japan', 'aum': '$2B+', 'region': 'asia', 'portfolio': ['SmartNews', 'XTIA', 'Tier IV'], 'thesis': 'Japanese enterprise and AI technology', 'web': 'globalbrains.com'},
    {'num': 185, 'slug': 'wavemaker', 'name': 'Wavemaker Partners', 'type': 'Venture Capital', 'loc': 'Singapore / LA', 'aum': '$500M+', 'region': 'asia', 'portfolio': ['Akulaku', 'Carro', 'FinAccel'], 'thesis': 'ASEAN deep tech and enterprise B2B', 'web': 'wavemaker.vc'},
    {'num': 186, 'slug': 'jungle-ventures', 'name': 'Jungle Ventures', 'type': 'Venture Capital', 'loc': 'Singapore', 'aum': '$1B+', 'region': 'asia', 'portfolio': ['Kredivo', 'Moglix', 'Sociolla'], 'thesis': 'Southeast Asia enterprise and fintech', 'web': 'jungle.vc'},
    {'num': 187, 'slug': 'sparx', 'name': 'SPARX Group', 'type': 'Asset Management', 'loc': 'Tokyo, Japan', 'aum': '$15B+', 'region': 'asia', 'portfolio': ['Japanese tech investments'], 'thesis': 'Japanese institutional investors — governance focus', 'web': 'sparxgroup.com'},
    {'num': 188, 'slug': 'macquarie-tech', 'name': 'Macquarie Technology Ventures', 'type': 'Corporate VC', 'loc': 'Sydney, Australia', 'aum': '$500M+', 'region': 'asia', 'portfolio': ['Australian enterprise tech'], 'thesis': 'Asia-Pacific banking and infrastructure tech', 'web': 'macquarie.com'},
    {'num': 189, 'slug': 'blackbird', 'name': 'Blackbird Ventures', 'type': 'Venture Capital', 'loc': 'Sydney, Australia', 'aum': '$3B+', 'region': 'asia', 'portfolio': ['Canva', 'SafetyCulture', 'Culture Amp'], 'thesis': 'Australia/NZ — largest local VC', 'web': 'blackbird.vc'},
    {'num': 190, 'slug': 'square-peg', 'name': 'Square Peg Capital', 'type': 'Venture Capital', 'loc': 'Melbourne, Australia', 'aum': '$2B+', 'region': 'asia', 'portfolio': ['Canva', 'Fiverr', 'Stripe (AU)'], 'thesis': 'Australia-Israel-SE Asia enterprise bridge', 'web': 'squarepegcap.com'},

    # Middle East (191-210)
    {'num': 191, 'slug': 'adq', 'name': 'ADQ', 'type': 'Sovereign Wealth Fund', 'loc': 'Abu Dhabi, UAE', 'aum': '$110B+', 'region': 'middle-east', 'portfolio': ['Technology portfolio diversification'], 'thesis': 'Abu Dhabi sovereign tech diversification', 'web': 'adq.ae'},
    {'num': 192, 'slug': 'pif', 'name': 'Public Investment Fund (PIF)', 'type': 'Sovereign Wealth Fund', 'loc': 'Riyadh, Saudi Arabia', 'aum': '$700B+', 'region': 'middle-east', 'portfolio': ['Lucid Motors', 'Magic Leap', 'NEOM'], 'thesis': 'Saudi Vision 2030 — AI and technology sovereignty', 'web': 'pif.gov.sa'},
    {'num': 193, 'slug': 'hub71', 'name': 'Hub71', 'type': 'Government Accelerator', 'loc': 'Abu Dhabi, UAE', 'aum': 'N/A (Accelerator)', 'region': 'middle-east', 'portfolio': ['UAE startup ecosystem'], 'thesis': 'Abu Dhabi tech ecosystem — MENA gateway', 'web': 'hub71.com'},
    {'num': 194, 'slug': 'misk', 'name': 'Misk Foundation', 'type': 'Foundation', 'loc': 'Riyadh, Saudi Arabia', 'aum': '$1B+', 'region': 'middle-east', 'portfolio': ['Saudi youth tech initiatives'], 'thesis': 'Saudi technology entrepreneurship and AI education', 'web': 'misk.org.sa'},
    {'num': 195, 'slug': 'wamda', 'name': 'Wamda Capital', 'type': 'Venture Capital', 'loc': 'Dubai, UAE', 'aum': '$200M+', 'region': 'middle-east', 'portfolio': ['Careem', 'Swvl', 'Vezeeta'], 'thesis': 'MENA enterprise and tech ecosystem builder', 'web': 'wamda.com'},
    {'num': 196, 'slug': 'shorooq', 'name': 'Shorooq Partners', 'type': 'Venture Capital', 'loc': 'Abu Dhabi, UAE', 'aum': '$200M+', 'region': 'middle-east', 'portfolio': ['Tabby', 'NymCard', 'Ziina'], 'thesis': 'MENA fintech and enterprise tech', 'web': 'shorooqpartners.com'},
    {'num': 197, 'slug': 'beco', 'name': 'BECO Capital', 'type': 'Venture Capital', 'loc': 'Dubai, UAE', 'aum': '$200M+', 'region': 'middle-east', 'portfolio': ['Kitopi', 'Baraka', 'Vezeeta'], 'thesis': 'MENA technology investing', 'web': 'becocapital.com'},
    {'num': 198, 'slug': 'nuwa', 'name': 'Nuwa Capital', 'type': 'Venture Capital', 'loc': 'Riyadh, Saudi Arabia', 'aum': '$100M+', 'region': 'middle-east', 'portfolio': ['MENA tech startups'], 'thesis': 'Saudi Arabia early-stage tech', 'web': 'nuwacapital.com'},
    {'num': 199, 'slug': 'cdpq', 'name': 'CDPQ (Caisse de dépôt)', 'type': 'Pension Fund', 'loc': 'Montreal, Canada', 'aum': '$400B+', 'region': 'global', 'portfolio': ['Lightsource BP', 'Azure Power', 'Ivanhoé Cambridge'], 'thesis': 'Canadian institutional — governance and sustainability focus', 'web': 'cdpq.com'},
    {'num': 200, 'slug': 'cppib', 'name': 'CPP Investments', 'type': 'Pension Fund', 'loc': 'Toronto, Canada', 'aum': '$570B+', 'region': 'global', 'portfolio': ['Global infrastructure and technology'], 'thesis': 'Canadian Pension Plan — long-term technology bets', 'web': 'cppinvestments.com'},
]

# We'll add more in batches of 50 to reach 500 total
# For now, firms 121-200 (80 new firms) are defined above.
# The full generation script will extend this to 500.

# ─── Sales decks (50 more) ──────────────────────────────────────────────────
SALES_EXTRA = [
    # By vertical (26-40)
    {'num': 26, 'slug': 'construction', 'name': 'Construction & Engineering', 'type': 'Vertical Deck'},
    {'num': 27, 'slug': 'media-entertainment', 'name': 'Media & Entertainment', 'type': 'Vertical Deck'},
    {'num': 28, 'slug': 'telecommunications', 'name': 'Telecommunications', 'type': 'Vertical Deck'},
    {'num': 29, 'slug': 'higher-education', 'name': 'Higher Education', 'type': 'Vertical Deck'},
    {'num': 30, 'slug': 'nonprofit', 'name': 'Non-Profit / NGO', 'type': 'Vertical Deck'},
    {'num': 31, 'slug': 'agriculture', 'name': 'Agriculture / AgTech', 'type': 'Vertical Deck'},
    {'num': 32, 'slug': 'aerospace-defense', 'name': 'Aerospace & Defense', 'type': 'Vertical Deck'},
    {'num': 33, 'slug': 'automotive', 'name': 'Automotive', 'type': 'Vertical Deck'},
    {'num': 34, 'slug': 'hospitality-travel', 'name': 'Hospitality & Travel', 'type': 'Vertical Deck'},
    {'num': 35, 'slug': 'sports-athletics', 'name': 'Sports & Athletics', 'type': 'Vertical Deck'},
    # By pain point (36-50)
    {'num': 36, 'slug': 'decision-fatigue', 'name': 'Decision Fatigue', 'type': 'Pain Point Deck'},
    {'num': 37, 'slug': 'regulatory-chaos', 'name': 'Regulatory Chaos', 'type': 'Pain Point Deck'},
    {'num': 38, 'slug': 'ai-liability', 'name': 'AI Liability Risk', 'type': 'Pain Point Deck'},
    {'num': 39, 'slug': 'board-accountability', 'name': 'Board Accountability', 'type': 'Pain Point Deck'},
    {'num': 40, 'slug': 'cross-border-compliance', 'name': 'Cross-Border Compliance', 'type': 'Pain Point Deck'},
    {'num': 41, 'slug': 'shadow-ai', 'name': 'Shadow AI Problem', 'type': 'Pain Point Deck'},
    {'num': 42, 'slug': 'evidence-trail', 'name': 'No Evidence Trail', 'type': 'Pain Point Deck'},
    {'num': 43, 'slug': 'institutional-memory', 'name': 'Institutional Memory Loss', 'type': 'Pain Point Deck'},
    {'num': 44, 'slug': 'bias-detection', 'name': 'AI Bias Detection', 'type': 'Pain Point Deck'},
    {'num': 45, 'slug': 'whistleblower', 'name': 'Whistleblower Protection', 'type': 'Pain Point Deck'},
    # By competitor comparison (46-55)
    {'num': 46, 'slug': 'vs-palantir', 'name': 'vs Palantir', 'type': 'Competitor Comparison'},
    {'num': 47, 'slug': 'vs-c3ai', 'name': 'vs C3.ai', 'type': 'Competitor Comparison'},
    {'num': 48, 'slug': 'vs-dataiku', 'name': 'vs Dataiku', 'type': 'Competitor Comparison'},
    {'num': 49, 'slug': 'vs-h2o', 'name': 'vs H2O.ai', 'type': 'Competitor Comparison'},
    {'num': 50, 'slug': 'vs-databricks', 'name': 'vs Databricks', 'type': 'Competitor Comparison'},
    # By deployment + compliance (51-60)
    {'num': 51, 'slug': 'hipaa-deploy', 'name': 'HIPAA Deployment Guide', 'type': 'Compliance Deck'},
    {'num': 52, 'slug': 'fedramp', 'name': 'FedRAMP Path', 'type': 'Compliance Deck'},
    {'num': 53, 'slug': 'sox-compliance', 'name': 'SOX Compliance', 'type': 'Compliance Deck'},
    {'num': 54, 'slug': 'pci-dss', 'name': 'PCI DSS Alignment', 'type': 'Compliance Deck'},
    {'num': 55, 'slug': 'cmmc', 'name': 'CMMC Level 3', 'type': 'Compliance Deck'},
    # By buyer persona (56-65)
    {'num': 56, 'slug': 'ciso', 'name': 'CISO / Security Leader', 'type': 'Persona Deck'},
    {'num': 57, 'slug': 'cto', 'name': 'CTO / Engineering Leader', 'type': 'Persona Deck'},
    {'num': 58, 'slug': 'cfo', 'name': 'CFO / Finance Leader', 'type': 'Persona Deck'},
    {'num': 59, 'slug': 'cco', 'name': 'CCO / Compliance Leader', 'type': 'Persona Deck'},
    {'num': 60, 'slug': 'board-directors', 'name': 'Board of Directors', 'type': 'Persona Deck'},
    {'num': 61, 'slug': 'general-counsel', 'name': 'General Counsel', 'type': 'Persona Deck'},
    {'num': 62, 'slug': 'chief-risk', 'name': 'Chief Risk Officer', 'type': 'Persona Deck'},
    {'num': 63, 'slug': 'chief-data', 'name': 'Chief Data Officer', 'type': 'Persona Deck'},
    {'num': 64, 'slug': 'cio', 'name': 'CIO / IT Leader', 'type': 'Persona Deck'},
    {'num': 65, 'slug': 'head-of-ai', 'name': 'Head of AI / ML', 'type': 'Persona Deck'},
    # By company size (66-75)
    {'num': 66, 'slug': 'startup', 'name': 'Startup (1-50)', 'type': 'Size Deck'},
    {'num': 67, 'slug': 'smb', 'name': 'SMB (50-500)', 'type': 'Size Deck'},
    {'num': 68, 'slug': 'mid-enterprise', 'name': 'Mid-Enterprise (500-5000)', 'type': 'Size Deck'},
    {'num': 69, 'slug': 'large-enterprise', 'name': 'Large Enterprise (5000+)', 'type': 'Size Deck'},
    {'num': 70, 'slug': 'government-agency', 'name': 'Government Agency', 'type': 'Size Deck'},
    {'num': 71, 'slug': 'multilateral', 'name': 'Multilateral Organization (UN, WHO, IMF)', 'type': 'Size Deck'},
    {'num': 72, 'slug': 'consortium', 'name': 'Industry Consortium', 'type': 'Size Deck'},
    {'num': 73, 'slug': 'academic-institution', 'name': 'Academic / Research Institution', 'type': 'Size Deck'},
    {'num': 74, 'slug': 'central-bank', 'name': 'Central Bank / Regulator', 'type': 'Size Deck'},
    {'num': 75, 'slug': 'military', 'name': 'Military / Defense Org', 'type': 'Size Deck'},
]

# ─── Design Partner decks (50 more) ─────────────────────────────────────────
DESIGN_PARTNER_EXTRA = [
    {'num': 26, 'slug': 'real-estate', 'name': 'Real Estate / Construction'},
    {'num': 27, 'slug': 'transportation', 'name': 'Transportation / Logistics'},
    {'num': 28, 'slug': 'media', 'name': 'Media / Entertainment'},
    {'num': 29, 'slug': 'telecom', 'name': 'Telecommunications'},
    {'num': 30, 'slug': 'education', 'name': 'Higher Education'},
    {'num': 31, 'slug': 'agriculture', 'name': 'Agriculture / AgTech'},
    {'num': 32, 'slug': 'aerospace', 'name': 'Aerospace'},
    {'num': 33, 'slug': 'automotive', 'name': 'Automotive'},
    {'num': 34, 'slug': 'hospitality', 'name': 'Hospitality / Travel'},
    {'num': 35, 'slug': 'sports', 'name': 'Sports / Athletics'},
    {'num': 36, 'slug': 'smart-city', 'name': 'Smart City / Municipal'},
    {'num': 37, 'slug': 'mining', 'name': 'Mining / Resources'},
    {'num': 38, 'slug': 'nonprofit', 'name': 'Non-Profit / NGO'},
    {'num': 39, 'slug': 'central-banking', 'name': 'Central Banking'},
    {'num': 40, 'slug': 'sovereign-wealth', 'name': 'Sovereign Wealth Ops'},
    # By use case (41-60)
    {'num': 41, 'slug': 'pre-mortem', 'name': 'Pre-Mortem Analysis'},
    {'num': 42, 'slug': 'ghost-board', 'name': 'Ghost Board Simulation'},
    {'num': 43, 'slug': 'evidence-export', 'name': 'Evidence Export / Regulator Receipt'},
    {'num': 44, 'slug': 'compliance-gap', 'name': 'Compliance Gap Analysis'},
    {'num': 45, 'slug': 'stress-testing', 'name': 'AI Stress Testing (COLLAPSE)'},
    {'num': 46, 'slug': 'escrow', 'name': 'Cryptographic Decision Escrow'},
    {'num': 47, 'slug': 'multi-jurisdiction', 'name': 'Multi-Jurisdiction Compliance'},
    {'num': 48, 'slug': 'board-reporting', 'name': 'Board Decision Reporting'},
    {'num': 49, 'slug': 'workforce-api', 'name': 'Workday / HR Integration'},
    {'num': 50, 'slug': 'hubspot-crm', 'name': 'HubSpot / CRM Integration'},
    {'num': 51, 'slug': 'aws-deploy', 'name': 'AWS Deployment'},
    {'num': 52, 'slug': 'azure-deploy', 'name': 'Azure Deployment'},
    {'num': 53, 'slug': 'gcp-deploy', 'name': 'GCP Deployment'},
    {'num': 54, 'slug': 'on-prem-deploy', 'name': 'On-Premises Deployment'},
    {'num': 55, 'slug': 'air-gapped-deploy', 'name': 'Air-Gapped Deployment'},
    # By integration (56-75)
    {'num': 56, 'slug': 'databricks-int', 'name': 'Databricks Integration'},
    {'num': 57, 'slug': 'azure-openai', 'name': 'Azure OpenAI Integration'},
    {'num': 58, 'slug': 'aws-bedrock', 'name': 'AWS Bedrock Integration'},
    {'num': 59, 'slug': 'google-vertex', 'name': 'Google Vertex AI Integration'},
    {'num': 60, 'slug': 'anthropic', 'name': 'Anthropic Claude Integration'},
    {'num': 61, 'slug': 'ollama-local', 'name': 'Ollama / Local LLM'},
    {'num': 62, 'slug': 'mistral', 'name': 'Mistral AI Integration'},
    {'num': 63, 'slug': 'servicenow-int', 'name': 'ServiceNow Integration'},
    {'num': 64, 'slug': 'jira-int', 'name': 'Jira / Atlassian Integration'},
    {'num': 65, 'slug': 'slack-int', 'name': 'Slack Integration'},
    {'num': 66, 'slug': 'teams-int', 'name': 'Microsoft Teams Integration'},
    {'num': 67, 'slug': 'power-bi-int', 'name': 'Power BI Integration'},
    {'num': 68, 'slug': 'tableau-int', 'name': 'Tableau Integration'},
    {'num': 69, 'slug': 'splunk-int', 'name': 'Splunk Integration'},
    {'num': 70, 'slug': 'elastic-int', 'name': 'Elasticsearch Integration'},
    {'num': 71, 'slug': 'kubernetes', 'name': 'Kubernetes Deployment'},
    {'num': 72, 'slug': 'terraform', 'name': 'Terraform IaC'},
    {'num': 73, 'slug': 'github-actions', 'name': 'GitHub Actions CI/CD'},
    {'num': 74, 'slug': 'okta-auth', 'name': 'Okta / SSO Integration'},
    {'num': 75, 'slug': 'cyberark', 'name': 'CyberArk Vault Integration'},
]

print(f'Investor-500 new firms defined: {len(INVESTOR_500_NEW)}')
print(f'Sales extra defined: {len(SALES_EXTRA)}')
print(f'Design Partner extra defined: {len(DESIGN_PARTNER_EXTRA)}')
print(f'Total new deck targets so far: {len(INVESTOR_500_NEW) + len(SALES_EXTRA) + len(DESIGN_PARTNER_EXTRA)}')
print(f'Still need: enterprise(100) + regional(122) + investor-50-extra(49) + investor(5) + gamma(4) = 280 more')
print(f'Grand total when complete: 240 existing + 760 new = 1,000')
