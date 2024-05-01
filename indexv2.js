const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const random = require('random-name');
const randomize = require('randomatic');
const moment = require('moment');
const readline = require('readline-sync');
const fs = require('fs');
const request = require('request');
const cheerioAdv = require('cheerio-advanced-selectors');

const randstr = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const functionGetLink = (email, domain) => new Promise((resolve, reject) => {
    fetch(`https://generator.email/${domain}/${email}`, {
            method: "get",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                cookie: `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randstr(3)}; surl=${domain}%2F${email}`,
                "upgrade-insecure-requests": 1,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
            }
        })
        .then(res => res.text())
        .then(text => {
            let $ = cheerio.load(text);
            let src = $('#email-table > div.e7m.row.list-group-item > div.e7m.col-md-12.ma1 > div.e7m.mess_bodiyy.plain > p').text();
            let number = src.replace(/\D/g, "");
            resolve(number);
        })        
        .catch(err => reject(err));
});

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': null
};

(async() => {
    var referralCode = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Reff Code : ');
    var jumlah = readline.question(`[ ${moment().format("HH:mm:ss")} ] ` + 'Jumlah Reff : ');

    const url = "https://generator.email/";
    const domains = [];

    for (let i = 0; i < 50; i++) {
        console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Mengambil domain ke-${i+1}...`);
        await new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(body);
                    cheerioAdv.wrap($);
                    const divList = $('div.tt-dataset-typeahead_as3gsdr');
                    const domainElements = divList.find('p');
                    domainElements.each((index, element) => {
                        const domain = $(element).text();
                        if (!domains.includes(domain)) {
                            domains.push(domain);
                        }
                    });
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Total domain: ${domains.length}`);

    const otpRequestURL = 'https://api.pixelverse.xyz/api/otp/request';
    const otpVerificationURL = 'https://api.pixelverse.xyz/api/auth/otp';
    const referralURL = 'https://api.pixelverse.xyz/api/referrals/set-referer/'+referralCode;

    async function makeRequest(url, payload) {
        try {
            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error:', error.response.data);
            throw error.response.data;
        }
    }

    async function registerUser(email, domain, otpPayload, referralPayload, i) {
        try {
            const otpResponse = await makeRequest(otpRequestURL, otpPayload);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Mencoba mendaftar menggunakan email => ${email}`);

            let otp;
            let startTime = new Date().getTime();
            do {
                otp = await functionGetLink(email.split('@')[0], domain);
                console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Menunggu kode verifikasi...`);
            } while (!otp && (new Date().getTime() - startTime) < 30000);
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Kode verifikasi: ${otp}`);

            const accessToken = await makeRequest(otpVerificationURL, { email, otpCode: otp });
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Verifikasi kode sukses...`);

            headers.Authorization = accessToken.tokens.access;

            const referralResponse = await axios.put(referralURL, referralPayload, { headers });
            console.log(`[ ${moment().format("HH:mm:ss")} ] ` + `Sukses reff ke ${i}\n`);
        } catch (error) {
            console.error('[Error]:', error);
        }
    }

    try {
        for (let i = 1; i < jumlah; i++) {
            const randomIndex = Math.floor(Math.random() * domains.length);
            const domain = domains[randomIndex];

            var name = random.first()
            var lastname = random.last()
            var uname = `${name}${lastname}${randomize('0', 2)}`
            var email = uname + `@` + domain;

            const otpPayload = {
                email: email,
            };

            const referralPayload = {
                referralCode: referralCode,
            };

            await registerUser(email, domain, otpPayload, referralPayload, i);

            await new Promise(resolve => setTimeout(resolve, (Math.random() * 10000) + 10000));      
        }
    } catch (error) {
        console.error('[Error]:', error);
    }
})();
