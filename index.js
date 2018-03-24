// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const http = require('http');
const host = 'paleobiodb.org';
exports.paleoWebhook = (req, res) => {
    console.log(req);
    let taxa = req.body.result.parameters['taxa'];
    callPaleoApi(taxa).then((output) => {
        // Return the results of the paleo API to Dialogflow
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
};
function callPaleoApi(taxa) {
    return new Promise((resolve, reject) => {
        // Create the path for the HTTP request to get the data
        let path = '/data1.2/taxa/single.json' + '?name=' + encodeURIComponent(taxa) + '&show=attr';
        console.log('API Request: ' + host + path);
        // Make the HTTP request to get the data
        http.get({ host: host, path: path }, (res) => {
            let body = ''; // var to store the response chunks
            res.on('data', (d) => { body += d; }); // store each response chunk
            res.on('end', () => {
                // After all the data has been received parse the JSON for desired data
                let response = JSON.parse(body);
                console.log(response);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}