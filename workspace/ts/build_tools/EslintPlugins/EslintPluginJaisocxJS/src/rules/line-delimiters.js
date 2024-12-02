// eslint-plugin-custom/rules/line-delimiters.js
export const LineDelimiters = {
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
    const ESLINT_CONFIG_INDENTATION_SIZE = 2; // Matches tsc indent rule fixed value, tsc cannot be configured
    const BEFORE = 1;
    const BEFORE_AND_AFTER = 2;
    const linesRequired = 1;
    const sourceCode = context.getSourceCode();

    // here we get eslintrc.js config rules
    const indentRuleConfig = (context && context.settings && context.settings.indent) || [ESLINT_CONFIG_INDENTATION_SIZE, ESLINT_CONFIG_INDENTATION_SIZE]; // Default to ESLINT_CONFIG_INDENTATION_SIZE spaces
    const eslintConfigIdentPrefixSizeForOneLevel = Array.isArray(indentRuleConfig) ? indentRuleConfig[1] : ESLINT_CONFIG_INDENTATION_SIZE;

    function contextReport(
      node,
      mustLinesSet,
      tscOutputWhitespacesNumber,
      range,
      mode
    ) {
      const identationLevel = (tscOutputWhitespacesNumber / eslintConfigIdentPrefixSizeForOneLevel);
      const mustWhitespacesNumber = (identationLevel * eslintConfigIdentPrefixSizeForOneLevel);

      context.report({
        node,
        message: `Expected ${linesRequired} empty line${linesRequired > 1 ? "s" : ""} ${mode} block.`,
        fix(fixer) {
          const linesReplacement = "\n".repeat(mustLinesSet) + " ".repeat(mustWhitespacesNumber);

          return fixer.replaceTextRange(
            range,
            linesReplacement
          );
        }

      });
    }

    function checkBlockSpacing(
      node,
      mode
    ) {
      const lines = linesRequired + 1; // for dev purposes as arg, 1 means 1 empty line between, however when the next block starts on a new line, there is already 1 \n
      const before = sourceCode.getTokenBefore(node);
      if (!before) {
        return;
      }

      const searchKey = "Punctuator";
      const blockStart = "{";
      const blockEnd = "}";
      // const typeBefore = before.type.substring(0, searchKey.length);
      const typeBefore = before ? before.type : "";

      let whiteSpacesNumber = 0;

      let isFirstInParent = (node.parent && node.parent.body && (node.parent.body.length > 0) && (node.parent.body[0] === node));

      if ((typeBefore === searchKey) && (before.value === blockStart)) {
        isFirstInParent = true;
      }

      const lineDiff = {
        before: 0,
        after: 0
      };

      let mustLinesSet = 0;

      if (isFirstInParent === false) {
        lineDiff.before = node.loc.start.line - before.loc.end.line;
        mustLinesSet = linesRequired + 1;
      }

      if (!isFirstInParent && lineDiff.before !== 0 && lineDiff.before !== mustLinesSet) {
        let rangeStart = 0;

        rangeStart = before.end;
        whiteSpacesNumber = node.loc.start.column;

        if ( rangeStart && node.start ) {
          contextReport(
            node,
            mustLinesSet,
            whiteSpacesNumber,
            [rangeStart, node.start],
            "before"
          );
        }
      }

      const after = sourceCode.getTokenAfter(node);

      if (!after) {
        return;
      }

      const typeAfter = after.type;
      let isLastInParent = (node.parent && node.parent.body && (node.parent.body.length > 0) && (node.parent.body[(node.parent.body.length - 1)] === node));

      if ((typeAfter === searchKey) && (after.value === blockEnd)) {
        isLastInParent = true;
      }

      lineDiff.after = after.loc.start.line - node.loc.end.line;
      mustLinesSet = linesRequired + 1;

      if (!isLastInParent && (mode === BEFORE_AND_AFTER) && (lineDiff.after !== mustLinesSet)) {
        let whiteSpacesNumber = 0;
        let rangeEnd = 0;

        whiteSpacesNumber = after.loc.start.column;
        rangeEnd = after.start;

        if ( node.end && rangeEnd ) {
          contextReport(
            node,
            mustLinesSet,
            whiteSpacesNumber,
            [node.end, rangeEnd],
            "after"
          );
        }
      }
    }

    return {
      // One line spacing for control statements
      MethodDefinition(node) {
        checkBlockSpacing(
          node,
          BEFORE
        );
      },

      IfStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      WhileStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      ForStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      ForInStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      ForOfStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      SwitchStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      FunctionDeclaration(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      FunctionExpression(node) {
        checkBlockSpacing(
          node,
          BEFORE_AND_AFTER
        );
      },

      ArrowFunctionExpression(node) {
        if (node.parent && node.parent.type === "VariableDeclarator") {
          checkBlockSpacing(
            node,
            BEFORE_AND_AFTER
          );
        }
      },

      Program() {
        const allComments = sourceCode.getAllComments();

        allComments.forEach((comment) => {
          checkBlockSpacing(
            comment,
            BEFORE
          );
        });
      },

      ReturnStatement(node) {
        checkBlockSpacing(
          node,
          BEFORE
        );
      }

    };
  }

};
