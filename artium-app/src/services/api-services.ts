export const getMovieDetailsApi = async (
  titleId: string,
  page: number = 1
): Promise<any> => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=b9bd48a6&i=${titleId}`
  );
  return response.json();
};

export const getMovieListApi = async (
  query: string,
  page: number = 1
): Promise<any> => {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=b9bd48a6&s=${query}&page=${page}`
  );
  return response.json();
};
