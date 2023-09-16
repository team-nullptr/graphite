import { Graph } from "./graph";
import { Step } from "./step";

// prettier-ignore
export type AlgorithmParamType<T> = 
  T extends string ? "vertex" // | "text"
  : "";

export interface AlgorithmParamDefinition<T> {
  type: AlgorithmParamType<T>;
  required?: boolean;
}

export type AlgorithmParamDefinitions<T> = { [K in keyof T]: AlgorithmParamDefinition<T[K]> };

export interface Algorithm<T extends object> {
  name: string;
  description: string;
  tags: string[];
  stepGenerator: (graph: Graph, params: T) => Step[];
  /** `params` are only used to generate appropriate input  fields */
  params: AlgorithmParamDefinitions<T>;
}

export const validateAlgorithmParams = <T extends object>(
  paramsDefinition: AlgorithmParamDefinitions<T>,
  valueToBeValidated: Record<string, string>
) => {
  return Object.entries(paramsDefinition)
    .filter(([, paramType]) => {
      return (paramType as AlgorithmParamDefinition<unknown>).required;
    })
    .every(([paramKey]) => {
      const paramValue = valueToBeValidated[paramKey];
      return paramValue && paramValue.trim() !== "";
    });
};
