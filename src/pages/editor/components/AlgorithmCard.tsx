import { Algorithm } from "../../../types/algorithm";

type AlgorithmCardProps = {
  algorithm: Algorithm;
  onClick: () => void;
};

export const AlgorithmCard = ({ algorithm, onClick }: AlgorithmCardProps) => {
  return (
    <div
      className="flex flex-col gap-2 border-b border-base-300 p-4 hover:cursor-pointer hover:bg-base-hover-200"
      onClick={onClick}
    >
      <span className="font-medium text-text-base">{algorithm.name}</span>
      <p className="text-text-dimmed">{algorithm.description}</p>
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
    <div className="rounded-full bg-base-300 px-2 py-1 text-xs text-text-base">
      {tag}
    </div>
  );
};
