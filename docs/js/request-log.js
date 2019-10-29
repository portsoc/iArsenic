'use strict';

const logEl = document.querySelector('#log');

// needs to be kept in sync with script.js
const LOG_URL = 'https://europe-west2-uop-iarsenic-01.cloudfunctions.net/requests';

window.loadRequests = async (googleUser) => {
  try {
    logEl.textContent = 'loading…';

    const idToken = googleUser.getAuthResponse().id_token;

    const response = await fetch(LOG_URL + `?id_token=${encodeURIComponent(idToken)}`);
    if (!response.ok) {
      logEl.textContent = 'error loading data';
      console.error(response);
      return;
    }

    const data = await response.json();

    putLogInPage(data);
  } catch (e) {
    logEl.textContent = 'error processing data';
    console.error('error processing data', e);
  }
};

function putLogInPage(data) {
  // sanitize the data so missing data doesn't throw us off
  for (const item of data) {
    if (!item.inputs) item.inputs = {};
    if (!item.estimate) item.estimate = {};
  }

  logEl.textContent = '';
  logEl.appendChild(makeTable(data, [
    {
      name: 'time',
      f: (x) => (new Date(x.timestamp)).toISOString(),
    },
    {
      name: 'ip (new tab)',
      f: (x) => {
        const el = document.createElement('a');
        el.textContent = x.ip;
        el.href = 'https://tools.keycdn.com/geo?host=' + encodeURIComponent(x.ip);
        el.target = 'iplocation';
        return el;
      },
    },
    {
      name: 'division',
      f: (x) => x.inputs.division,
    },
    {
      name: 'district',
      f: (x) => x.inputs.district,
    },
    {
      name: 'upazila',
      f: (x) => x.inputs.upazila,
    },
    {
      name: 'union',
      f: (x) => x.inputs.union,
    },
    {
      name: 'depth (m)',
      f: (x) => Math.round(x.inputs.depth),
    },
    {
      name: 'colour',
      f: (x) => x.inputs.colour,
    },
    {
      name: 'drinking',
      f: (x) => x.inputs.drinking,
    },
    {
      name: 'flooding',
      f: (x) => x.inputs.flooding,
    },
    {
      name: 'est. severity',
      f: (x) => x.estimate.severity,
    },
    {
      name: 'message',
      f: (x) => {
        const el = document.createElement('abbr');
        el.textContent = x.estimate.message;
        el.title = x.estimate.message;
        return el;
      },
      className: 'message',
    },
  ]));
}

// adapted from sums admin.js

function makeTable(arr, columns) {
  columns = columns.map((col, i) => {
    if (typeof col === 'string') {
      const colName = col;
      col = {
        name: col,
        f: (c) => c[colName],
      };
    }

    col.i = i;

    return col;
  });

  const t = document.createElement('table');
  const htr = t.createTHead().insertRow();
  for (const c of columns) {
    const th = document.createElement('th');
    htr.appendChild(th);
    if (c.nameF) {
      c.nameF(th);
    } else {
      th.textContent = c.name;
    }
    if (c.longName) th.title = c.longName;
  }

  const tbody = t.createTBody();
  for (const item of arr) {
    const tr = tbody.insertRow();
    for (const col of columns) {
      const d = col.f(item);
      const td = tr.insertCell();
      if (d instanceof Node) {
        td.appendChild(d);
      } else {
        td.textContent = d;
      }
      if (col.className) td.className = col.className;
      // add event listeners
      if (d && col.on) {
        for (const key of Object.keys(col.on)) {
          td.addEventListener(key, (e) => col.on[key](e, item));
        }
        if (col.on.click) {
          td.classList.add('clickable');
        }
      }
    }
  }

  if (window.SortTable) window.SortTable.instrumentSortableTable(t, 0);

  return t;
}
