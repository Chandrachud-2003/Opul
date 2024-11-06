from typing import List, Dict, Any
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, HttpUrl, validator
from enum import Enum
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enums (matching your schema)
class ReferralType(str, Enum):
    CODE = 'code'
    LINK = 'link'

class PlatformCategory(str, Enum):
    FINANCE = 'finance'
    TRAVEL = 'travel'
    FOOD = 'food'
    SHOPPING = 'shopping'
    ENTERTAINMENT = 'entertainment'
    TECHNOLOGY = 'technology'
    OTHER = 'other'

# Pydantic models for validation
class ValidationRules(BaseModel):
    minLength: int | None = None
    maxLength: int | None = None
    pattern: str | None = None
    format: str | None = None
    case: str = 'any'
    allowedCharacters: str | None = None
    examples: List[str] = []
    invalidMessage: str

class Validation(BaseModel):
    code: ValidationRules | None = None
    link: ValidationRules | None = None

class Platform(BaseModel):
    name: str
    category: PlatformCategory
    icon: HttpUrl
    description: str
    benefitDescription: str
    claimSteps: List[str]
    isActive: bool = True
    referralType: ReferralType
    validation: Validation
    getReferralSteps: List[str]
    getReferralLink: HttpUrl | None = None

    @validator('claimSteps')
    def validate_claim_steps(cls, v):
        if not v or not all(len(step) >= 5 for step in v):
            raise ValueError("Each claim step must be at least 5 characters long")
        return v

# Platform configurations
PLATFORMS: List[Dict[str, Any]] = [
    {
        "name": "Robinhood",
        "category": PlatformCategory.FINANCE,
        "icon": "https://cdn.robinhood.com/assets/robinhood/shared/robinhood-logo.png",
        "description": "Robinhood is a commission-free stock trading & investing app. Start building your portfolio with any amount of money.",
        "benefitDescription": "Get one share of a stock worth between $3 and $225 when you sign up using a referral link and your application is approved.",
        "claimSteps": [
            "Click the referral link to download the Robinhood app",
            "Create a new account with your personal information",
            "Wait for your application to be approved",
            "Once approved, you'll receive your free stock within 7 days"
        ],
        "referralType": ReferralType.LINK,
        "validation": {
            "link": {
                "minLength": 30,
                "maxLength": 100,
                "pattern": r"^https?:\/\/share\.robinhood\.com\/[a-zA-Z0-9]+$",
                "format": "http://share.robinhood.com/[USERNAME]",
                "case": "any",
                "examples": ["http://share.robinhood.com/johnd123"],
                "invalidMessage": "Invalid Robinhood referral link format. Should be like: http://share.robinhood.com/username"
            }
        },
        "getReferralSteps": [
            "Open the Robinhood app",
            "Tap on the Account icon",
            "Select 'Earn stock'",
            "Choose 'Invite contacts' or 'Share link'"
        ],
        "getReferralLink": "https://robinhood.com/us/en/about/referral"
    }
    # Add more platforms here following the same structure
]

async def seed_platforms():
    """Seed the database with platform data."""
    # MongoDB connection (update with your connection string)
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.your_database_name
    
    try:
        # Validate and prepare platforms
        validated_platforms = []
        for platform_data in PLATFORMS:
            try:
                # Validate using Pydantic
                platform = Platform(**platform_data)
                
                # Convert to dict and add additional fields
                platform_dict = platform.dict()
                platform_dict.update({
                    "slug": platform_data["name"].lower().replace(" ", "-"),
                    "metadata": {
                        "lastUpdated": datetime.utcnow(),
                        "version": 1
                    },
                    "referralCodes": []
                })
                validated_platforms.append(platform_dict)
                
            except Exception as e:
                logger.error(f"Validation failed for platform {platform_data.get('name')}: {str(e)}")
                continue

        if not validated_platforms:
            logger.error("No valid platforms to seed")
            return

        # Clear existing platforms (optional - comment out if you want to keep existing data)
        await db.platforms.delete_many({})

        # Insert platforms
        result = await db.platforms.insert_many(validated_platforms)
        logger.info(f"Successfully seeded {len(result.inserted_ids)} platforms")

        # Create indexes
        await db.platforms.create_index("slug", unique=True)
        await db.platforms.create_index("category")
        await db.platforms.create_index([("name", "text"), ("description", "text")])
        await db.platforms.create_index("referralCodes")
        
        logger.info("Successfully created indexes")

    except Exception as e:
        logger.error(f"Error seeding platforms: {str(e)}")
    finally:
        client.close()

def main():
    """Main function to run the seeder."""
    logger.info("Starting platform seeder...")
    asyncio.run(seed_platforms())
    logger.info("Seeder completed")

if __name__ == "__main__":
    main()