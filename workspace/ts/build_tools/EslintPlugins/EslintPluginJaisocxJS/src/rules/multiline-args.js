// lib/rules/multiline-args.js
export const MultilineArgs = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce multiline arguments in function definitions and calls",
      category: "Stylistic Issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [] // no options for this rule
  },
  create: function (context) {
    const indentRuleConfig = context.settings?.["indent"] || [2, 2]; // Default to 2 spaces
    const eslintConfigIdentPrefixSizeForOneLevel = Array.isArray(indentRuleConfig) ? indentRuleConfig[1] : 2;

    // Helper function to enforce that each argument is on a new line.
    function enforceNewLines(node, args) {
      args.forEach((arg, index) => {
        const previousToken = context.getSourceCode().getTokenBefore(arg);
        
        if (previousToken.loc.end.line === arg.loc.start.line) {
          context.report({
            node: arg,
            message: "Each argument should be on a new line.",
            fix(fixer) {
              return fixer.insertTextBefore(arg, "\n" + " ".repeat(node.loc.start.column + eslintConfigIdentPrefixSizeForOneLevel));
            }
          });
        }
      });
    }

    return {
      // Check for function declarations
      FunctionDeclaration(node) {
        if (node.params.length > 1) {
          enforceNewLines(node, node.params);
        }
      },

      // Check for function expressions (like arrow functions)
      FunctionExpression(node) {
        if (node.params.length > 1) {
          enforceNewLines(node, node.params);
        }
      },

      // Check for method definitions within classes
      MethodDefinition(node) {
        if (node.value.params.length > 1) {
          enforceNewLines(node, node.value.params);
        }
      },

      // Check for function calls
      CallExpression(node) {
        if (node.arguments.length > 1) {
          enforceNewLines(node, node.arguments);
        }
      },

      // Check for JSON-like object literals
      ObjectExpression(node) {
        node.properties.forEach((property, index) => {
          if (index > 0) {
            const prevProperty = node.properties[index - 1];
            if (prevProperty.loc.end.line === property.loc.start.line) {
              context.report({
                node: property,
                message: "Each property in an object should be on a new line.",
                fix(fixer) {
                  return fixer.insertTextBefore(property, "\n" + " ".repeat(node.loc.start.column + 2));
                }
              });
            }
          }
        });
      }
    };
  }
};
