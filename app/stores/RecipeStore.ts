import exp from "constants";

export const likeRecipe=async(id_recipe:number)=>{
  const response = await fetch('/api/recipe/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}

export const unlikeRecipe=async(id_recipe:number)=>{
  const response = await fetch('/api/recipe/like', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}

export const saveRecipe=async(id_recipe:number)=>{
  const response = await fetch('/api/recipe/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}

export const unSaveRecipe=async(id_recipe:number)=>{
  const response = await fetch('/api/recipe/save', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
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

export const reportRecipe=async(recipeId:number,category:string,details:string)=>{
  const response =await fetch(`/api/recipe/report/${recipeId}`,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category: category,
      details: details,
    }),
  })
  if(!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}


export const getRecipeReports=async(recipeId:number)=>{
  const response=await fetch(`/api/recipe/report/${recipeId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const reports=await response.json();
  return reports;
}
