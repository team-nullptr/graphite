import {
  PropsWithChildren,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStore } from "zustand";
import { Project } from "~/types/project";
import { EditorState, EditorStore, createEditorStore } from "../store/editor";

// TODO: temporary
async function fetchFakeProject(projectId: string) {
  return new Promise<Project>((res) => {
    setTimeout(() =>
      res({
        metadata: {
          id: projectId,
          name: "fake",
        },
      })
    );
  });
}

export const EditorStoreContext = createContext<EditorStore | null>(null);

export type EditorStoreProviderProps = PropsWithChildren<{
  projectId: string;
  loadingFallback: ReactElement;
}>;

export function EditorStoreProvider({
  projectId,
  loadingFallback,
  children,
}: EditorStoreProviderProps) {
  // TODO: ultimately we probably want to use ReactQuery or sth ..
  const [loading, setLoading] = useState(true);
  const storeRef = useRef<EditorStore>();

  useEffect(() => {
    fetchFakeProject(projectId).then((project) => {
      storeRef.current = createEditorStore({ project });
      setLoading(false);
    });
  }, [projectId]);

  if (loading || !storeRef.current) {
    return loadingFallback;
  }

  return (
    <EditorStoreContext.Provider value={storeRef.current}>{children}</EditorStoreContext.Provider>
  );
}

export function useEditorStore<T>(
  selector: (state: EditorState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T {
  const store = useContext(EditorStoreContext);

  if (!store) {
    throw new Error("'useEditorStore' hook must be used inside <EditorStoreContext.Provider/>");
  }

  return useStore(store, selector, equalityFn);
}
