((exports) => {
  'use strict';

  exports.instrumentSortableTable = (table, presort, direction) => {
    table.classList.add('sortable');
    if (table.tHead) {
      const ths = table.tHead.rows[0].children;
      for (let i=0; i<ths.length; i+=1) {
        ths[i].addEventListener('click', (e) => {
          // prevent selecting text
          e.stopPropagation();
          e.preventDefault();
          sort(table, i);
        });
      }
    }

    if (presort != null) sort(table, presort, direction === 'desc');
  };

  function sort(table, n, reverse = false) {
    const tbody = table.tBodies[0];

    if (table.tHead && table.tHead.rows[0] && table.tHead.rows[0].children[n]) {
      const th = table.tHead.rows[0].children[n];
      if (th.dataset.activeSort) reverse = th.dataset.activeSort === 'asc';

      // clean up old active sort heading(s)
      for (const el of table.querySelectorAll('[data-active-sort]')) {
        delete el.dataset.activeSort;
      }

      th.dataset.activeSort = reverse ? 'desc' : 'asc';
    }

    // sort all the children of tbody by their nth child (starting from 0)
    // in a try block in case there aren't enough elements around and array lookups fail
    try {
      // going through rows from the back, find last biggest row until the current one, put it after the current one
      for (let i=tbody.children.length-1; i>0; i-=1) {
        let max = tbody.children[i];
        let maxText = max.children[n].textContent.trim();
        let maxNum = Number.parseFloat(maxText);
        for (let j=i-1; j>=0; j-=1) {
          const text = tbody.children[j].children[n].textContent.trim();
          const num = Number.parseFloat(text);

          // must use reverse in the conditions to keep search stability
          let greater = reverse ? text < maxText : text > maxText;
          if (!Number.isNaN(maxNum) && !(Number.isNaN(num)) && maxNum !== num) {
            greater = reverse ? num < maxNum : num > maxNum;
          }

          if (greater) {
            max = tbody.children[j];
            maxText = text;
            maxNum = num;
          }
        }
        if (max !== tbody.children[i]) {
          tbody.insertBefore(max, tbody.children[i+1]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
})(typeof exports === 'undefined'? this.SortTable={}: exports); // eslint-disable-line no-undef
