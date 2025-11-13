/**
 * CLI 인자로 전달된 프로젝트 이름을 정규화하고, 비어 있으면 에러를 던집니다.
 */
export const normalizeProjectName = (projectName: string): string => {
  const normalizedName = projectName.trim();

  if (!normalizedName) {
    throw new Error('Project name must not be empty.');
  }

  return normalizedName;
};

