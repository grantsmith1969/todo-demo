/**
 * @generated SignedSource<<76238779f9687ca20b4823cf72f076ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskStatus = "COMPLETED" | "PENDING" | "%future added value";
export type CreateTaskInput = {
  description?: string | null | undefined;
  title: string;
};
export type AppCreateTaskMutation$variables = {
  input: CreateTaskInput;
};
export type AppCreateTaskMutation$data = {
  readonly createTask: {
    readonly createdAt: any;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly status: TaskStatus;
    readonly title: string;
    readonly updatedAt: any | null | undefined;
  };
};
export type AppCreateTaskMutation = {
  response: AppCreateTaskMutation$data;
  variables: AppCreateTaskMutation$variables;
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
    "name": "createTask",
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
    "name": "AppCreateTaskMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppCreateTaskMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "96c35fa39d31d82943b96639e1dd5698",
    "id": null,
    "metadata": {},
    "name": "AppCreateTaskMutation",
    "operationKind": "mutation",
    "text": "mutation AppCreateTaskMutation(\n  $input: CreateTaskInput!\n) {\n  createTask(input: $input) {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "e4b129ec242b75fc90e52796bcca9d89";

export default node;
