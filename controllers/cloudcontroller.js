import fetch from 'node-fetch';
import asyncHandler from 'express-async-handler';
import userModel from '../model/user.model.js';
import isSubdomainValid from '../utils/cloudSubdomain.js';
import UserCloud from '../model/clouduser.model.js';
import xml2js from 'xml2js';
import mongoose from 'mongoose';

const apiKey = process.env.LIVEDRIVE_KEY;
const resellerEmail = process.env.RESELLER_EMAIL;
const productType = 'Backup';
const briefcaseCapacity = 'Unlimited';
const backupCapacity = 'Unlimited';
const isSharing = false;
const hasWebApps = false;

export const createCloud = asyncHandler(async (req, res) => {
    const { userId, email, firstName, lastName, subdomain, password, confirmPassword , boughtPlan} = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already exists' });
        }

        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        if (password !== confirmPassword) {
            return res.status(401).send({ error: 'Passwords do not match!' });
        }
        const isDomainValid = await isSubdomainValid(subdomain);
        
        // Check if the subdomain is valid
        if (isDomainValid !== 'valid') {
            let errorMessage = 'Internal Server Error';
            switch (isDomainValid.toLowerCase()) {
                case 'invalidresellerid':
                    errorMessage = 'Invalid reseller ID';
                    break;
                case 'inuse':
                    errorMessage = 'Subdomain is already in use';
                    break;
                case 'containsreservedoroffensiveword':
                    errorMessage = 'Subdomain contains reserved or offensive word';
                    break;
                case 'containslessthan4chars':
                    errorMessage = 'Subdomain contains less than 4 characters';
                    break;
                case 'containsmorethen50chars':
                    errorMessage = 'Subdomain contains more than 50 characters';
                    break;
                case 'invalidsubdomain':
                    errorMessage = 'Invalid subdomain';
                    break;
                default:
                    errorMessage = 'Internal Server Error';
                    break;
            }
            return res.status(400).send({ error: errorMessage });
        }

        const requestBody = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
            <AddUserWithLimit xmlns="http://www.livedrive.com/">
            <apiKey>${apiKey}</apiKey>
            <resellerEmail>${resellerEmail}</resellerEmail>
            <email>${email}</email>
            <password>${password}</password>
            <confirmPassword>${confirmPassword}</confirmPassword>
            <subdomain>${subdomain}</subdomain>
            <BriefcaseCapacity>${briefcaseCapacity}</BriefcaseCapacity>
            <BackupCapacity>${backupCapacity}</BackupCapacity>
            <isSharing>${isSharing}</isSharing>
            <hasWebApps>${hasWebApps}</hasWebApps>
            <firstName>${firstName}</firstName>
            <lastName>${lastName}</lastName>
            <ProductType>${productType}</ProductType>
            </AddUserWithLimit>
        </soap12:Body>
        </soap12:Envelope>`;

        // Define request options
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/soap+xml; charset=utf-8',
                'Content-Length': requestBody.length.toString(),
            },
            body: requestBody,
        };

        // Define URL
        const url = 'https://resellersportal.livedrive.com/ResellersServiceV2/ResellerAPI.asmx';

        // Send SOAP request
        const response = await fetch(url, requestOptions);
        const xmlResponse = await response.text();
        console.log(xmlResponse);


        // Convert XML response to JSON
        const parsedResponse = await xml2js.parseStringPromise(xmlResponse);
        
        // Check if there's an error in the response
        if (parsedResponse['soap:Envelope']['soap:Body'][0]['AddUserWithLimitResponse'][0]['AddUserWithLimitResult'][0]['Header'][0]['Code'][0] === 'UserNameError') {
            const errorDescription = parsedResponse['soap:Envelope']['soap:Body'][0]['AddUserWithLimitResponse'][0]['AddUserWithLimitResult'][0]['Header'][0]['Description'][0];
            return res.status(400).send({ error: errorDescription });
        }

        const cloudId = parsedResponse['soap:Envelope']['soap:Body'][0]['AddUserWithLimitResponse'][0]['AddUserWithLimitResult'][0]['ID'][0];
        user.activePlan = boughtPlan;
        const cloud = new UserCloud({
            owner: userId,
            cloudId,
            userName: email,
            firstName,
            lastName,
            email,
            subdomain, 
            activePlan: boughtPlan
        });
        await cloud.save();

        // Send success response
        res.status(200).send({ message: 'Cloud created successfully', responseData: parsedResponse });

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Internal Server Error';
        if (error.code === 11000 && error.keyPattern.email === 1) {
            errorMessage = 'Email already exists';
        } else if (error.message === 'Subdomain contains less than 4 characters') {
            errorMessage = 'Subdomain contains less than 4 characters';
        }
        res.status(500).send({ error: errorMessage });
    }
});


export const getCloudUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.user_id;
        const user = await UserCloud.findOne({ owner: userId });

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const cloudId = user.cloudId;   
        const requestBody = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
            <GetUser xmlns="http://www.livedrive.com/">
            <apiKey>${apiKey}</apiKey>
            <resellerEmail>${resellerEmail}</resellerEmail>
            <userID>${cloudId}</userID>
            </GetUser>
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

        // Send SOAP request
        const response = await fetch(url, requestOptions);
        const xmlResponse = await response.text();

        const parsedResponse = await xml2js.parseStringPromise(xmlResponse);

        res.status(200).json(parsedResponse);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export const upgradeCloud = asyncHandler(async (req, res) => {
    const userId = req.params.user_id;
    const { newPlan } = req.body;
    

    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }

        if (!userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Validate newPlan
        if (!newPlan) {
            return res.status(400).json({ error: 'New plan not provided' });
        }

        const user = await UserCloud.findOne({ owner: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.activePlan = newPlan;
        await user.save();

        res.status(200).json(user);

    } catch (error) {
        console.error('Error upgrading user\'s plan:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid request data' });
        } else if (error.name === 'MongoError') {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
