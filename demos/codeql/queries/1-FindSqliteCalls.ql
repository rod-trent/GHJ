/**
 * @name Step 1: Find every node:sqlite query call
 * @description Code is data. Find every place we hand a SQL string to node:sqlite,
 *              and flag the ones that are not a constant string.
 * @kind problem
 * @problem.severity recommendation
 * @id octo/demo/sqlite-calls
 */

import javascript

from API::CallNode call
where
  call =
    API::moduleImport("node:sqlite")
        .getMember("DatabaseSync")
        .getInstance()
        .getMember(["prepare", "exec"])
        .getACall() and
  not call.getArgument(0).asExpr() instanceof ConstantString
select call, "SQL passed to node:sqlite is built dynamically."
