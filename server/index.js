/*
 * adapted from google's cloud functions examples, in particular the datastore one
 */

'use strict';

const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

// returns whether the request should be allowed to proceed
function cors(req, res) {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return false;
  }

  return true;
}

function checkMethods(req, res, methods = 'GET') {
  if (!Array.isArray(methods)) methods = [ methods ];
  if (methods.indexOf(req.method) === -1) {
    res.sendStatus(405);
    return false;
  }

  return true;
}

const KIND = 'Request';

async function listLoggedRequests(req, res) {
  try {
    const query = await datastore.createQuery(KIND);
    const [results] = await datastore.runQuery(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

async function logRequest(req, res) {
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      res.status(400).send('cannot parse body as JSON');
      return;
    }
  }
  if (!req.body.value) {
    res.status(400).send('need data');
    return;
  }

  // we should validate the incoming data
  const data = {
    timestamp: Date.now(),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    inputs: req.body.value,
  };

  try {
    const entity = {
      key: datastore.key([KIND]),
      data,
    };

    await datastore.save(entity);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

exports.requests = async (req, res) => {
  if (!cors(req, res)) return;
  if (!checkMethods(req, res, ['GET', 'POST'])) return;

  switch (req.method) {
    case 'GET': listLoggedRequests(req, res); break;
    case 'POST': logRequest(req, res); break;
  }
};
