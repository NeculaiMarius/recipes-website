export const followUser=async(id_user:string,id_followed_user:string)=>{
  const response= await fetch('/api/user/follow-user',{
    method:"POST",
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_user: id_user,
      id_followed_user: id_followed_user,
    }),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}


export const unfollowUser=async(id_user:string,id_followed_user:string)=>{
  const response= await fetch('/api/user/follow-user',{
    method:"DELETE",
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_user: id_user,
      id_followed_user: id_followed_user,
    }),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return true
}