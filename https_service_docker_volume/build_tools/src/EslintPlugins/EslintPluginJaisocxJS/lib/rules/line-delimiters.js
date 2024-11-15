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
    const BEFORE = 1;
    const BEFORE_AND_AFTER = 2;
    const linesRequired = 1;
    const sourceCode = context.getSourceCode();
    
    function contextReport(node, whiteSpacesNumber, range, mode) {
      const lines = linesRequired + 1;
      context.report({
        node,
        message: `Expected ${linesRequired} empty line${linesRequired > 1 ? 's' : ''} ${mode} block.`,
        fix(fixer) {
          const linesReplacement = "\n".repeat(lines) + " ".repeat(whiteSpacesNumber);
          return fixer.replaceTextRange(range, linesReplacement);
        }
      });
    }
    
    // Helper to check if there’s exactly one line space before and after a node
    function checkBlockSpacing(node, mode) {
      const lines = linesRequired + 1; // for dev purposes as arg, 1 means 1 empty line between, however when the next block starts on a new line, there is already 1 \n
      const before = sourceCode.getTokenBefore(node);
      const after = sourceCode.getTokenAfter(node);
      const beforeLineDiff = node.loc.start.line - before.loc.end.line;
      const afterLineDiff = after.loc.start.line - node.loc.end.line;

      if (beforeLineDiff !== lines) {
        const whiteSpacesNumber = node.loc.start.column;
        contextReport(
          node,
          whiteSpacesNumber,
          [before.end, node.start],
          "before"
        );
      }
      
      if ((mode === BEFORE_AND_AFTER) && (afterLineDiff !== lines)) {
        const whiteSpacesNumber = after.loc.start.column;
        contextReport(
          node,
          whiteSpacesNumber,
          [node.end, after.start],
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
    };
  }
};


