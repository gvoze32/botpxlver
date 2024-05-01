# BotPXLVER

## Installation
1. Clone the repository: `git clone https://github.com/gvoze32/botpxlver.git`
2. Navigate to the project directory: `cd botpxlver`
3. Install node dependencies: `npm i`
4. Install py dependencies (optional): `pip install requests beautifulsoup4`

## Usage
V1
1. Run domains fetcher `python3 get_domains.py`
2. Run the script: `node indexv1.js`

V2
1. Run the script: `node indexv2.js`

Follow the prompts to input the referral code, and the number of referrals you want to generate.

The script will then proceed to register users with randomly generated email addresses and refer them using the provided referral code.

## Additional Notes
- Adjust the delay between requests (`setTimeout`) according to your needs and service limitations to avoid rate-limiting or bans.
- Adjust the looping for domain fetcher on line 58 according to your needs (`default: 50`), the bigger the better, the more domains you will get.
