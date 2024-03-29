// import fetch from 'node-fetch';

// const apiKey = '4c30dba4-63bb-4eba-9294-6d41fca91d52';
// const resellerEmail = 'angelamongstangels@gmail.com';
// const email = 'nexigen0@gmail.com';
// const password = 'U20me2022@';
// const confirmPassword = 'U20me2022@';
// const subdomain = 'examqpl'; // Updated subdomain with at least 4 characters
// const briefcaseCapacity = 'Unlimited';
// const backupCapacity = 'Unlimited';
// const isSharing = false;
// const hasWebApps = false;
// const firstName = 'Dev';
// const lastName = 'Sam';
// const productType = 'Backup';

// const requestBody = `<?xml version="1.0" encoding="utf-8"?>
// <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
//   <soap12:Body>
//     <AddUserWithLimit xmlns="http://www.livedrive.com/">
//       <apiKey>${apiKey}</apiKey>
//       <resellerEmail>${resellerEmail}</resellerEmail>
//       <email>${email}</email>
//       <password>${password}</password>
//       <confirmPassword>${confirmPassword}</confirmPassword>
//       <subdomain>${subdomain}</subdomain>
//       <BriefcaseCapacity>${briefcaseCapacity}</BriefcaseCapacity>
//       <BackupCapacity>${backupCapacity}</BackupCapacity>
//       <isSharing>${isSharing}</isSharing>
//       <hasWebApps>${hasWebApps}</hasWebApps>
//       <firstName>${firstName}</firstName>
//       <lastName>${lastName}</lastName>
//       <ProductType>${productType}</ProductType>
//     </AddUserWithLimit>
//   </soap12:Body>
// </soap12:Envelope>`;

// // Define the request options
// const requestOptions = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/soap+xml; charset=utf-8',
//     'Content-Length': requestBody.length.toString(),
//   },
//   body: requestBody,
// };

// // Define the URL
// const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

// // Send the request
// fetch(url, requestOptions)
//   .then(response => response.text())
//   .then(data => {
//     // Handle the response data
//     console.log('Response:', data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('Error:', error);
//   });

// // import fetch from 'node-fetch';

// // const updateClientLimit = async (userID, clientLimit) => {
// //   const apiKey = '4c30dba4-63bb-4eba-9294-6d41fca91d52';
// //   const resellerEmail = 'angelamongstangels@gmail.com';

// //   const requestBody = `<?xml version="1.0" encoding="utf-8"?>
// // <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
// //   <soap12:Body>
// //     <UpdateUserClientLimit xmlns="http://www.livedrive.com/">
// //       <apiKey>${apiKey}</apiKey>
// //       <resellerEmail>${resellerEmail}</resellerEmail>
// //       <userID>${userID}</userID>
// //       <clientLimit>${clientLimit}</clientLimit>
// //     </UpdateUserClientLimit>
// //   </soap12:Body>
// // </soap12:Envelope>`;

// //   const requestOptions = {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/soap+xml; charset=utf-8',
// //     },
// //     body: requestBody,
// //   };

// //   const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

// //   try {
// //     const response = await fetch(url, requestOptions);
// //     const xmlResponse = await response.text();

// //     // Directly log the XML response from the server
// //     console.log(xmlResponse);

// //     return xmlResponse;
// //   } catch (error) {
// //     console.error('Error updating user client limit:', error);
// //     throw error;
// //   }
// // };

// // // Example usage
// // updateClientLimit('8623428', 10)
// //   .then(response => console.log(response))
// //   .catch(error => console.error(error));



// // Additional request for adding a user
// // You can add your additional request here

// // import fetch from 'node-fetch';
// // import xml2js from 'xml2js'; // Ensure you have xml2js installed for converting XML to JSON

// // // Replace these with actual values
// // const apiKey = '4c30dba4-63bb-4eba-9294-6d41fca91d52';
// // const resellerEmail = 'angelamongstangels@gmail.com';
// // const subdomain = 'lemikan';

// // const requestBody = `<?xml version="1.0" encoding="utf-8"?>
// // <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
// //   <soap12:Body>
// //     <SubdomainValid xmlns="http://www.livedrive.com/">
// //       <apiKey>${apiKey}</apiKey>
// //       <resellerEmail>${resellerEmail}</resellerEmail>
// //       <subdomain>${subdomain}</subdomain>
// //     </SubdomainValid>
// //   </soap12:Body>
// // </soap12:Envelope>`;

// // const requestOptions = {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/soap+xml; charset=utf-8',
// //     },
// //     body: requestBody,
// // };

// // const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

// // fetch(url, requestOptions)
// //     .then(response => response.text())
// //     .then(str => {
// //         // Convert XML response to JSON
// //         xml2js.parseString(str, (err, result) => {
// //             if (err) {
// //                 throw err;
// //             }
// //             const my = result['soap:Envelope']['soap:Body'][0]['SubdomainValidResponse'][0]['SubdomainValidResult'][0]

// //             console.log(JSON.stringify(my, null, 4));
// //             if (my === "alid"){
// //               console.log('yes');
// //             }
// //         });
// //     })
// //     .catch(error => {
// //         console.error('Error:', error);
// //     });


// Import necessary modules
import { getCloudUser } from './utils/cloudBalance.js'; // Update with the correct path
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the test function
async function testGetCloudUser() {
    try {
        const userId = '65ce6572d4e74f3bc89fa418'; // Update with the userId you want to test
        const result = await getCloudUser(userId);
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the test function
testGetCloudUser();
