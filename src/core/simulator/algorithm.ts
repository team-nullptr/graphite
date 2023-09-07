import { Graph, Vertex } from "./graph";
import { Step } from "./step";

export type AlgorithmParamType = "vertex"; // | "string" | etc.

export interface AlgorithmParam {
  type: AlgorithmParamType;
  required?: boolean;
}

export type AlgorithmParams<T> = { [key in keyof T]: AlgorithmParam };

export interface Algorithm<T extends object> {
  name: string;
  description: string;
  tags: string[];
  stepGenerator: (graph: Graph, params: T) => Step[];
  /** `params` are only used to generate appropriate input  fields */
  params: AlgorithmParams<T>;
}

export const validateAlgorithmParams = <T extends object>(
  paramsDefinition: Algorithm<T>["params"],
  valueToBeValidated: Record<string, string>
) => {
  return Object.entries(paramsDefinition)
    .filter(([, paramType]) => {
      return (paramType as AlgorithmParam).required;
    })
    .every(([paramKey]) => {
      const paramValue = valueToBeValidated[paramKey];
      return paramValue && paramValue.trim() !== "";
    });
};
