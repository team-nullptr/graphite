import { Algorithm } from "~/types/algorithm";

type AlgorithmCardProps = {
  algorithm: Algorithm;
  onClick: () => void;
};

export const AlgorithmCard = ({ algorithm, onClick }: AlgorithmCardProps) => {
  return (
    <div
      className="flex flex-col gap-2 border-b border-slate-300 bg-slate-50 p-4 hover:cursor-pointer hover:bg-slate-100"
      onClick={onClick}
    >
      <span className="font-medium text-slate-800">{algorithm.name}</span>
      <p className="text-slate-600">{algorithm.description}</p>
      <div className="flex">
        {algorithm.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
};

type TagProps = {
  tag: string;
};

const Tag = ({ tag }: TagProps) => {
  return (
    <div className="text-text-base rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-xs">
      {tag}
    </div>
  );
};
