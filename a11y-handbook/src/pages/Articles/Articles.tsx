import { Resource } from '../../types/resource';

interface ArticlesProps {
  resources: Resource[];
}

export function Articles({ resources }: ArticlesProps) {
  return (
    <div>
      <h1>Статьи</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Читать далее
          </a>
        </div>
      ))}
    </div>
  );
} 