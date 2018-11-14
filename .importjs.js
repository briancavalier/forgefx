module.exports = {
  importStatementFormatter: ({ importStatement }) => importStatement.replace(/;$/, '')
}
