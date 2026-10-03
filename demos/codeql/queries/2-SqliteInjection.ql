/**
 * @name Step 2: SQL injection through node:sqlite
 * @description Track untrusted data (sources) through the program to a
 *              node:sqlite query (sinks). Only report real paths.
 * @kind path-problem
 * @problem.severity error
 * @security-severity 8.8
 * @precision high
 * @id octo/demo/node-sqlite-injection
 * @tags security
 *       external/cwe/cwe-089
 */

import javascript

module SqliteInjectionConfig implements DataFlow::ConfigSig {
  // Sources: anything an attacker controls (HTTP params, headers, body, ...).
  predicate isSource(DataFlow::Node source) { source instanceof RemoteFlowSource }

  // Sinks: the SQL string argument of DatabaseSync#prepare / #exec.
  predicate isSink(DataFlow::Node sink) {
    sink =
      API::moduleImport("node:sqlite")
          .getMember("DatabaseSync")
          .getInstance()
          .getMember(["prepare", "exec"])
          .getACall()
          .getArgument(0)
  }
}

module SqliteInjectionFlow = TaintTracking::Global<SqliteInjectionConfig>;

import SqliteInjectionFlow::PathGraph

from SqliteInjectionFlow::PathNode source, SqliteInjectionFlow::PathNode sink
where SqliteInjectionFlow::flowPath(source, sink)
select sink.getNode(), source, sink, "This SQL query depends on a $@.", source.getNode(),
  "user-provided value"
