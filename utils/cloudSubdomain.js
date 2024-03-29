import fetch from 'node-fetch';
import xml2js from 'xml2js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.LIVEDRIVE_KEY;
const resellerEmail = process.env.RESELLER_EMAIL;

const isSubdomainValid = async (subdomain) => {
    const requestBody = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <SubdomainValid xmlns="http://www.livedrive.com/">
      <apiKey>${apiKey}</apiKey>
      <resellerEmail>${resellerEmail}</resellerEmail>
      <subdomain>${subdomain}</subdomain>
    </SubdomainValid>
  </soap12:Body>
</soap12:Envelope>`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8',
        },
        body: requestBody,
    };

    const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

    try {
        const response = await fetch(url, requestOptions);
        const textResponse = await response.text();
        return new Promise((resolve, reject) => {
            xml2js.parseString(textResponse, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    const subdomainValidResult = result['soap:Envelope']['soap:Body'][0]['SubdomainValidResponse'][0]['SubdomainValidResult'][0];
                    const lowerCaseResult = subdomainValidResult.toLowerCase();
                    resolve(lowerCaseResult);
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default isSubdomainValid;

