"use strict";


const PATH_REGEXP = new RegExp(/(\\.)|(?:\:(\w+)(?:\(((?:\\.|[^\\()])+)\))?|\(((?:\\.|[^\\()])+)\))([+*?])?/g);
const DEFAULT_DELIMITER = '/';

const routes = [];


function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
  var whitelist = (options && options.whitelist) || undefined;
  var pathEscaped = false;
  var res;

  while ((res = PATH_REGEXP.exec(str)) !== null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      pathEscaped = true;
      continue
    }

    var prev = '';
    var name = res[2];
    var capture = res[3];
    var group = res[4];
    var modifier = res[5];

    if (!pathEscaped && path.length) {
      var k = path.length - 1;
      var c = path[k];
      var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

      if (matches) {
        prev = c;
        path = path.slice(0, k)
      }
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
      pathEscaped = false
    }

    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var pattern = capture || group;
    var delimiter = prev || defaultDelimiter;

    tokens.push({
      name: name || key++,
      prefix: prev,
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: pattern
        ? escapeGroup(pattern)
        : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
    })
  }

  // Push any remaining characters.
  if (path || index < str.length) {
    tokens.push(path + str.substr(index))
  }

  return tokens
}

function tokensToRegExp (tokens, keys, options) {
  options = options || {};

  var strict = options.strict;
  var start = options.start !== false;
  var end = options.end !== false;
  var delimiter = options.delimiter || DEFAULT_DELIMITER;
  var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
  var route = start ? '^' : '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var capture = token.repeat
        ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
        : token.pattern;

      if (keys) keys.push(token);

      if (token.optional) {
        if (!token.prefix) {
          route += '(' + capture + ')?'
        } else {
          route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?'
        }
      } else {
        route += escapeString(token.prefix) + '(' + capture + ')'
      }
    }
  }

  if (end) {
    if (!strict) route += '(?:' + escapeString(delimiter) + ')?';

    route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === 'string'
      ? endToken[endToken.length - 1] === delimiter
      : endToken === undefined;

    if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?';
    if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')'
  }

  return new RegExp(route, flags(options))
}

function escapeGroup (group) {
  return group.replace(/([=!:$/()])/g, '\\$1')
}

function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

function match (method, urlPath) {
  let routeInfo;

  for (let i = 0; i < routes.length; i++) {

    if (routes[i].method === method) {
      const result = routes[i].rgx.exec(urlPath);
      if (result) {
        routeInfo = routes[i];
        routeInfo.params = {};
        routes[i].keys.forEach((key, index) => {
          routeInfo.params[key.name] = result[ index + 1 ];
        });

        break;
      }
    }
  }

  return routeInfo;
}

// function register (routeGroups = {}) {
//   for (const routeGroupName in routeGroups) {
//     if (routeGroups.hasOwnProperty(routeGroupName)) {
//       routeGroups[routeGroupName].forEach(routeInfo => {
//         const keys = [];
//         const rgx = tokensToRegExp(parse(routeInfo.path), keys);
//
//         routes.push({
//           rgx,
//           keys,
//           handler: routeInfo.handler,
//           method: routeInfo.method
//         });
//       });
//     }
//   }
// }

function register (method, path, handler) {
  const keys = [];
  const rgx = tokensToRegExp(parse(path), keys);

  routes.push({
    rgx,
    keys,
    handler,
    method
  });
}


module.exports = {
  register,
  match,
  routes
};
