// eslint-plugin-custom/rules/class-statement-cleanup.js
export const ClassStatementCleanup = {
  meta: {
    type: "layout",
    docs: {
      description: "Cleanup import and export statements before class declaraton",
      category: "Stylistic Issues",
      recommended: false
    },
    fixable: "code",
    schema: [] // no options
  },
  create(context) {    
    function contextReport(node) {
      context.report({
        node,
        message: `Expected class declaration start from the file position 1`,
        fix(fixer) {
          return fixer.replaceTextRange([0, node.start], "");
        }
      });
    }
    
    // Helper to check if there’s exactly one line space before and after a node
    function checkClassStart(node) {
      if (node.start > 1) {
        contextReport(node);
      }
    }

    return {
      ClassDeclaration(node) {
        checkClassStart(node);
      }
    };
  }
};


