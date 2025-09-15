/**
 * @generated SignedSource<<e9804f47429a2835e4b6b08472a9c6d4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TaskStatus = "COMPLETED" | "PENDING" | "%future added value";
export type AppTaskSubscription$variables = Record<PropertyKey, never>;
export type AppTaskSubscription$data = {
  readonly onTaskChanged: {
    readonly createdAt: any;
    readonly description: string | null | undefined;
    readonly id: string;
    readonly status: TaskStatus;
    readonly title: string;
    readonly updatedAt: any | null | undefined;
  };
};
export type AppTaskSubscription = {
  response: AppTaskSubscription$data;
  variables: AppTaskSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TaskItem",
    "kind": "LinkedField",
    "name": "onTaskChanged",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppTaskSubscription",
    "selections": (v0/*: any*/),
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppTaskSubscription",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "6712d8cc9e6aed5d2311d4f89e93240b",
    "id": null,
    "metadata": {},
    "name": "AppTaskSubscription",
    "operationKind": "subscription",
    "text": "subscription AppTaskSubscription {\n  onTaskChanged {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d25b1966184766e9d07d619b504cf17";

export default node;
