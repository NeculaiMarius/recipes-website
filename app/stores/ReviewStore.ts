export const addReview=async(id_recipe:string,content:string,rating:number)=>{
  const response = await fetch('/api/reviews/add-review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_recipe: id_recipe,
      content: content,
      rating: rating,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}