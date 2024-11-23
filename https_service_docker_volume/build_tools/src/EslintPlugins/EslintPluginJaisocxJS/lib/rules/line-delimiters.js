// eslint-plugin-custom/rules/line-delimiters.js
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce line delimiters around blocks and method definitions",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [] // no options
  },
  create(context) {
    const TSC_OUTPUT_INDENTATION_SIZE = 4; // Matches tsc indent rule fixed value, tsc cannot be configured
    const BEFORE = 1;
    const BEFORE_AND_AFTER = 2;
    const linesRequired = 1;
    const sourceCode = context.getSourceCode();
    
    // here we get eslintrc.js config rules
    const indentRuleConfig = context.settings?.["indent"] || [2, 2]; // Default to 2 spaces
    const eslintConfigIdentPrefixSizeForOneLevel = Array.isArray(indentRuleConfig) ? indentRuleConfig[1] : 2;
    
    function contextReport(node, mustLinesSet, tscOutputWhitespacesNumber, range, mode) {
      const identationLevel = (tscOutputWhitespacesNumber / eslintConfigIdentPrefixSizeForOneLevel);
      const mustWhitespacesNumber = (identationLevel * eslintConfigIdentPrefixSizeForOneLevel);
      //const lines = linesRequired + 1;
      context.report({
        node,
        message: `Expected ${linesRequired} empty line${linesRequired > 1 ? 's' : ''} ${mode} block.`,
        fix(fixer) {
          const linesReplacement = "\n".repeat(mustLinesSet) + " ".repeat(mustWhitespacesNumber);
          return fixer.replaceTextRange(range, linesReplacement);
        }
      });
    }
    
    // Helper to check if there’s exactly one line space before and after a node
    function checkBlockSpacing(node, mode) {
      const lines = linesRequired + 1; // for dev purposes as arg, 1 means 1 empty line between, however when the next block starts on a new line, there is already 1 \n
      const before = sourceCode.getTokenBefore(node);
      const after = sourceCode.getTokenAfter(node);

      const isFirstInParent =
        ( node.parent && node.parent.body && ( node.parent.body.length > 0 ) && ( node.parent.body[0] === node ) );
      const isLastInParent =
        ( node.parent && node.parent.body && ( node.parent.body.length > 0 ) && ( node.parent.body[(node.parent.body.length - 1)] === node ) );

      const lineDiff = {
        before: 0,
        after: 0,
      };

      let mustLinesSet = 0;

      if ( isFirstInParent === true ) {
        //const closingParen = sourceCode.getTokenBefore(sourceCode.getFirstToken(node.parent.body));
        //const openingBrace = sourceCode.getTokenAfter(closingParen);
        //console.log("HERE: ", node.parent);
        //return;
        lineDiff.before = node.loc.start.line - node.parent.loc.start.line;
        mustLinesSet = linesRequired + 1;
      } else {
        lineDiff.before = node.loc.start.line - before.loc.end.line;
        mustLinesSet = linesRequired + 1;
      }

      if ( isLastInParent === true ) {
        lineDiff.after = node.parent.loc.end.line - node.loc.end.line;
        mustLinesSet = linesRequired + 1;

      } else {
        lineDiff.after = after.loc.start.line - node.loc.end.line;
        mustLinesSet = linesRequired + 1;
      }

      if (lineDiff.before !== 0 && lineDiff.before !== mustLinesSet) {
        const whiteSpacesNumber = node.loc.start.column;
        let rangeStart = 0;

        if ( isFirstInParent === true ) {
          rangeStart = node.parent.start;
        } else {
          rangeStart = before.end;
        }

        contextReport(
          node,
          mustLinesSet,
          whiteSpacesNumber,
          [rangeStart, node.start],
          "before"
        );
      }
      
      if ((mode === BEFORE_AND_AFTER) && (lineDiff.after !== mustLinesSet)) {
        let whiteSpacesNumber = 0;
        let rangeEnd = 0;

        if ( isLastInParent === true ) {
          whiteSpacesNumber = node.parent.loc.end.column;
          rangeEnd = node.parent.end;
        } else {
          whiteSpacesNumber = after.loc.start.column;
          rangeEnd = after.start;
        }

        contextReport(
          node,
          mustLinesSet,
          whiteSpacesNumber,
          [node.end, rangeEnd],
          "after"
        );
      }
    }

    return {
      // One line spacing for control statements
      MethodDefinition(node) {
        checkBlockSpacing(node, BEFORE);
      },
      IfStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      WhileStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      ForStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      ForInStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      ForOfStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      SwitchStatement(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      FunctionDeclaration(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      FunctionExpression(node) {
        checkBlockSpacing(node, BEFORE_AND_AFTER);
      },
      ArrowFunctionExpression(node) {
        if (node.parent && node.parent.type === 'VariableDeclarator') {
          checkBlockSpacing(node, BEFORE_AND_AFTER);
        }
      },
      Program() {
        const allComments = sourceCode.getAllComments();

        allComments.forEach((comment) => {
          checkBlockSpacing(comment, BEFORE);
        });
      },
      ReturnStatement(node) {
        checkBlockSpacing(node, BEFORE);
      },
    };
  }
};


