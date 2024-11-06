from pymongo import MongoClient
from datetime import datetime
import re
from typing import List, Dict, Any

# MongoDB connection setup
MONGO_URI = "mongodb://localhost:27017"  # Replace with your MongoDB URI
DB_NAME = "your_database_name"  # Replace with your database name

def validate_url(url: str) -> bool:
    """Validate URL format and security requirements."""
    try:
        pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return bool(pattern.match(url))
    except:
        return False

def create_platform_documents() -> List[Dict[str, Any]]:
    """Create a list of platform documents to be inserted into MongoDB."""
    
    platforms = [
        {
            "name": "Robinhood",
            "slug": "robinhood",
            "category": "finance",
            "icon": "https://logo.clearbit.com/robinhood.com",  # Replace with actual icon URL
            "description": "Robinhood is a commission-free stock trading & investing app.",
            "benefitDescription": "Get one share of a stock worth between $3 and $225 when you sign up using a referral link.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new account with valid information",
                "Complete the account verification process",
                "Wait for application approval",
                "Receive your free stock within 7 days of approval"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^http:\/\/share\.robinhood\.com\/[a-zA-Z0-9]+$",
                    "format": "http://share.robinhood.com/[USERNAME]",
                    "examples": ["http://share.robinhood.com/johnd123"],
                    "invalidMessage": "Invalid Robinhood referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Robinhood app",
                "Navigate to the 'Earn stock' section",
                "Select 'Invite contacts' or 'Share link'",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://robinhood.com/us/en/about/referral",
            "websiteUrl": "https://robinhood.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Cash App",
            "slug": "cash-app",
            "category": "finance",
            "icon": "https://logo.clearbit.com/cash.app",
            "description": "Cash App is a mobile payment service that allows users to transfer money to one another using a mobile phone app.",
            "benefitDescription": "Get $5 free when you download the Cash App, sign up using a friend’s Cash App referral code, connect your bank account, and send someone at least $5 within 14 days of signing up. The referrer gets $30 once you do so.",
            "claimSteps": [
                "Download the Cash App",
                "Sign up using a friend’s Cash App referral code",
                "Connect your bank account",
                "Send someone at least $5 within 14 days of signing up"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Cash App referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Cash App",
                "Tap on the profile icon",
                "Select 'Invite Friends' or 'Referral'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://cash.app",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Pokémon GO",
            "slug": "pokemon-go",
            "category": "entertainment",
            "icon": "https://logo.clearbit.com/pokemongo.com",
            "description": "Pokémon GO is a location-based augmented reality game that allows players to capture and train virtual creatures called Pokémon.",
            "benefitDescription": "Get 100 Poké Balls when you join Pokémon GO or return to it after not playing for 90 days, enter a friend’s Pokémon GO referral code, and your friend accepts your friend request in Pokémon GO. The referrer gets 50 Stardust once they do so. As long as you both remain friends on Pokémon GO, you each will earn rewards as you complete certain quests specific to the referral program.",
            "claimSteps": [
                "Join or return to Pokémon GO",
                "Enter a friend’s Pokémon GO referral code",
                "Have your friend accept your friend request in Pokémon GO"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Pokémon GO referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Pokémon GO app",
                "Tap on the 'Settings' icon",
                "Select 'Friends' and then 'Invite Friends'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://pokemongo.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Swagbucks",
            "slug": "swagbucks",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/swagbucks.com",
            "description": "Swagbucks is a rewards program that allows users to earn points for various online activities which can be redeemed for gift cards or cash.",
            "benefitDescription": "Get a 1,000 SB bonus, equivalent to $10 in value, when you sign up for Swagbucks using a friend’s Swagbucks referral link, activate the bonus in the Swag Ups section of your account, and spend at least $25, earning at least 25 SB, at a store featured in Swagbucks Shop within 30 days of signing up. Once you do so, the referrer gets a 300 SB bonus and will earn 10% of your Swagbucks earnings for the lifetime of your account.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new account with valid information",
                "Activate the bonus in the Swag Ups section of your account",
                "Spend at least $25 and earn at least 25 SB at a store featured in Swagbucks Shop within 30 days of signing up"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/www\.swagbucks\.com\/profile\/[A-Za-z0-9]+$",
                    "format": "https://www.swagbucks.com/profile/[CODE]",
                    "examples": ["https://www.swagbucks.com/profile/ABC123"],
                    "invalidMessage": "Invalid Swagbucks referral link format"
                }
            },
            "getReferralSteps": [
                "Log in to your Swagbucks account",
                "Navigate to the 'Account' section",
                "Select 'Referral' or 'Invite Friends'",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://www.swagbucks.com/profile/[YOUR_CODE]",
            "websiteUrl": "https://swagbucks.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Rakuten",
            "slug": "rakuten",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/rakuten.com",
            "description": "Rakuten is a cashback and coupon platform that allows users to earn cashback on their online purchases.",
            "benefitDescription": "Get a $30 welcome bonus when you sign up for Rakuten (previously known as Ebates) using a friend’s Rakuten referral link and make $30 worth of purchases within 90 days of signing up. The referrer gets a $30 bonus once you do so.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new account with valid information",
                "Make $30 worth of purchases within 90 days of signing up"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^(https:\/\/www\.rakuten\.com\/r\/[A-Za-z0-9]+|https:\/\/go\.ebat\.es\/[A-Za-z0-9]+)$",
                    "format": "https://www.rakuten.com/r/[CODE] or https://go.ebat.es/[CODE]",
                    "examples": ["https://www.rakuten.com/r/ABC123", "https://go.ebat.es/XYZ789"],
                    "invalidMessage": "Invalid Rakuten referral link format"
                }
            },
            "getReferralSteps": [
                "Log in to your Rakuten account",
                "Navigate to the 'Refer a Friend' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://www.rakuten.com/r/[YOUR_CODE] or https://go.ebat.es/[YOUR_CODE]",
            "websiteUrl": "https://rakuten.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Uber Eats",
            "slug": "uber-eats",
            "category": "food",
            "icon": "https://logo.clearbit.com/ubereats.com",
            "description": "Uber Eats is a food delivery service that allows users to order meals from local restaurants and have them delivered to their doorstep.",
            "benefitDescription": "Get $20 off your first order of $25 or more when you sign up for Uber Eats for the first time and enter a friend’s Uber Eats referral code at checkout of your first order. Once you complete your order, the referrer gets a credit for $10 off an order of $25 or more.",
            "claimSteps": [
                "Sign up for Uber Eats for the first time",
                "Enter a friend’s Uber Eats referral code at checkout of your first order",
                "Complete your first order of $25 or more"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Uber Eats referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Uber Eats app",
                "Go to the 'Account' section",
                "Select 'Invite Friends' or 'Referral'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://ubereats.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "DoorDash",
            "slug": "doordash",
            "category": "food",
            "icon": "https://logo.clearbit.com/doordash.com",
            "description": "DoorDash is an on-demand food delivery service that connects users with local restaurants and couriers.",
            "benefitDescription": "Get $10–15 off your first three DoorDash orders over $15 when you sign up for DoorDash using a friend’s DoorDash referral link. The referrer gets $10 in credits once you place your first order over $25.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new DoorDash account with valid information",
                "Place your first order over $15 using the referral link"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^(http:\/\/drd\.sh\/[A-Za-z0-9]+\/|https:\/\/doordash\.com\/consumer\/referred\/[A-Za-z0-9]+\/)$",
                    "format": "http://drd.sh/[CODE]/ or https://doordash.com/consumer/referred/[CODE]/",
                    "examples": ["http://drd.sh/ABC123/", "https://doordash.com/consumer/referred/XYZ789/"],
                    "invalidMessage": "Invalid DoorDash referral link format"
                }
            },
            "getReferralSteps": [
                "Open the DoorDash app or website",
                "Go to the 'Account' section",
                "Select 'Refer a Friend' or 'Invite Friends'",
                "Copy your unique referral link"
            ],
            "getReferralLink": "http://drd.sh/[YOUR_CODE]/ or https://doordash.com/consumer/referred/[YOUR_CODE]/",
            "websiteUrl": "https://doordash.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Honey",
            "slug": "honey",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/joinhoney.com",
            "description": "Honey is a browser extension that helps users find and apply discount codes at checkout for online shopping.",
            "benefitDescription": "Make your first qualifying purchase using a Honey referral link and receive rewards. The referrer gets 500 PayPal Rewards points, equivalent to $5.",
            "claimSteps": [
                "Click on the referral link",
                "Sign up for Honey with your information",
                "Make your first qualifying purchase"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/www\.joinhoney\.com\/ref\/[A-Za-z0-9]+$",
                    "format": "https://www.joinhoney.com/ref/[CODE]",
                    "examples": ["https://www.joinhoney.com/ref/ABC123"],
                    "invalidMessage": "Invalid Honey referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Honey website or browser extension",
                "Navigate to the 'Refer Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://www.joinhoney.com/ref/[YOUR_CODE]",
            "websiteUrl": "https://joinhoney.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Lyft",
            "slug": "lyft",
            "category": "travel",
            "icon": "https://logo.clearbit.com/lyft.com",
            "description": "Lyft is a ride-sharing service that connects riders with drivers for transportation needs.",
            "benefitDescription": "Get $2–9 off each of your first 1–5 Lyft rides when you sign up for Lyft using a friend’s Lyft referral code. The number of rides depends upon which market you sign up in, not whose code you use. To receive the credits, you must apply the code before your first ride and the credits are good for 15 days after you sign up. The referrer gets $5–18 of ride credit once you complete your first ride.",
            "claimSteps": [
                "Sign up for Lyft using a friend’s referral code",
                "Apply the referral code before your first ride",
                "Complete your first ride"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Lyft referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Lyft app",
                "Go to the 'Account' section",
                "Select 'Invite Friends' or 'Refer a Friend'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://lyft.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Ibotta",
            "slug": "ibotta",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/ibotta.com",
            "description": "Ibotta is a cashback and rewards app that allows users to earn money back on their grocery and online purchases.",
            "benefitDescription": "Get a $5 bonus when you sign up for Ibotta using a friend’s Ibotta referral code and submit your first receipt. The referrer also gets a $5 bonus once you do so.",
            "claimSteps": [
                "Sign up for Ibotta using a friend’s referral code",
                "Submit your first receipt",
                "Ensure the receipt is approved"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Ibotta referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Ibotta app",
                "Navigate to the 'Profile' section",
                "Select 'Refer a Friend'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://ibotta.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Lime",
            "slug": "lime",
            "category": "travel",
            "icon": "https://logo.clearbit.com/li.me",
            "description": "Lime is a micro-mobility company that provides electric scooters and bikes for rent.",
            "benefitDescription": "Get one free unlock coupon, a $1 value, when you sign up for Lime for the first time and use a friend’s Lime referral code. Once you take your first scooter or bike ride, the referrer gets a coupon for one free unlock as well.",
            "claimSteps": [
                "Sign up for Lime using a friend’s referral code",
                "Use the referral code during sign-up",
                "Take your first scooter or bike ride"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Lime referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Lime app",
                "Navigate to the 'Profile' section",
                "Select 'Invite Friends' or 'Refer a Friend'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://li.me",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Webull",
            "slug": "webull",
            "category": "finance",
            "icon": "https://logo.clearbit.com/webull.com",
            "description": "Webull is a brokerage platform offering commission-free trading for stocks, ETFs, and cryptocurrencies.",
            "benefitDescription": "Get up to 24 free stocks worth $3–3,000 each when you open a Webull brokerage account using a friend’s Webull referral link and make an initial deposit of any amount within 30 days of signing up. The referrer gets up to 20 free stocks worth $3–3,000 each once you do so. The referrer may be eligible for additional rewards depending on current Webull promotions.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new Webull account with valid information",
                "Make an initial deposit within 30 days of signing up"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/a\.webull\.com\/[A-Za-z0-9]+$",
                    "format": "https://a.webull.com/[CODE]",
                    "examples": ["https://a.webull.com/ABC123"],
                    "invalidMessage": "Invalid Webull referral link format"
                }
            },
            "getReferralSteps": [
                "Log in to your Webull account",
                "Navigate to the 'Invite Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://a.webull.com/[YOUR_CODE]",
            "websiteUrl": "https://webull.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Fetch Rewards",
            "slug": "fetch-rewards",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/fetchrewards.com",
            "description": "Fetch Rewards is a mobile app that rewards users for scanning grocery receipts and completing offers.",
            "benefitDescription": "Get 100 Fetch Rewards bonus points when you sign up for Fetch Rewards using a friend’s Fetch Rewards referral code and scan your first receipt. The referrer gets 100 Fetch Rewards points once you do so.",
            "claimSteps": [
                "Sign up for Fetch Rewards using a friend’s referral code",
                "Scan your first grocery receipt",
                "Ensure the receipt is approved"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Fetch Rewards referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Fetch Rewards app",
                "Navigate to the 'Profile' section",
                "Select 'Refer Friends' or 'Invite Friends'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://fetchrewards.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Binance",
            "slug": "binance",
            "category": "finance",
            "icon": "https://logo.clearbit.com/binance.com",
            "description": "Binance is a global cryptocurrency exchange that provides a platform for trading more than 500 cryptocurrencies.",
            "benefitDescription": "Get a 0–20% commission kickback on your trading fees when you register a new Binance account using a friend’s Binance referral ID or link. The kickback rate is chosen by the referrer when creating their referral ID and is listed as 'your commission kickback rate' on the referral page. Referrers with a daily average BNB balance less than 500 BNB receive a 20% commission and can choose to share 0%, 5%, or 10% with you as your kickback. Referrers with a daily average BNB balance of 500 BNB or more receive a 40% commission and can choose to share 0%, 5%, 10%, 15%, or 20% with you as your kickback.",
            "claimSteps": [
                "Click on the referral link or use the referral ID",
                "Create a new Binance account with valid information",
                "Complete the KYC verification process",
                "Start trading to earn commissions"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6,}$",
                    "format": "[CODE]",
                    "examples": ["ABC123", "BINANCE2024"],
                    "invalidMessage": "Invalid Binance referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Binance app or website",
                "Navigate to the 'Referral' section",
                "Copy your unique referral code or link"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://binance.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Revolut",
            "slug": "revolut",
            "category": "finance",
            "icon": "https://logo.clearbit.com/revolut.com",
            "description": "Revolut is a financial technology company that offers banking services including a pre-paid debit card, currency exchange, cryptocurrency exchange, and peer-to-peer payments.",
            "benefitDescription": "Get a free Revolut card when you sign up for Revolut using a friend’s Revolut referral link. From time to time, Revolut may be offering a cash reward for you and the referrer when you complete certain steps.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new Revolut account with valid information",
                "Order your free Revolut card"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/revolut\.com\/r\/[A-Za-z0-9]+$",
                    "format": "https://revolut.com/r/[CODE]",
                    "examples": ["https://revolut.com/r/ABC123"],
                    "invalidMessage": "Invalid Revolut referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Revolut app",
                "Navigate to the 'Profile' section",
                "Select 'Invite Friends' or 'Refer a Friend'",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://revolut.com/r/[YOUR_CODE]",
            "websiteUrl": "https://revolut.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Crypto.com",
            "slug": "crypto-com",
            "category": "finance",
            "icon": "https://logo.clearbit.com/crypto.com",
            "description": "Crypto.com is a cryptocurrency platform that offers trading, investing, staking, and a Visa card for spending crypto.",
            "benefitDescription": "Get $25 USD in CRO when you sign up for Crypto.com using a friend’s Crypto.com referral code and stake for a Ruby card or above. Once you do so, the referrer also gets $25 USD in CRO. If you forgot to enter your friend’s Crypto.com referral code at sign up, you can add it within five days of having your account KYC approved by going to 'App Settings', then 'Referral Code'.",
            "claimSteps": [
                "Click on the referral code or link",
                "Create a new Crypto.com account with valid information",
                "Complete KYC verification",
                "Stake for a Ruby card or above"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6,}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Crypto.com referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Crypto.com app",
                "Navigate to the 'Settings' section",
                "Select 'Referral' or 'Invite Friends'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://crypto.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Chime",
            "slug": "chime",
            "category": "finance",
            "icon": "https://logo.clearbit.com/chime.com",
            "description": "Chime is a neobank offering fee-free financial services through a mobile app, including checking and savings accounts.",
            "benefitDescription": "Get $75 when you open a new Chime Spending Account using a friend’s Chime referral link and receive a payroll direct deposit of $200 or more within the first 45 days of opening your account. The referrer also gets $75 once that occurs.",
            "claimSteps": [
                "Click on the referral link",
                "Create a new Chime Spending Account with valid information",
                "Set up a payroll direct deposit of $200 or more within 45 days of opening your account"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/chime\.com\/r\/[A-Za-z0-9]+$",
                    "format": "https://chime.com/r/[CODE]",
                    "examples": ["https://chime.com/r/ABC123"],
                    "invalidMessage": "Invalid Chime referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Chime app or website",
                "Navigate to the 'Invite Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://chime.com/r/[YOUR_CODE]",
            "websiteUrl": "https://chime.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Mercari",
            "slug": "mercari",
            "category": "shopping",
            "icon": "https://logo.clearbit.com/mercari.com",
            "description": "Mercari is a peer-to-peer marketplace app that allows users to buy and sell new and used items.",
            "benefitDescription": "Sign up for Mercari using a friend’s Mercari referral code and get $10 off your first purchase. Additionally, get $20 once you complete your first $100 in sales. The referrer gets $10 in Mercari credit after you complete your first purchase and $40 in Mercari credit after you earn your first $100.",
            "claimSteps": [
                "Sign up for Mercari using a friend’s referral code",
                "Make your first purchase to receive $10 off",
                "Earn $100 in sales to receive an additional $20 off"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Mercari referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Mercari app",
                "Navigate to the 'Profile' section",
                "Select 'Invite Friends' or 'Refer a Friend'",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://mercari.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Coinbase Earn XLM",
            "slug": "coinbase-earn-xlm",
            "category": "finance",
            "icon": "https://logo.clearbit.com/coinbase.com",
            "description": "Coinbase Earn allows users to earn cryptocurrencies by completing educational tasks and learning about new coins.",
            "benefitDescription": "The referrer gets $10 in XLM (Stellar Lumens) for each friend who follows their Coinbase Earn XLM referral link, accepts their invitation, and completes at least one task on the Coinbase Earn page.",
            "claimSteps": [
                "Click on the Coinbase Earn XLM referral link",
                "Create a new Coinbase account with valid information",
                "Complete at least one task on the Coinbase Earn page"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/coinbase\.com\/earn\/xlm\/invite\/[A-Za-z0-9]+$",
                    "format": "https://coinbase.com/earn/xlm/invite/[CODE]",
                    "examples": ["https://coinbase.com/earn/xlm/invite/ABC123"],
                    "invalidMessage": "Invalid Coinbase Earn XLM referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Coinbase app or website",
                "Navigate to the 'Earn' section",
                "Select 'XLM' and find your referral link",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://coinbase.com/earn/xlm/invite/[YOUR_CODE]",
            "websiteUrl": "https://coinbase.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Acorns",
            "slug": "acorns",
            "category": "finance",
            "icon": "https://logo.clearbit.com/acorns.com",
            "description": "Acorns is a micro-investing app that rounds up users' purchases and invests the spare change into diversified portfolios.",
            "benefitDescription": "Get a $5 welcome bonus deposited in your account when you sign up for Acorns using a friend’s Acorns referral link. The referrer gets a $5 deposit as well if you deposit at least $5 in your account within 30 days of registering and then leave it in your account for 30 days. Additional rewards may be available for referrers who achieve certain referral milestones.",
            "claimSteps": [
                "Click on the Acorns referral link",
                "Create a new Acorns account with valid information",
                "Deposit at least $5 into your account within 30 days",
                "Leave the deposit in your account for 30 days"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/share\.acorns\.com\/[A-Za-z0-9]+$",
                    "format": "https://share.acorns.com/[CODE]",
                    "examples": ["https://share.acorns.com/ABC123"],
                    "invalidMessage": "Invalid Acorns referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Acorns app or website",
                "Navigate to the 'Invite Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://share.acorns.com/[YOUR_CODE]",
            "websiteUrl": "https://acorns.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Wise",
            "slug": "wise",
            "category": "finance",
            "icon": "https://logo.clearbit.com/wise.com",
            "description": "Wise, formerly known as TransferWise, is an international money transfer service that allows users to send money abroad with low fees.",
            "benefitDescription": "Get the fee waived on up to 500 GBP (or its equivalent in another supported currency) of your first transfer when you sign up for Wise using a friend’s Wise referral link. The referrer gets $75 once three of their friends who signed up using their Wise referral link each make an international transfer over $300. Reward amounts may vary in different regions or at different times.",
            "claimSteps": [
                "Click on the Wise referral link",
                "Create a new Wise account with valid information",
                "Make your first international transfer over $300 within 30 days of signing up"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/wise\.com\/invite\/u\/[A-Za-z0-9]+$",
                    "format": "https://wise.com/invite/u/[CODE]",
                    "examples": ["https://wise.com/invite/u/ABC123"],
                    "invalidMessage": "Invalid Wise referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Wise app or website",
                "Navigate to the 'Refer Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://wise.com/invite/u/[YOUR_CODE]",
            "websiteUrl": "https://wise.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Dropbox",
            "slug": "dropbox",
            "category": "technology",
            "icon": "https://logo.clearbit.com/dropbox.com",
            "description": "Dropbox is a cloud storage service that allows users to store and share files and folders online.",
            "benefitDescription": "Get 500 MB of bonus space when you sign up for Dropbox using a friend’s Dropbox referral link, download and sign in to the Dropbox desktop app, and verify your email. For each referral, the referrer gets 500 MB of bonus space if they have a Basic account or 1 GB of space if they have a Plus or Professional account.",
            "claimSteps": [
                "Click on the Dropbox referral link",
                "Create a new Dropbox account with valid information",
                "Download and sign in to the Dropbox desktop app",
                "Verify your email address"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/db\.tt\/[A-Za-z0-9]+$",
                    "format": "https://db.tt/[CODE]",
                    "examples": ["https://db.tt/ABC123"],
                    "invalidMessage": "Invalid Dropbox referral link format"
                }
            },
            "getReferralSteps": [
                "Open the Dropbox app or website",
                "Navigate to the 'Invite Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://db.tt/[YOUR_CODE]",
            "websiteUrl": "https://dropbox.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Instacart",
            "slug": "instacart",
            "category": "food",
            "icon": "https://logo.clearbit.com/instacart.com",
            "description": "Instacart is a grocery delivery and pickup service that allows users to shop for groceries online and have them delivered to their doorstep.",
            "benefitDescription": "Get a $30 credit to use across your first two Instacart orders when you sign up for Instacart using a friend’s Instacart referral code. Once you complete your first order, the referrer gets a $10 Instacart credit.",
            "claimSteps": [
                "Sign up for Instacart using a friend’s referral code",
                "Complete your first two Instacart orders",
                "Receive your $30 credit"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Instacart referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Instacart app or website",
                "Navigate to the 'Refer Friends' section",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://instacart.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "Peloton",
            "slug": "peloton",
            "category": "entertainment",
            "icon": "https://logo.clearbit.com/peloton.com",
            "description": "Peloton offers high-end stationary bicycles and treadmills with integrated screens for interactive fitness classes.",
            "benefitDescription": "Get $100 off accessories when you use a friend’s Peloton referral code upon purchasing a Bike or Tread. The referrer gets $100 off their next Peloton Boutique apparel order.",
            "claimSteps": [
                "Purchase a Peloton Bike or Tread using a friend’s referral code",
                "Enter the referral code during the purchase process",
                "Complete your purchase to receive the $100 discount"
            ],
            "isActive": True,
            "referralType": "code",
            "validation": {
                "code": {
                    "pattern": r"^[A-Z0-9]{6}$",
                    "format": "[CODE]",
                    "examples": ["ABC123"],
                    "invalidMessage": "Invalid Peloton referral code format"
                }
            },
            "getReferralSteps": [
                "Open the Peloton app or website",
                "Navigate to the 'Refer a Friend' section",
                "Copy your unique referral code"
            ],
            "getReferralLink": "",
            "websiteUrl": "https://peloton.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        {
            "name": "SoFi Checking and Savings",
            "slug": "sofi-checking-savings",
            "category": "finance",
            "icon": "https://logo.clearbit.com/sofi.com",
            "description": "SoFi offers financial products including student and personal loans, mortgage refinancing, investing, and banking through SoFi Checking and Savings.",
            "benefitDescription": "Get a $25 welcome bonus when you sign up for SoFi Checking and Savings, formerly known as SoFi Money, using a friend’s SoFi Checking and Savings referral link and fund your new checking account with $50 or more within 14 days. The referrer gets a $75 bonus once you do so. Additionally, get an extra $50–300 bonus when you set up direct deposit and receive at least $1,000 in direct deposits within 25 days. The bonus amount depends on the amount of direct deposits you receive. Bonuses are only eligible for new SoFi customers.",
            "claimSteps": [
                "Click on the SoFi referral link",
                "Create a new SoFi Checking and Savings account with valid information",
                "Fund your account with $50 or more within 14 days",
                "Set up direct deposit and receive at least $1,000 within 25 days"
            ],
            "isActive": True,
            "referralType": "link",
            "validation": {
                "link": {
                    "pattern": r"^https:\/\/www\.sofi\.com\/invite\/money\?gcp=[A-Za-z0-9]+$",
                    "format": "https://www.sofi.com/invite/money?gcp=[CODE]",
                    "examples": ["https://www.sofi.com/invite/money?gcp=ABC123"],
                    "invalidMessage": "Invalid SoFi Checking and Savings referral link format"
                }
            },
            "getReferralSteps": [
                "Open the SoFi app or website",
                "Navigate to the 'Refer Friends' section",
                "Copy your unique referral link"
            ],
            "getReferralLink": "https://www.sofi.com/invite/money?gcp=[YOUR_CODE]",
            "websiteUrl": "https://www.sofi.com",
            "metadata": {
                "lastUpdated": datetime.utcnow(),
                "version": 1
            },
            "referralCodes": [],
        },
        # Add more platforms here following the same structure
    ]

    
    return platforms

def validate_platform(platform: Dict[str, Any]) -> bool:
    """Validate platform document before insertion."""
    required_fields = [
        "name", "category", "icon", "description", "benefitDescription",
        "claimSteps", "referralType", "getReferralSteps", "websiteUrl"
    ]
    
    # Check required fields
    for field in required_fields:
        if field not in platform or not platform[field]:
            print(f"Error: Missing required field '{field}' for platform '{platform.get('name', 'Unknown')}'")
            return False
    
    # Validate URLs
    for url_field in ["icon", "websiteUrl", "getReferralLink"]:
        if url_field in platform and platform[url_field]:
            if not validate_url(platform[url_field]):
                print(f"Error: Invalid URL for {url_field} in platform '{platform['name']}'")
                return False
    
    # Validate arrays have content
    for array_field in ["claimSteps", "getReferralSteps"]:
        if not platform.get(array_field) or not all(len(step) >= 5 for step in platform[array_field]):
            print(f"Error: Invalid {array_field} for platform '{platform['name']}'")
            return False
    
    return True

def seed_platforms():
    """Main function to seed platforms into MongoDB."""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        platform_collection = db.platforms
        
        # Get platform documents
        platforms = create_platform_documents()
        
        # Validate and insert platforms
        for platform in platforms:
            if validate_platform(platform):
                # Use update_one with upsert to avoid duplicates
                result = platform_collection.update_one(
                    {"slug": platform["slug"]},
                    {"$set": platform},
                    upsert=True
                )
                
                if result.upserted_id:
                    print(f"Inserted new platform: {platform['name']}")
                elif result.modified_count:
                    print(f"Updated existing platform: {platform['name']}")
                else:
                    print(f"No changes needed for platform: {platform['name']}")
            else:
                print(f"Skipping invalid platform: {platform['name']}")
        
        print("\nPlatform seeding completed successfully!")
        
    except Exception as e:
        print(f"Error seeding platforms: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    seed_platforms()