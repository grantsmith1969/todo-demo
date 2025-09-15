/**
 * @generated SignedSource<<cab68cb1087dff122a873ef96b1427d9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskStatus = "COMPLETED" | "PENDING" | "%future added value";
export type UpdateTaskStatusInput = {
  id: string;
  status: TaskStatus;
};
export type AppUpdateTaskStatusMutation$variables = {
  input: UpdateTaskStatusInput;
};
export type AppUpdateTaskStatusMutation$data = {
  readonly updateTaskStatus: {
    readonly createdAt: any;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly status: TaskStatus;
    readonly title: string;
    readonly updatedAt: any | null | undefined;
  };
};
export type AppUpdateTaskStatusMutation = {
  response: AppUpdateTaskStatusMutation$data;
  variables: AppUpdateTaskStatusMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "TaskItem",
    "kind": "LinkedField",
    "name": "updateTaskStatus",
    "plural": false,
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AppUpdateTaskStatusMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppUpdateTaskStatusMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "dc1f75f164ecd5ad22fc9092f96583e1",
    "id": null,
    "metadata": {},
    "name": "AppUpdateTaskStatusMutation",
    "operationKind": "mutation",
    "text": "mutation AppUpdateTaskStatusMutation(\n  $input: UpdateTaskStatusInput!\n) {\n  updateTaskStatus(input: $input) {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d56cbc37a61b4a63e6203d393e20737";

export default node;
