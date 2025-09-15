/**
 * @generated SignedSource<<24cd0c231379d731e2fcf4cb18812154>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskStatus = "COMPLETED" | "PENDING" | "%future added value";
export type AppTasksQuery$variables = Record<PropertyKey, never>;
export type AppTasksQuery$data = {
  readonly getAllTasks: ReadonlyArray<{
    readonly createdAt: any;
    readonly description: string | null | undefined;
    readonly id: number;
    readonly status: TaskStatus;
    readonly title: string;
    readonly updatedAt: any | null | undefined;
  }>;
};
export type AppTasksQuery = {
  response: AppTasksQuery$data;
  variables: AppTasksQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TaskItem",
    "kind": "LinkedField",
    "name": "getAllTasks",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppTasksQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppTasksQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "f480a902a6dd46831b4e55913e750693",
    "id": null,
    "metadata": {},
    "name": "AppTasksQuery",
    "operationKind": "query",
    "text": "query AppTasksQuery {\n  getAllTasks {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "04eb6407c9231a7cf00c88aeafdb08b0";

export default node;
