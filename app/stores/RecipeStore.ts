export const likeRecipe=async(id_recipe:number,id_user:string)=>{
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

export const unlikeRecipe=async(id_recipe:number,id_user:string)=>{
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

export const saveRecipe=async(id_recipe:number,id_user:string)=>{
  const response = await fetch('/api/save-recipe', {
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

export const unSaveRecipe=async(id_recipe:number,id_user:string)=>{
  const response = await fetch('/api/save-recipe', {
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

export const deleteRecipe=async(recipeId:number)=>{
  const response=await fetch(`/api/recipe/${recipeId}`,{
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  else{
    return true;
  }
}

