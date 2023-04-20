import { Project } from "./project/Project";
import { Lexer } from "./engine/gdl/lexer";

export const App = () => {
  (window as any).lexer = new Lexer();

  return (
    <>
      <Project id="p=1"></Project>
    </>
  );
};
