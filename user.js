import fetch from 'node-fetch';
import { parseString } from 'xml2js';

const apiKey = '4c30dba4-63bb-4eba-9294-6d41fca91d52';
const resellerEmail = 'angelamongstangels@gmail.com';
const page = 1;

const requestBody = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <GetUsers xmlns="http://www.livedrive.com/">
      <apiKey>${apiKey}</apiKey>
      <resellerEmail>${resellerEmail}</resellerEmail>
      <page>${page}</page>
    </GetUsers>
  </soap12:Body>
</soap12:Envelope>`;

const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/soap+xml; charset=utf-8',
      'Content-Length': requestBody.length.toString(),
    },
    body: requestBody,
};
  
const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

fetch(url, requestOptions)
    .then(response => response.text())
    .then(xmlData => {
        // Parse XML to JSON
        parseString(xmlData, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
            } else {
                // Convert XML result to JSON
                const jsonData = JSON.stringify(result);
                console.log('JSON Response:', jsonData);
            }
        });
    })
    .catch(error =>{
        console.error('Error:', error);
    });
