import mongoose from 'mongoose';
import UserCloud from '../model/clouduser.model.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import path from 'path';
import xml2js from 'xml2js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const apiKey = process.env.LIVEDRIVE_KEY;
const resellerEmail = process.env.RESELLER_EMAIL;



export const getCloudUser = async (userId) => {
    try {
        const user = await UserCloud.findOne({ owner: mongoose.Types.ObjectId(userId) });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error; 
    }
};

export const liveDrivePlan = async (plan) => {
    try {
        const cloudId = plan.cloudId;   
        console.log(cloudId);
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

        const DisplayStatus = parsedResponse['soap:Envelope']['soap:Body'][0]['GetUserResponse'][0]['GetUserResult'][0]['DisplayStatus'][0];

        let BackupSpaceUsed = parsedResponse['soap:Envelope']['soap:Body'][0]['GetUserResponse'][0]['GetUserResult'][0]['BackupSpaceUsed'][0];
        BackupSpaceUsed = BackupSpaceUsed.replace(' B', '');
        return BackupSpaceUsed;
    } catch (error) {
        console.error("error fetching user Cloud:", error);
        throw error;    
    }
}


export const Cloudstatus = async (plan) => {
    try {
        const liveDrive = await liveDrivePlan(plan);
        const userPlan = plan.activePlan; 
        if (liveDrive < userPlan) {
            console.log('All good');
        } else if (liveDrive > userPlan) {
            console.log('Your cloud storage is full, please upgrade your plan to save more files');
        } else {
            console.log('All good');
        }

    } catch (error) {
        console.error("Error comparing cloud status:", error);
        throw error;    
    }
}
