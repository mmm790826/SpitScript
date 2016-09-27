(function (window) {
  window.ss = window.ss || {};

  var wordTypes = {
    'ARRAY': ['lot', 'lotta'],
    'ARRAYEND': ['stuff'],
    'ASSIGNMENT': ['be', 'is'],
    'BLOCK': ['then', 'piece'],
    'BLOCKEND': ['okay'],
    'BLOCKCOMMENT': ['listen'],
    'BLOCKCOMMENTEND': ['right'],
    'COMMA': ['and'],
    'COMPEQ': ['like'],
    'COMPGREATER': ['more', 'mo'],
    'COMPGREATEREQ': ['over'],
    'COMPLESS': ['less'],
    'COMPLESSEQ': ['under'],
    'COMPNOT': ['ain\'t', 'isn\'t'],
    'CONDITIONELSE': ['disagree', 'disrespect'],
    'CONDITIONIF': ['sayin', 'saying'],
    'DECLARATION': ['big', 'lil', 'those', 'who'],
    'DELETION': ['rid', 'ridda'],
    'FUNCTION': ['business'],
    'IGNORED': ['cool', 'fool', 'got', 'he', 'her', 'hey', 'him', 'his', 'hot', 'i', 'in', 'me', 'my', 'of', 'our', 'say', 'says', 'see', 'she', 'talk', 'talks', 'than', 'that', 'the', 'their', 'they', 'think', 'thinks', 'up', 'us', 'we', 'ya', 'yall', 'yo', 'you', 'your'],
    'LINECOMMENT': ['cuz', 'so'],
    'LOGICAND': ['also'],
    'LOGICNOT': ['not'],
    'LOGICOR': ['or'],
    'LOOPFOR': ['rollin', 'rolling'],
    'LOOPWHILE': ['always', 'keep'],
    'MATHMINUS': ['smaller'],
    'MATHPLUS': ['bigger'],
    'NEW': ['get', 'make'],
    'PAREN': ['this', 'these'],
    'PARENEND': ['well'],
    'REFINE': ['with'],
    'REFINEEND': ['yeah'],
    'REFINEDOT': ['get', 'gotta'],
    'RETURN': ['rep', 'represent', 'show'],
    'SEMICOLON': ['uh'],
    'THIS': ['crib', 'here'],
    'VALNULL': ['nah'],
    'VALONE': ['one'],
    'VALTWO': ['two'],
    'VALUNDEFINED': ['unreal'],
    'VALZERO': ['nothin', 'nothing']
  };

  var childrenTypes = {
    'ARRAY': 'ARRAYEND',
    'BLOCK': 'BLOCKEND',
    'BLOCKCOMMENT': 'BLOCKCOMMENTEND',
    'LINECOMMENT': 'NEWLINE',
    'PAREN': 'PARENEND',
    'REFINE': 'REFINEEND'
  };

  // Turn the normalized object wordTypes into a dictionary
  //  where the keys are the words in the vocabulary and the
  //  values are the types. This provides faster access by
  //  word.
  var words = (function (types) {
    var wordsDict = {};

    for (var key in types) {
      if (!types.hasOwnProperty(key)) return;

      for (var index in types[key]) {
        if (!types[key].hasOwnProperty(index)) return;

        wordsDict[types[key][index]] = key;
      }
    }

    return wordsDict;
  })(wordTypes);

  window.ss.parse = function(tokens) {
    /*
    Heavily inspired by @thejameskyle: https://github.com/thejameskyle/the-super-tiny-compiler/blob/master/super-tiny-compiler.js
    */
    var current = 0;

    function walk() {
      // Types are: NEWLINE, QUOTE, NUMBER, TOKEN, WORD
      var token = tokens[current];

      if (!token) {
        throw new Error('Parser had a problem. A token was undefined. Previous token: [' + tokens[current - 1].type + ' ' + tokens[current-1].value + ']');
      }

      if (token.type === 'NEWLINE') {
        current++;
        return createNode('NEWLINE');
      }

      if (token.type === 'QUOTE') {
        current++;
        return createNode('QUOTE', token.value);
      }

      if (token.type === 'NUMBER') {
        current++;
        return createNode('NUMBER', token.value);
      }

      if (token.type == 'TOKEN') {
        current++;
        return createNode('TOKEN', token.value);
      }

      if (token.type == 'WORD') {
        // If the word is not in our vocabulary, it must be
        //  a reference to a variable.
        if (!words.hasOwnProperty(token.value)) {
          current++;
          return createNode('NAME', token.value);
        }

        var type = words[token.value];

        // If this is an ignored word, skip it
        if (type === 'IGNORED') {
          current++;
          return walk();
        }

        // If the word is in our vocabulary but is not a type
        //  that can have children, return it as-is.
        if (!childrenTypes.hasOwnProperty(type)) {
          current++;
          return createNode(type, token.value);
        }

        // If the word is a type that can have children,
        //  recurse over them until the end token is reached.
        var node = createNode(type, token.value, true);
        var beginToken = token.value;
        var endTokenType = childrenTypes[type];
        current++;

        var innerToken;
        while (type !== endTokenType) {
          innerToken = walk();
          node.children.push(innerToken);
          token = innerToken;

          if (!token) {
            throw new Error('Failed to discover end token of type [' + endTokenType + '] to match token [' + words[beginToken] + ' ' + beginToken + '].');
          }

          type = words[token.value];
        }

        return node;
      }

      throw new Error('Parser had a problem. Unrecognized token: ', token);
    }

    var ast = {
      type: 'PROGRAM',
      body: []
    };

    while (current < tokens.length) {
      ast.body.push(walk());
    }

    return ast;
  };

  function createNode(type, value, hasChildren) {
    var node = {
      'type': type,
      'value': value
    };

    if (hasChildren) node.children = [];

    return node;
  }
})(window);
