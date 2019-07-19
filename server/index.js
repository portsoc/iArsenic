/*
 * adapted from google's cloud functions examples, in particular the datastore one
 */

'use strict';

const { Datastore } = require('@google-cloud/datastore');
const GoogleAuth = require('simple-google-openid');

const CLIENT_ID = '486607360747-fcdn62e6mh2t2gl0tmarvdae5r756png.apps.googleusercontent.com';
const AUTHORIZED_USERS = [
  'jacek.kopecky@port.ac.uk',
  'mo.hoque@port.ac.uk',
];

const datastore = new Datastore();
const auth = GoogleAuth(CLIENT_ID);

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
    const token = req.query.id_token;
    if (!token) {
      res.status(401).send('you need to include id_token in the URL query');
      return;
    }

    const user = await auth.verifyToken(token);
    if (!user || AUTHORIZED_USERS.indexOf(user.emails[0].value) === -1) {
      res.sendStatus(403);
      return;
    }

    const query = datastore.createQuery(KIND).order('timestamp');
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
    inputs: req.body.value.inputs,
    estimate: req.body.value.estimate,
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
