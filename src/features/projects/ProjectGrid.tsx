import { useProjectStore } from "../../store/project";
import { useNavigate } from "react-router-dom";

export const ProjectGrid = () => {
  const navigate = useNavigate();

  const store = useProjectStore();

  const handleCreateProjectClick = () => {
    const createdProject = store.createProject();
    navigate(createdProject.id);
  };

  const handleProjectOpen = (projectId: string) => {
    navigate(projectId);
  };

  return (
    <>
      <h1>Projects</h1>
      <button onClick={handleCreateProjectClick}>Create new project</button>
      <ul>
        {[...store.projects.values()].map((project) => (
          <li key={project.id} onClick={() => handleProjectOpen(project.id)}>
            {project.name}
          </li>
        ))}
      </ul>
    </>
  );
};
