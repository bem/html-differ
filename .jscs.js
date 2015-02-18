module.exports = {
    excludeFiles: [
        'node_modules/**',
        'coverage/**'
    ],
    requireSpaceAfterKeywords: ['if', 'else', 'for', 'while', 'do', 'switch', 'return', 'try', 'catch'],
    requireSpaceBeforeBlockStatements: true,
    requireSpacesInConditionalExpression: true,
    requireSpacesInFunction: {
        beforeOpeningCurlyBrace: true
    },
    requireSpacesInAnonymousFunctionExpression: {
        beforeOpeningRoundBrace: true
    },
    disallowSpacesInNamedFunctionExpression: {
        beforeOpeningRoundBrace: true
    },
    requireBlocksOnNewline: 1,
    disallowPaddingNewlinesInBlocks: true,
    disallowSpacesInsideArrayBrackets: 'nested',
    disallowSpacesInsideParentheses: true,
    requireSpacesInsideObjectBrackets: 'all',
    disallowQuotedKeysInObjects: 'allButReserved',
    disallowSpaceAfterObjectKeys: true,
    requireCommaBeforeLineBreak: true,
    requireOperatorBeforeLineBreak: true,
    disallowSpaceAfterPrefixUnaryOperators: true,
    disallowSpaceBeforePostfixUnaryOperators: true,
    requireSpaceBeforeBinaryOperators: true,
    requireSpaceAfterBinaryOperators: true,
    requireCamelCaseOrUpperCaseIdentifiers: true,
    disallowKeywords: ['with'],
    disallowMultipleLineStrings: true,
    disallowMultipleLineBreaks: true,
    validateLineBreaks: 'LF',
    validateQuoteMarks: {
        mark: '\'',
        escape: true
    },
    disallowMixedSpacesAndTabs: true,
    disallowTrailingWhitespace: true,
    disallowKeywordsOnNewLine: ['else', 'catch'],
    requireLineFeedAtFileEnd: true,
    maximumLineLength: 120,
    requireCapitalizedConstructors: true,
    safeContextKeyword: ['_this'],
    disallowYodaConditions: true,
    validateJSDoc: {
        checkParamNames: true,
        checkRedundantParams: true,
        requireParamTypes: true
    },
    requireSpaceAfterLineComment: true,
    disallowNewlineBeforeBlockStatements: true
};
