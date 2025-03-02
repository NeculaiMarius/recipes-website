export const likeRecipe=async(id_recipe:string,id_user:string)=>{
  const response = await fetch('/api/like-recipe/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
      id_user: id_user,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}

export const unlikeRecipe=async(id_recipe:string,id_user:string)=>{
  const response = await fetch('/api/like-recipe/unlike', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
      id_user: id_user,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}