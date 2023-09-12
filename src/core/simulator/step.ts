import { Highlights } from "./highlight";
import { State } from "./state";

export type Step = {
  description: string;
  state: State[];
  verticesHighlights: Highlights;
  edgesHighlights: Highlights;
};

export type StepRequiredOptions = Pick<Step, "description">;

export class StepBuilder {
  private target: Step;

  constructor(required: Pick<Step, "description">) {
    this.target = {
      ...required,
      state: [],
      verticesHighlights: new Map(),
      edgesHighlights: new Map(),
    };
  }

  state(state: State[]) {
    this.target.state = state;
    return this;
  }

  verticesHighlights(highlights: Highlights) {
    this.target.verticesHighlights = highlights;
    return this;
  }

  edgesHighlights(highlights: Highlights) {
    this.target.edgesHighlights = highlights;
    return this;
  }

  build() {
    return this.target;
  }
}
