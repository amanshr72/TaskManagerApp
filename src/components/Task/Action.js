import React from 'react';
import axios from 'axios';

const basicAuth = 'Basic QWRtaW46MQ==';
const headers = { Authorization: basicAuth, 'Content-Type': 'application/json' };

const markImportant = async (taskId) => {
    try {
        const response = await axios.post('https://task.market99.org.in/public/api/mark-important', { id: taskId }, { headers });
        console.log(response.data);
    } catch (error) {
        console.error('Error marking important:', error);
    }
};

const unmarkImportant = async (taskId) => {
    try {
        const response = await axios.post('https://task.market99.org.in/public/api/unmark-important', { id: taskId }, { headers });
        console.log(response.data);
    } catch (error) {
        console.error('Error unmarking important:', error);
    }
};

export { markImportant, unmarkImportant };
