import crypto from 'crypto';

let secretKey;

export const initializeChatController = (key) => {
    if (!key) {
        throw new Error('Secret key is required for initializing the chat controller.');
    }
    secretKey = key;
};

export const sendErrorMessage = (ws, errorMessage) => {
    try {
        ws.send(JSON.stringify({ error: errorMessage }));
        ws.close();
    } catch (error) {
        console.error('Error sending error message:', error);
    }
};

export const sendWelcomeMessage = (ws, username) => {
    try {
        ws.send(JSON.stringify({ status: `Welcome, ${username}! You are now connected to the chat.` }));
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
};

export const decryptMessage = (encryptedMessage) => {
    try {
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(secretKey, 'hex');
        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decryptedMessage = decipher.update(encryptedMessage, 'base64', 'utf-8');
        decryptedMessage += decipher.final('utf-8');
        return JSON.parse(decryptedMessage);
    } catch (error) {
        console.error('Error decrypting message:', error);
        return null;
    }
};

export const encryptMessage = (message) => {
    try {
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(secretKey, 'hex');
        const iv = Buffer.alloc(16, 0);

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encryptedMessage = cipher.update(JSON.stringify(message), 'utf-8', 'base64');
        encryptedMessage += cipher.final('base64');
        return encryptedMessage;
    } catch (error) {
        console.error('Error encrypting message:', error);
        return null;
    }
};

export const getCurrentTime = () => {
    try {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); 
        const day = now.getUTCDate().toString().padStart(2, '0');
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const seconds = now.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = now.getUTCMilliseconds().toString().padStart(3, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    } catch (error) {
        console.error('Error getting current timestamp:', error);
        return '';
    }
};

