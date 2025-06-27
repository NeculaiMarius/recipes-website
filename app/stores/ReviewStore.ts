export const addReview=async(id_recipe:string,content:string,rating:number)=>{
  const response = await fetch('/api/reviews', {
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

export const deleteReview=async(reviewId:number)=>{
  const response = await fetch(`/api/reviews/${reviewId}`,{
    method:"DELETE",
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}

export const likeReview=async(reviewId:number)=>{
  const response = await fetch(`/api/reviews/like/${reviewId}`,{
    method: "POST"
  })
  if(!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}

export const unlikeReview=async(reviewId:number)=>{
  const response = await fetch(`/api/reviews/like/${reviewId}`,{
    method: "DELETE"
  })
  if(!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true;
}

export const reportReview=async(reviewId:number,category:string,details:string)=>{
  const response =await fetch(`/api/reviews/report/${reviewId}`,{
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

export const getReviewReports=async(reviewId:number)=>{
  const response=await fetch(`/api/reviews/report/${reviewId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const reports=await response.json();
  return reports;
}

export const getReview=async(reviewId:number)=>{
  const response=await fetch(`/api/reviews/${reviewId}`)
  if(!response.ok){
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const review=await response.json();
  return review;
}