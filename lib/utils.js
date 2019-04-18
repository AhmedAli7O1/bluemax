"use strict";


function isMergeableObject(value) {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value) {
  return !!value && typeof value === 'object';
}

function isSpecial(value) {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === '[object RegExp]' || stringValue === '[object Date]';
}

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function clone(value) {
  return isMergeableObject(value) ? merge(emptyTarget(value), value) : value;
}

function arrayMerge(target, source) {
  return target.concat(source).map(function(element) {
    return clone(element);
  });
}

function mergeObject(target, source) {
  const destination = {};
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function(key) {
      destination[key] = clone(target[key]);
    });
  }

  Object.keys(source).forEach(function(key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = clone(source[key]);
    }
    else {
      destination[key] = merge(target[key], source[key]);
    }
  });

  return destination;
}

function merge(target, source) {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return clone(source);
  }
  else if (sourceIsArray) {
    return arrayMerge(target, source);
  }
  else {
    return mergeObject(target, source);
  }
}

function set (obj, dottedPath, value) {
  const pathParts = handleObjectPath(dottedPath);
  const lastPathPart = pathParts[pathParts.length - 1];

  let objRef = obj;

  // loop over path parts except the last part to ensure the path is exist
  for (let i = 0; i < pathParts.length - 1; i++) {
    const pathPart = pathParts[i];

    // if path doesn't exist create it
    if (!objRef[pathPart]) {
      objRef[pathPart] = {};
    }

    // change the reference to the nested object
    objRef = objRef[pathPart];
  }

  assignValue(objRef, lastPathPart, value);

  return obj;
}

function get (obj, dottedPath) {
  const pathParts = handleObjectPath(dottedPath);

  let nested = obj;

  for (let i = 0; i < pathParts.length; i++) {
    if (!nested[pathParts[i]]) {
      return null;
    }

    nested = nested[pathParts[i]];
  }

  return nested;
}

function handleObjectPath (objPath) {
  let pathParts;

  if (typeof objPath === "string") {
    pathParts = objPath.split(".");
  }
  else if (objPath && objPath.length) {
    pathParts = objPath;
  }
  else {
    throw new Error("path should be either dotted string or array of strings");
  }

  return pathParts;
}

function assignValue (objRef, key, value) {
  if (Array.isArray(objRef[key]) && Array.isArray(value)) {
    objRef[key].push(...value);
  }
  else if (isObject(objRef[key]) && isObject(value)) {
    Object.assign(objRef[key], value);
  }
  else {
    objRef[key] = value;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object";
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

module.exports = {
  isMergeableObject,
  isNonNullObject,
  isSpecial,
  merge,
  set,
  get,
  handleObjectPath,
  assignValue,
  isObject,
  capitalize
};