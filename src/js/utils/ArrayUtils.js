import { PRNG } from "./PRNG";

export function a_transpose(arr) {
  let tmp = [];
  let col = [];
  for (let i = 0; i < arr[0].length; i++) {
    col = [];
    for (let j = 0; j < arr.length; j++) {
      col.push(arr[j][i]);
    }
    tmp.push(col);
  }
  return tmp;
}

export function a_columns(arr, w) {
  return a_transpose(a_rows(arr, w));
}

export function a_rows(arr, w) {
  let tmp = [];
  let row = [];
  for (let i = 0; i <= arr.length; i++) {
    if (i % w == 0) {
      if (i > 0) tmp.push(row);
      row = [];
    }
    row.push(arr[i]);
  }
  return tmp;
}

export function a_min(array, property = null) {
  if (property != null) {
    return Math.min.apply(
      null,
      array.map((v) => {
        return v[property];
      })
    );
  }
  return Math.min.apply(null, array);
}

export function a_max(array, property = null) {
  if (property != null) {
    return Math.max.apply(
      null,
      array.map((v) => {
        return v[property];
      })
    );
  }
  return Math.max.apply(null, array);
}

export function a_equals(a, b) {
  if (a.length != b.length) return false;
  let result = true;
  a.forEach((v, i) => {
    if (v !== b[i]) result = true;
  });
  return result;
}

//get a row of values
export function a_single_row(arr, w, id, value = null) {
  let cols = a_columns(arr, w);
  let y = ~~(id / w);
  return cols[y].flat();
}
export function a_adjacency(arr, w, id, connexity = 8) {
  let tmp = [];
  let rows = a_rows(arr, w);
  let h = rows.length;
  let x = id % w;
  let y = ~~(id / w);

  if (y - 1 >= 0) tmp.push((y - 1) * w + x);
  if (x + 1 < w) tmp.push(y * w + (x + 1));
  if (y + 1 < h) tmp.push((y + 1) * w + x);
  if (x - 1 >= 0) tmp.push(y * w + (x - 1));

  if (connexity == 8) {
    if (x - 1 >= 0 && y - 1 >= 0) tmp.push((y - 1) * w + (x - 1));
    if (x + 1 < w && y - 1 >= 0) tmp.push((y - 1) * w + (x + 1));
    if (x + 1 < w && y + 1 < h) tmp.push((y + 1) * w + (x + 1));
    if (x - 1 >= 0 && y + 1 < h) tmp.push((y + 1) * w + (x - 1));
  }
  return tmp;
}

export function a_getvaluesFromRadius(arr, w, id, radius = 1) {
  let tmp = [];
  let rows = a_rows(arr, w);
  let h = rows.length;
  let x = id % w;
  let y = ~~(id / w);
  let r2 = radius * radius;
  for (let xx = 0; xx < w; xx++) {
    for (let yy = 0; yy < h; yy++) {
      let d = Math.pow(x - xx, 2) + Math.pow(y - yy, 2);
      if (d <= r2) {
        tmp.push(yy * w + xx);
      }
    }
  }
  tmp.sort((a, b) => {
    return a - b;
  });
  return tmp;
}

export function a_render(ctx, arr, w, options = { stroke: true }) {
  if (options.fill !== undefined) {
    options.fill.forEach((opt) => {
      ctx.fillStyle = opt[0];
      opt[1].forEach((id) => {
        let x = id % w;
        let y = ~~(id / w);
        ctx.fillRect(x, y, 1, 1);
      });
    });
  }
  if (options.stroke === true) {
    let rows = a_rows(arr, w);
    let h = rows.length;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        ctx.strokeRect(x, y, 1, 1);
      }
    }
  }
}

export function a_render_grid(ctx, arr, w) {
  let rows = a_rows(arr, w);
  let h = rows.length;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      ctx.strokeRect(x, y, 1, 1);
    }
  }
}

export function a_swap(arr, a, b) {
  let t = arr[a];
  arr[a] = arr[b];
  arr[b] = t;
}

export function a_getSparse(arr, emptyToken = -1) {
  return arr.map((v) => {
    return v == emptyToken ? 0 : 1;
  });
}

export function a_isEmpty(arr, emptyToken = -1) {
  return (
    arr.filter((v) => {
      return v != emptyToken;
    }).length == 0
  );
}

function recusrivesSearch(arr, w, connexity, id, ids, values) {
  if (ids.indexOf(id) != -1) return;
  ids.push(id);
  values.push(arr[id]);
  let adj = a_adjacency(arr, w, id, connexity);
  adj.forEach((nid) => {
    //if the new id (arr[nid]) has the same value as the previous id (arr[id])
    if (arr[nid] == arr[id]) {
      recusrivesSearch(arr, w, connexity, nid, ids, values);
    }
  });
}

function connectedComponents(arr, w, connexity = 8) {
  let firstItem = 0;
  while (arr[firstItem] == -1) {
    firstItem++;
  }
  if (firstItem >= arr.length) return null;
  let ids = [];
  let values = [];
  recusrivesSearch(arr, w, connexity, firstItem, ids, values);
  return { ids, values };
}

export function a_getComponents(array, w, connexity = 8, emptyToken = -1) {
  let arr = array.concat();
  let tmp = array.concat();
  let max = tmp.length;
  let components = [];
  while (max-- || isEmpty(tmp)) {
    tmp = connectedComponents(arr, w, connexity);
    if (tmp == null) break;
    tmp.ids.forEach((v) => {
      arr[v] = emptyToken;
    });
    components.push(tmp);
  }
  return components;
}

export function a_isolateValue(array, value, emptyToken = -1) {
  let arr = array.concat();
  array.forEach((v, i) => {
    if (v != value) arr[i] = emptyToken;
  });
  return arr;
}
export function a_isolateIds(array, ids, emptyToken = -1) {
  let arr = array.concat();
  array.forEach((v, i) => {
    if (ids.indexOf(i) != -1) {
      return;
    }
    arr[i] = emptyToken;
  });
  return arr;
}

export function a_setValues(arr, ids, value) {
  ids.forEach((id) => {
    arr[id] = value;
  });
}

export function a_randomize(arr) {
  arr.sort((a, b) => {
    return PRNG.random() - 0.5;
  });
}

export function a_shuffle(array, w, strength = 0.5) {
  let interversionCount = ~~(array.length * strength);
  for (let i = 0; i < interversionCount; i++) {
    let id = ~~(PRNG.random() * array.length);
    let adj = a_adjacency(array, w, id, 4);
    let nid = adj[~~(PRNG.random() * adj.length)];
    a_swap(array, id, nid);
  }
  return array;
}

export function a_getValues(arr, value) {
  let tmp = [];
  arr.forEach((v, i) => {
    if (v === value) {
      tmp.push(i);
    }
  });
  return tmp;
}
